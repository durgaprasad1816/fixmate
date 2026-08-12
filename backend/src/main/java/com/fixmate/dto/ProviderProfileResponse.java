package com.fixmate.dto;

import com.fixmate.entity.ProviderProfile;
import lombok.Data;

@Data
public class ProviderProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String email;
    private String businessName;
    private String bio;
    private int experienceYears;
    private String address;
    private boolean verified;
    private boolean blocked;
    private double avgRating;
    private int totalReviews;
    private int totalOrders;
    private int completedOrders;
    private Long categoryId;
    private String categoryName;

    public static ProviderProfileResponse from(ProviderProfile p) {
        ProviderProfileResponse r = new ProviderProfileResponse();
        r.setId(p.getId());
        r.setUserId(p.getUser().getId());
        r.setFullName(p.getUser().getFullName());
        r.setPhone(p.getUser().getPhone());
        r.setEmail(p.getUser().getEmail());
        r.setBusinessName(p.getBusinessName());
        r.setBio(p.getBio());
        r.setExperienceYears(p.getExperienceYears());
        r.setAddress(p.getAddress());
        r.setVerified(p.isVerified());
        r.setBlocked(p.isBlocked());
        r.setAvgRating(p.getAvgRating());
        r.setTotalReviews(p.getTotalReviews());
        r.setTotalOrders(p.getTotalOrders());
        r.setCompletedOrders(p.getCompletedOrders());
        r.setCategoryId(p.getCategory().getId());
        r.setCategoryName(p.getCategory().getName());
        return r;
    }
}
