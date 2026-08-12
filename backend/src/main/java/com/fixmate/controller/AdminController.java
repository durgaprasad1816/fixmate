package com.fixmate.controller;

import com.fixmate.dto.*;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import com.fixmate.service.AdminService;
import com.fixmate.service.BookingService;
import com.fixmate.service.CategoryService;
import com.fixmate.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CategoryService categoryService;
    private final ProviderService providerService;
    private final BookingService bookingService;
    private final AdminService adminService;

    // ---------- Categories (occupations / types of work) ----------

    @PostMapping("/categories")
    public ResponseEntity<ServiceCategory> addCategory(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(categoryService.addCategory(req));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategory>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ServiceCategory> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(categoryService.updateCategory(id, req));
    }

    @PutMapping("/categories/{id}/toggle-active")
    public ResponseEntity<ServiceCategory> toggleCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.toggleActive(id));
    }

    // ---------- Providers ----------

    @PostMapping("/providers")
    public ResponseEntity<ProviderProfileResponse> createProvider(@Valid @RequestBody RegisterProviderRequest req) {
        return ResponseEntity.ok(adminService.createProvider(req));
    }

    @GetMapping("/providers")
    public ResponseEntity<List<ProviderProfileResponse>> getProviders() {
        return ResponseEntity.ok(providerService.getAllProviders());
    }

    @PutMapping("/providers/{id}")
    public ResponseEntity<ProviderProfileResponse> updateProvider(@PathVariable Long id, @Valid @RequestBody UpdateProviderRequest req) {
        return ResponseEntity.ok(adminService.updateProvider(id, req));
    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        adminService.deleteProviderPermanently(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/providers/{id}/verify")
    public ResponseEntity<ProviderProfileResponse> verifyProvider(@PathVariable Long id,
                                                                    @RequestBody ProviderVerifyRequest req) {
        var profile = providerService.setVerification(id, req.isVerified(), req.isBlocked());
        return ResponseEntity.ok(ProviderProfileResponse.from(profile));
    }

    // ---------- Customers ----------

    @GetMapping("/customers")
    public ResponseEntity<List<UserResponse>> getCustomers() {
        return ResponseEntity.ok(adminService.getAllCustomers());
    }

    @PutMapping("/customers/{id}/toggle-active")
    public ResponseEntity<UserResponse> toggleCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleCustomerActive(id));
    }

    // ---------- Bookings / track record ----------

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ---------- Dashboard stats ----------

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
