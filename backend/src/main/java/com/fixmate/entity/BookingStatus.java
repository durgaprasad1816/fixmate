package com.fixmate.entity;

public enum BookingStatus {
    PENDING,      // just created by customer, waiting for provider to accept
    ACCEPTED,     // provider accepted, work not started yet
    REJECTED,     // provider rejected the booking
    IN_PROGRESS,  // provider started the work
    COMPLETED,    // work finished
    CANCELLED     // cancelled by customer
}
