package com.fixmate.service;

import com.fixmate.dto.*;
import com.fixmate.entity.*;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.UserRepository;
import com.fixmate.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse registerCustomer(RegisterCustomerRequest req) {
        validateUnique(req.getEmail(), req.getPhone());
        User user = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(Role.CUSTOMER)
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("This account has been deactivated. Contact admin.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getPhone(), user.getRole().name());
    }

    private void validateUnique(String email, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new BadRequestException("An account with this phone number already exists");
        }
    }
}
