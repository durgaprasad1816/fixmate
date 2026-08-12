package com.fixmate.service;

import com.fixmate.dto.AccountProfileResponse;
import com.fixmate.dto.ChangePasswordRequest;
import com.fixmate.dto.UpdateAccountRequest;
import com.fixmate.entity.ProviderProfile;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.repository.ProviderProfileRepository;
import com.fixmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AccountProfileResponse getProfile(User user) {
        ProviderProfile profile = user.getRole().name().equals("PROVIDER")
                ? providerProfileRepository.findByUser(user).orElse(null) : null;
        return AccountProfileResponse.from(user, profile);
    }

    @Transactional
    public AccountProfileResponse updateProfile(User user, UpdateAccountRequest req) {
        if (userRepository.existsByEmailAndIdNot(req.getEmail(), user.getId()))
            throw new BadRequestException("Another account already uses this email");
        if (userRepository.existsByPhoneAndIdNot(req.getPhone(), user.getId()))
            throw new BadRequestException("Another account already uses this phone number");
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        User saved = userRepository.save(user);
        ProviderProfile profile = saved.getRole().name().equals("PROVIDER") ? providerProfileRepository.findByUser(saved).orElse(null) : null;
        return AccountProfileResponse.from(saved, profile);
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest req) {
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            throw new BadRequestException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
