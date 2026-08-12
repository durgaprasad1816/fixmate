package com.fixmate.repository;

import com.fixmate.entity.OtpChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, Long> {
    Optional<OtpChallenge> findTopByPhoneAndPurposeOrderByCreatedAtDesc(String phone, String purpose);
    void deleteByPhoneAndPurpose(String phone, String purpose);
}
