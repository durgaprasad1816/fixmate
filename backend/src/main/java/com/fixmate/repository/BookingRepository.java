package com.fixmate.repository;

import com.fixmate.entity.Booking;
import com.fixmate.entity.BookingStatus;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Booking> findByProviderOrderByCreatedAtDesc(ProviderProfile provider);
    List<Booking> findByProviderAndStatus(ProviderProfile provider, BookingStatus status);
    long countByProvider(ProviderProfile provider);
    long countByProviderAndStatus(ProviderProfile provider, BookingStatus status);
    long countByStatus(BookingStatus status);
    long countByCategory(ServiceCategory category);
    void deleteByProvider(ProviderProfile provider);
}
