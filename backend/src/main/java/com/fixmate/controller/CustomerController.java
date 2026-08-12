package com.fixmate.controller;

import com.fixmate.dto.*;
import com.fixmate.entity.User;
import com.fixmate.service.BookingService;
import com.fixmate.service.CurrentUserService;
import com.fixmate.service.NotificationService;
import com.fixmate.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final BookingService bookingService;
    private final ReviewService reviewService;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    @PostMapping("/bookings")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest req) {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(bookingService.createBooking(customer, req));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> myBookings() {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(bookingService.getCustomerBookings(customer));
    }

    @GetMapping("/bookings/{id}/track")
    public ResponseEntity<List<BookingTrackingResponse>> trackBooking(@PathVariable Long id) {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(bookingService.getTracking(id, customer));
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(bookingService.cancelBooking(id, customer));
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> addReview(@Valid @RequestBody ReviewRequest req) {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(reviewService.addReview(customer, req));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> notifications() {
        User customer = currentUserService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getForUser(customer));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        User customer = currentUserService.getCurrentUser();
        notificationService.markAsRead(id, customer);
        return ResponseEntity.ok().build();
    }
}
