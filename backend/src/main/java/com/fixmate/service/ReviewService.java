package com.fixmate.service;

import com.fixmate.dto.ReviewRequest;
import com.fixmate.dto.ReviewResponse;
import com.fixmate.entity.Booking;
import com.fixmate.entity.BookingStatus;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.Review;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderProfileRepository;
import com.fixmate.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReviewResponse addReview(User customer, ReviewRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new BadRequestException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You can only review your own bookings");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can only review a booking after it is completed");
        }
        if (reviewRepository.existsByBooking(booking)) {
            throw new BadRequestException("You have already reviewed this booking");
        }

        ProviderProfile provider = booking.getProvider();

        Review review = Review.builder()
                .booking(booking)
                .customer(customer)
                .provider(provider)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();
        reviewRepository.save(review);

        // Recalculate the provider's running average rating.
        double newAvg = ((provider.getAvgRating() * provider.getTotalReviews()) + req.getRating())
                / (provider.getTotalReviews() + 1);
        provider.setAvgRating(Math.round(newAvg * 10.0) / 10.0);
        provider.setTotalReviews(provider.getTotalReviews() + 1);
        providerProfileRepository.save(provider);

        notificationService.notify(provider.getUser(), "New Review",
                customer.getFullName() + " rated your service " + req.getRating() + "/5.");

        return ReviewResponse.from(review);
    }

    public List<ReviewResponse> getReviewsForProvider(ProviderProfile provider) {
        return reviewRepository.findByProviderOrderByCreatedAtDesc(provider)
                .stream().map(ReviewResponse::from).toList();
    }
}
