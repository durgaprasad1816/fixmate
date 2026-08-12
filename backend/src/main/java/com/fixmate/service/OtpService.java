package com.fixmate.service;

import com.fixmate.dto.OtpResponse;
import com.fixmate.entity.OtpChallenge;
import com.fixmate.exception.BadRequestException;
import com.fixmate.repository.OtpChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final OtpChallengeRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final SecureRandom random = new SecureRandom();

    @Value("${fixmate.otp.expiration-minutes:5}")
    private int expirationMinutes;
    @Value("${fixmate.otp.dev-mode:true}")
    private boolean devMode;

    @Transactional
    public OtpResponse send(String phone, String purpose) {
        String normalizedPurpose = normalizePurpose(purpose);
        repository.deleteByPhoneAndPurpose(phone, normalizedPurpose);
        String otp = String.format("%06d", random.nextInt(1_000_000));
        OtpChallenge challenge = OtpChallenge.builder()
                .phone(phone).purpose(normalizedPurpose)
                .codeHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .build();
        repository.save(challenge);
        smsService.sendOtp(phone, otp);
        return new OtpResponse(true, "OTP sent successfully", devMode ? otp : null);
    }

    @Transactional
    public void verify(String phone, String purpose, String otp) {
        OtpChallenge challenge = repository.findTopByPhoneAndPurposeOrderByCreatedAtDesc(phone, normalizePurpose(purpose))
                .orElseThrow(() -> new BadRequestException("OTP not found. Request a new OTP."));
        if (challenge.isVerified()) throw new BadRequestException("OTP already used");
        if (challenge.getExpiresAt().isBefore(LocalDateTime.now())) throw new BadRequestException("OTP expired. Request a new OTP.");
        if (challenge.getAttempts() >= 5) throw new BadRequestException("Too many incorrect attempts. Request a new OTP.");
        if (!passwordEncoder.matches(otp, challenge.getCodeHash())) {
            challenge.setAttempts(challenge.getAttempts() + 1);
            repository.save(challenge);
            throw new BadRequestException("Invalid OTP");
        }
        challenge.setVerified(true);
        repository.save(challenge);
    }

    @Transactional
    public void consumeVerified(String phone, String purpose) {
        OtpChallenge challenge = repository.findTopByPhoneAndPurposeOrderByCreatedAtDesc(phone, normalizePurpose(purpose))
                .orElseThrow(() -> new BadRequestException("Please verify the OTP first"));
        if (!challenge.isVerified() || challenge.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Please verify the OTP first");
        repository.delete(challenge);
    }

    private String normalizePurpose(String purpose) {
        if (purpose == null) throw new BadRequestException("OTP purpose is required");
        return purpose.trim().toUpperCase();
    }
}
