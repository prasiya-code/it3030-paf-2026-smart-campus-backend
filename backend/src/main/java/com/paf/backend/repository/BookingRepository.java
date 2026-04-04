package com.paf.backend.repository;

import com.paf.backend.entity.Booking;
import com.paf.backend.entity.Resource;
import com.paf.backend.entity.User;
import com.paf.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByBookingDate(LocalDate bookingDate);

    List<Booking> findByResourceAndBookingDate(Resource resource, LocalDate bookingDate);

    List<Booking> findByUserAndStatus(User user, BookingStatus status);

    List<Booking> findByResourceAndBookingDateAndStatusIn(
            Resource resource,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    boolean existsByResourceAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThanAndStatusIn(
            Resource resource,
            LocalDate bookingDate,
            LocalTime endTime,
            LocalTime startTime,
            List<BookingStatus> statuses
    );
}