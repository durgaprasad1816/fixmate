package com.fixmate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "provider_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ServiceCategory category;

    @Column(nullable = false)
    private String businessName;

    private String bio;

    @Builder.Default
    private int experienceYears = 0;

    private String address;

    // Admin must verify a provider before they show up to customers / can receive bookings.
    @Builder.Default
    private boolean verified = false;

    @Builder.Default
    private boolean blocked = false;

    @Builder.Default
    private double avgRating = 0.0;

    @Builder.Default
    private int totalReviews = 0;

    @Builder.Default
    private int totalOrders = 0;

    @Builder.Default
    private int completedOrders = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
