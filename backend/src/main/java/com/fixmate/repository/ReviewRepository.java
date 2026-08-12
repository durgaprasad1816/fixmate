package com.fixmate.repository;

import com.fixmate.entity.Booking;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderOrderByCreatedAtDesc(ProviderProfile provider);
    Optional<Review> findByBooking(Booking booking);
    boolean existsByBooking(Booking booking);
    void deleteByProvider(ProviderProfile provider);
}
