package com.fixmate.service;

import com.fixmate.dto.BookingRequest;
import com.fixmate.dto.BookingResponse;
import com.fixmate.dto.BookingStatusUpdateRequest;
import com.fixmate.dto.BookingTrackingResponse;
import com.fixmate.entity.*;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingStatusHistoryRepository historyRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse createBooking(User customer, BookingRequest req) {
        ProviderProfile provider = providerProfileRepository.findById(req.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (!provider.isVerified() || provider.isBlocked()) {
            throw new BadRequestException("This provider is not currently available for bookings");
        }

        ServiceCategory category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Service category not found"));

        if (provider.getCategory() == null || !provider.getCategory().getId().equals(category.getId())) {
            throw new BadRequestException("The selected provider does not offer the selected service category");
        }

        Booking booking = Booking.builder()
                .customer(customer)
                .provider(provider)
                .category(category)
                .description(req.getDescription())
                .address(req.getAddress())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .scheduledDate(req.getScheduledDate())
                .status(BookingStatus.PENDING)
                .build();
        bookingRepository.save(booking);

        recordHistory(booking, BookingStatus.PENDING, "Booking created by customer");

        provider.setTotalOrders(provider.getTotalOrders() + 1);
        providerProfileRepository.save(provider);

        notificationService.notify(provider.getUser(), "New Booking Request",
                customer.getFullName() + " requested \"" + category.getName() + "\" service. Please accept or reject it.");

        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, User providerUser, BookingStatusUpdateRequest req) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getProvider().getUser().getId().equals(providerUser.getId())) {
            throw new BadRequestException("You are not authorized to update this booking");
        }

        validateTransition(booking.getStatus(), req.getStatus());

        booking.setStatus(req.getStatus());
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        recordHistory(booking, req.getStatus(), req.getNote());

        if (req.getStatus() == BookingStatus.COMPLETED) {
            ProviderProfile provider = booking.getProvider();
            provider.setCompletedOrders(provider.getCompletedOrders() + 1);
            providerProfileRepository.save(provider);
        }

        notificationService.notify(booking.getCustomer(), "Booking Update",
                "Your booking #" + booking.getId() + " (" + booking.getCategory().getName() + ") is now " + req.getStatus());

        return BookingResponse.from(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, User customer) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking can no longer be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        recordHistory(booking, BookingStatus.CANCELLED, "Cancelled by customer");

        notificationService.notify(booking.getProvider().getUser(), "Booking Cancelled",
                "Booking #" + booking.getId() + " was cancelled by the customer.");

        return BookingResponse.from(booking);
    }

    public List<BookingResponse> getCustomerBookings(User customer) {
        return bookingRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream().map(BookingResponse::from).toList();
    }

    public List<BookingResponse> getProviderBookings(ProviderProfile provider) {
        return bookingRepository.findByProviderOrderByCreatedAtDesc(provider)
                .stream().map(BookingResponse::from).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(BookingResponse::from).toList();
    }

    public List<BookingTrackingResponse> getTracking(Long bookingId, User customer) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new BadRequestException("You are not authorized to view this booking");
        }

        return historyRepository.findByBookingOrderByTimestampAsc(booking)
                .stream()
                .map(h -> new BookingTrackingResponse(h.getStatus().name(), h.getNote(), h.getTimestamp()))
                .toList();
    }

    public Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private void recordHistory(Booking booking, BookingStatus status, String note) {
        historyRepository.save(BookingStatusHistory.builder()
                .booking(booking)
                .status(status)
                .note(note)
                .build());
    }

    // Keeps the booking lifecycle sane: providers can only move a booking forward
    // through a valid sequence, not jump around arbitrarily.
    private void validateTransition(BookingStatus current, BookingStatus next) {
        boolean valid = switch (current) {
            case PENDING -> next == BookingStatus.ACCEPTED || next == BookingStatus.REJECTED;
            case ACCEPTED -> next == BookingStatus.IN_PROGRESS;
            case IN_PROGRESS -> next == BookingStatus.COMPLETED;
            default -> false;
        };
        if (!valid) {
            throw new BadRequestException("Cannot change booking status from " + current + " to " + next);
        }
    }
}
