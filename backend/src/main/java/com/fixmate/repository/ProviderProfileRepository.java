package com.fixmate.repository;

import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderProfileRepository extends JpaRepository<ProviderProfile, Long> {
    Optional<ProviderProfile> findByUser(User user);
    Optional<ProviderProfile> findByUserId(Long userId);
    List<ProviderProfile> findByCategoryAndVerifiedTrueAndBlockedFalse(ServiceCategory category);
    List<ProviderProfile> findByCategoryId(Long categoryId);
}
