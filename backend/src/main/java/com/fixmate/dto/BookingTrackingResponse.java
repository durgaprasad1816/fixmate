package com.fixmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingTrackingResponse {
    private String status;
    private String note;
    private LocalDateTime timestamp;
}
