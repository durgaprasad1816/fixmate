package com.fixmate.dto;

import lombok.Data;

@Data
public class ProviderVerifyRequest {
    private boolean verified;
    private boolean blocked;
}
