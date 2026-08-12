package com.fixmate.controller;

import com.fixmate.dto.ProviderProfileResponse;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.ServiceCategoryRepository;
import com.fixmate.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Endpoints anyone can hit without logging in - browsing categories/providers
// before you decide to register, like an app store preview.
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final ServiceCategoryRepository categoryRepository;
    private final ProviderService providerService;

    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findByActiveTrue());
    }

    @GetMapping("/categories/{categoryId}/providers")
    public ResponseEntity<List<ProviderProfileResponse>> getProviders(@PathVariable Long categoryId) {
        ServiceCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return ResponseEntity.ok(providerService.getVerifiedProvidersForCategory(category));
    }
}
