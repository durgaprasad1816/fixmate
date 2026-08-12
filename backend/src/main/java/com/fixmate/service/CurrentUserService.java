package com.fixmate.service;

import com.fixmate.entity.User;
import com.fixmate.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

// Small helper to pull the logged-in user out of the Spring Security context
// so controllers/services can know "who is calling this API" from the JWT.
@Service
public class CurrentUserService {
    public User getCurrentUser() {
        CustomUserDetails details = (CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return details.getUser();
    }
}
