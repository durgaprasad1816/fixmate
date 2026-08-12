package com.fixmate.service;

import com.fixmate.dto.ProviderProfileResponse;
import com.fixmate.dto.ProviderStatsResponse;
import com.fixmate.entity.BookingStatus;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderProfileRepository providerProfileRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public ProviderProfile getProfileByUser(User user) {
        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
    }

    public List<ProviderProfileResponse> getVerifiedProvidersForCategory(ServiceCategory category) {
        return providerProfileRepository.findByCategoryAndVerifiedTrueAndBlockedFalse(category)
                .stream().map(ProviderProfileResponse::from).toList();
    }

    public List<ProviderProfileResponse> getAllProviders() {
        return providerProfileRepository.findAll()
                .stream().map(ProviderProfileResponse::from).toList();
    }

    public ProviderProfile setVerification(Long providerId, boolean verified, boolean blocked) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        boolean wasVerified = profile.isVerified();
        profile.setVerified(verified);
        profile.setBlocked(blocked);
        providerProfileRepository.save(profile);

        if (verified && !wasVerified) {
            notificationService.notify(profile.getUser(), "Account Verified",
                    "Congrats! Your provider account for \"" + profile.getBusinessName() +
                            "\" has been verified by admin. You can now receive bookings.");
        }
        return profile;
    }

    public ProviderStatsResponse getStats(ProviderProfile profile) {
        long pending = bookingRepository.countByProviderAndStatus(profile, BookingStatus.PENDING)
                + bookingRepository.countByProviderAndStatus(profile, BookingStatus.ACCEPTED)
                + bookingRepository.countByProviderAndStatus(profile, BookingStatus.IN_PROGRESS);

        return new ProviderStatsResponse(
                profile.getTotalOrders(),
                profile.getCompletedOrders(),
                pending,
                profile.getAvgRating(),
                profile.getTotalReviews()
        );
    }
}
