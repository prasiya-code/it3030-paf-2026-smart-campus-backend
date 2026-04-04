package com.paf.backend.service.impl;

import com.paf.backend.dto.BookingRequestDto;
import com.paf.backend.dto.BookingResponseDto;
import com.paf.backend.dto.BookingStatusUpdateDto;
import com.paf.backend.entity.Booking;
import com.paf.backend.entity.Resource;
import com.paf.backend.entity.User;
import com.paf.backend.enums.BookingStatus;
import com.paf.backend.enums.ResourceStatus;
import com.paf.backend.exception.BadRequestException;
import com.paf.backend.exception.ConflictException;
import com.paf.backend.exception.ResourceNotFoundException;
import com.paf.backend.repository.BookingRepository;
import com.paf.backend.repository.ResourceRepository;
import com.paf.backend.repository.UserRepository;
import com.paf.backend.service.BookingService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              ResourceRepository resourceRepository,
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BookingResponseDto createBooking(BookingRequestDto requestDto) {

        Resource resource = resourceRepository.findById(requestDto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found with id: " + requestDto.getResourceId()
                ));

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + requestDto.getUserId()
                ));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new BadRequestException("Selected resource is not active for booking");
        }

        if (requestDto.getStartTime().isAfter(requestDto.getEndTime()) ||
                requestDto.getStartTime().equals(requestDto.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        boolean hasConflict = bookingRepository
                .existsByResourceAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatusIn(
                        resource,
                        requestDto.getBookingDate(),
                        requestDto.getEndTime(),
                        requestDto.getStartTime(),
                        List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
                );

        if (hasConflict) {
            throw new ConflictException("Booking conflict detected for the selected resource and time range");
        }

        Booking booking = new Booking();
        booking.setResource(resource);
        booking.setUser(user);
        booking.setBookingDate(requestDto.getBookingDate());
        booking.setStartTime(requestDto.getStartTime());
        booking.setEndTime(requestDto.getEndTime());
        booking.setPurpose(requestDto.getPurpose());
        booking.setExpectedAttendees(requestDto.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setRejectionReason(null);

        Booking savedBooking = bookingRepository.save(booking);

        return mapToResponse(savedBooking);
    }

    @Override
    public BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId
                ));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cancelled booking cannot be updated");
        }

        if (statusUpdateDto.getStatus() != BookingStatus.APPROVED &&
                statusUpdateDto.getStatus() != BookingStatus.REJECTED) {
            throw new BadRequestException("Booking status can only be updated to APPROVED or REJECTED");
        }

        if (statusUpdateDto.getStatus() == BookingStatus.REJECTED &&
                (statusUpdateDto.getRejectionReason() == null ||
                 statusUpdateDto.getRejectionReason().isBlank())) {
            throw new BadRequestException("Rejection reason is required when rejecting a booking");
        }

        booking.setStatus(statusUpdateDto.getStatus());

        if (statusUpdateDto.getStatus() == BookingStatus.REJECTED) {
            booking.setRejectionReason(statusUpdateDto.getRejectionReason());
        } else {
            booking.setRejectionReason(null);
        }

        Booking updatedBooking = bookingRepository.save(booking);

        return mapToResponse(updatedBooking);
    }

    @Override
    public BookingResponseDto cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId
                ));

        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Rejected booking cannot be cancelled");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Booking cancelledBooking = bookingRepository.save(booking);

        return mapToResponse(cancelledBooking);
    }

    @Override
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<BookingResponseDto> getBookingsByUserId(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BookingResponseDto mapToResponse(Booking booking) {
        BookingResponseDto dto = new BookingResponseDto();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResource().getId());
        dto.setResourceName(booking.getResource().getName());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getName());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        return dto;
    }
}