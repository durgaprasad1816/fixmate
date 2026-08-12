package com.fixmate.service;

import com.fixmate.dto.AdminStatsResponse;
import com.fixmate.dto.ProviderProfileResponse;
import com.fixmate.dto.RegisterProviderRequest;
import com.fixmate.dto.UpdateProviderRequest;
import com.fixmate.dto.UserResponse;
import com.fixmate.entity.BookingStatus;
import com.fixmate.entity.Role;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.BookingStatusHistoryRepository;
import com.fixmate.repository.ReviewRepository;
import com.fixmate.repository.NotificationRepository;
import com.fixmate.repository.ProviderProfileRepository;
import com.fixmate.repository.ServiceCategoryRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final BookingStatusHistoryRepository historyRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;


    @Transactional
    public ProviderProfileResponse createProvider(RegisterProviderRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new BadRequestException("An account with this phone number already exists");
        }

        ServiceCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Service category not found"));

        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.PROVIDER)
                .active(true)
                .build();
        userRepository.save(user);

        ProviderProfile profile = ProviderProfile.builder()
                .user(user)
                .category(category)
                .businessName(req.getBusinessName())
                .bio(req.getBio())
                .experienceYears(req.getExperienceYears())
                .address(req.getAddress())
                .verified(false)
                .blocked(false)
                .build();
        return ProviderProfileResponse.from(providerProfileRepository.save(profile));
    }

    @Transactional
    public ProviderProfileResponse updateProvider(Long providerId, UpdateProviderRequest req) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        User user = profile.getUser();

        if (userRepository.existsByEmailAndIdNot(req.getEmail(), user.getId())) {
            throw new BadRequestException("Another account already uses this email");
        }
        if (userRepository.existsByPhoneAndIdNot(req.getPhone(), user.getId())) {
            throw new BadRequestException("Another account already uses this phone number");
        }
        if (req.getCategoryId() != null) {
            ServiceCategory category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service category not found"));
            profile.setCategory(category);
        }

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        profile.setBusinessName(req.getBusinessName());
        profile.setBio(req.getBio());
        profile.setExperienceYears(req.getExperienceYears());
        profile.setAddress(req.getAddress());
        userRepository.save(user);
        return ProviderProfileResponse.from(providerProfileRepository.save(profile));
    }

    @Transactional
    public void deleteProviderPermanently(Long providerId) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        User user = profile.getUser();

        // Permanently remove dependent records first so foreign keys cannot block deletion.
        var bookings = bookingRepository.findByProviderOrderByCreatedAtDesc(profile);
        for (var booking : bookings) {
            reviewRepository.findByBooking(booking).ifPresent(reviewRepository::delete);
            historyRepository.deleteByBooking(booking);
        }
        bookingRepository.deleteAll(bookings);
        reviewRepository.deleteByProvider(profile);
        notificationRepository.deleteByUser(user);
        providerProfileRepository.delete(profile);
        userRepository.delete(user);
    }

    public AdminStatsResponse getStats() {
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalProviders = userRepository.countByRole(Role.PROVIDER);
        long totalCategories = categoryRepository.count();
        long totalBookings = bookingRepository.count();
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long completed = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);

        Map<String, Long> byCategory = new HashMap<>();
        List<ServiceCategory> categories = categoryRepository.findAll();
        for (ServiceCategory category : categories) {
            byCategory.put(category.getName(), bookingRepository.countByCategory(category));
        }

        return new AdminStatsResponse(totalCustomers, totalProviders, totalCategories,
                totalBookings, pending, completed, cancelled, byCategory);
    }

    public List<UserResponse> getAllCustomers() {
        return userRepository.findByRole(Role.CUSTOMER)
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse toggleCustomerActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (user.getRole() != Role.CUSTOMER) {
            throw new IllegalArgumentException("The selected user is not a customer");
        }

        user.setActive(!user.isActive());
        return UserResponse.from(userRepository.save(user));
    }
}
