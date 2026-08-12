package com.fixmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalCustomers;
    private long totalProviders;
    private long totalCategories;
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long cancelledBookings;
    private Map<String, Long> bookingsByCategory;
}
