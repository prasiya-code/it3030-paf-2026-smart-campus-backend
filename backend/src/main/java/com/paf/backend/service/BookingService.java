package com.paf.backend.service;

import com.paf.backend.dto.BookingRequestDto;
import com.paf.backend.dto.BookingResponseDto;
import com.paf.backend.dto.BookingStatusUpdateDto;

import java.util.List;

public interface BookingService {

    BookingResponseDto createBooking(BookingRequestDto requestDto);

    BookingResponseDto updateBookingStatus(Long bookingId, BookingStatusUpdateDto statusUpdateDto);

    BookingResponseDto cancelBooking(Long bookingId);

    List<BookingResponseDto> getAllBookings();

    List<BookingResponseDto> getBookingsByUserId(Long userId);
}