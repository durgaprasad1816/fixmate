package com.fixmate.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class OtpResponse {
    private boolean sent;
    private String message;
    private String devOtp;
}
