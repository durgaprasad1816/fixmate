package com.fixmate.dto;

import com.fixmate.entity.Review;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private int rating;
    private String comment;
    private String customerName;
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review r) {
        ReviewResponse dto = new ReviewResponse();
        dto.setId(r.getId());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCustomerName(r.getCustomer().getFullName());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
