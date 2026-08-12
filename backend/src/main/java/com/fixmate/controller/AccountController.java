package com.fixmate.controller;

import com.fixmate.dto.*;
import com.fixmate.entity.User;
import com.fixmate.service.AccountService;
import com.fixmate.service.CurrentUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final CurrentUserService currentUserService;

    @GetMapping("/profile")
    public ResponseEntity<AccountProfileResponse> profile() {
        return ResponseEntity.ok(accountService.getProfile(currentUserService.getCurrentUser()));
    }

    @PutMapping("/profile")
    public ResponseEntity<AccountProfileResponse> update(@Valid @RequestBody UpdateAccountRequest req) {
        return ResponseEntity.ok(accountService.updateProfile(currentUserService.getCurrentUser(), req));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        accountService.changePassword(currentUserService.getCurrentUser(), req);
        return ResponseEntity.ok().build();
    }
}
