package com.fixmate.controller;

import com.fixmate.dto.*;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.User;
import com.fixmate.service.BookingService;
import com.fixmate.service.CurrentUserService;
import com.fixmate.service.NotificationService;
import com.fixmate.service.ProviderService;
import com.fixmate.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final BookingService bookingService;
    private final ProviderService providerService;
    private final ReviewService reviewService;
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    @GetMapping("/profile")
    public ResponseEntity<ProviderProfileResponse> myProfile() {
        User user = currentUserService.getCurrentUser();
        ProviderProfile profile = providerService.getProfileByUser(user);
        return ResponseEntity.ok(ProviderProfileResponse.from(profile));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> myBookings() {
        User user = currentUserService.getCurrentUser();
        ProviderProfile profile = providerService.getProfileByUser(user);
        return ResponseEntity.ok(bookingService.getProviderBookings(profile));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id,
                                                          @Valid @RequestBody BookingStatusUpdateRequest req) {
        User user = currentUserService.getCurrentUser();
        return ResponseEntity.ok(bookingService.updateStatus(id, user, req));
    }

    @GetMapping("/stats")
    public ResponseEntity<ProviderStatsResponse> stats() {
        User user = currentUserService.getCurrentUser();
        ProviderProfile profile = providerService.getProfileByUser(user);
        return ResponseEntity.ok(providerService.getStats(profile));
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> myReviews() {
        User user = currentUserService.getCurrentUser();
        ProviderProfile profile = providerService.getProfileByUser(user);
        return ResponseEntity.ok(reviewService.getReviewsForProvider(profile));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> notifications() {
        User user = currentUserService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getForUser(user));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        User user = currentUserService.getCurrentUser();
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok().build();
    }
}
