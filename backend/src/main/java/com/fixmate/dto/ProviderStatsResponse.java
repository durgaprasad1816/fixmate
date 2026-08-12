package com.fixmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProviderStatsResponse {
    private int totalOrders;
    private int completedOrders;
    private long pendingOrders;
    private double avgRating;
    private int totalReviews;
}
