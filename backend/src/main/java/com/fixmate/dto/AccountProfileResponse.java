package com.fixmate.dto;

import com.fixmate.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class AccountProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private boolean active;
    private String businessName;
    private String categoryName;
    private String bio;
    private Integer experienceYears;
    private String address;
    private Boolean verified;
    private Boolean blocked;

    public static AccountProfileResponse from(User user, com.fixmate.entity.ProviderProfile profile) {
        return new AccountProfileResponse(
                user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole().name(), user.isActive(),
                profile == null ? null : profile.getBusinessName(),
                profile == null || profile.getCategory() == null ? null : profile.getCategory().getName(),
                profile == null ? null : profile.getBio(),
                profile == null ? null : profile.getExperienceYears(),
                profile == null ? null : profile.getAddress(),
                profile == null ? null : profile.isVerified(),
                profile == null ? null : profile.isBlocked()
        );
    }
}
