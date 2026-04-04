package com.paf.backend.dto;

import com.paf.backend.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class BookingStatusUpdateDto {

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String rejectionReason;

    public BookingStatusUpdateDto() {
    }

    public BookingStatusUpdateDto(BookingStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}