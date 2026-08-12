package com.fixmate.controller;

import com.fixmate.dto.OtpResponse;
import com.fixmate.dto.OtpSendRequest;
import com.fixmate.dto.OtpVerifyRequest;
import com.fixmate.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
public class OtpController {
    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<OtpResponse> send(@Valid @RequestBody OtpSendRequest req) {
        return ResponseEntity.ok(otpService.send(req.getPhone(), req.getPurpose()));
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verify(@Valid @RequestBody OtpVerifyRequest req) {
        otpService.verify(req.getPhone(), req.getPurpose(), req.getOtp());
        return ResponseEntity.ok().build();
    }
}
