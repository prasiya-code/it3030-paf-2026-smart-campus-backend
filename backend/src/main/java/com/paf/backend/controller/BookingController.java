package com.paf.backend.controller;

import com.paf.backend.dto.BookingRequestDto;
import com.paf.backend.dto.BookingResponseDto;
import com.paf.backend.dto.BookingStatusUpdateDto;
import com.paf.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ✅ Create booking
    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingRequestDto requestDto) {
        return ResponseEntity.ok(bookingService.createBooking(requestDto));
    }

    // ✅ Approve / Reject booking
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateDto statusDto) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, statusDto));
    }

    // ✅ Cancel booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDto> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // ✅ Get all bookings (admin)
    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Get bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDto>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }
}