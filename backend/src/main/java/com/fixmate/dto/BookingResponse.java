package com.fixmate.dto;

import com.fixmate.entity.Booking;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponse {
    private Long id;
    private String status;
    private String description;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime scheduledDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long customerId;
    private String customerName;
    private String customerPhone;

    private Long providerId;
    private String providerBusinessName;
    private String providerOwnerName;
    private String providerPhone;

    private Long categoryId;
    private String categoryName;

    public static BookingResponse from(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setStatus(b.getStatus().name());
        r.setDescription(b.getDescription());
        r.setAddress(b.getAddress());
        r.setLatitude(b.getLatitude());
        r.setLongitude(b.getLongitude());
        r.setScheduledDate(b.getScheduledDate());
        r.setCreatedAt(b.getCreatedAt());
        r.setUpdatedAt(b.getUpdatedAt());

        r.setCustomerId(b.getCustomer().getId());
        r.setCustomerName(b.getCustomer().getFullName());
        r.setCustomerPhone(b.getCustomer().getPhone());

        r.setProviderId(b.getProvider().getId());
        r.setProviderBusinessName(b.getProvider().getBusinessName());
        r.setProviderOwnerName(b.getProvider().getUser().getFullName());
        r.setProviderPhone(b.getProvider().getUser().getPhone());

        r.setCategoryId(b.getCategory().getId());
        r.setCategoryName(b.getCategory().getName());
        return r;
    }
}
