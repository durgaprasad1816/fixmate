package com.fixmate.config;

import com.fixmate.entity.Role;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.entity.User;
import com.fixmate.repository.ServiceCategoryRepository;
import com.fixmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

// Runs once on startup: creates the default admin account and a starter set of
// service categories (occupations) so the app is usable immediately.
// Admin can add more categories later from the Admin Dashboard - no code changes needed.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${fixmate.admin.email}")
    private String adminEmail;

    @Value("${fixmate.admin.password}")
    private String adminPassword;

    @Value("${fixmate.admin.phone}")
    private String adminPhone;

    @Value("${fixmate.admin.seed-enabled:false}")
    private boolean adminSeedEnabled;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategories();
    }

    private void seedAdmin() {
        if (!adminSeedEnabled) {
            return;
        }

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .fullName("FixMate Admin")
                    .email(adminEmail)
                    .phone(adminPhone)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Seeded default admin -> email: " + adminEmail);
        }
    }

    private void seedCategories() {
        List<String[]> defaults = List.of(
                new String[]{"AC Repair & Services", "Foam wash, gas refill, installation, uninstallation and repair of ACs."},
                new String[]{"Plastic Welding", "Repair of plastic items, furniture and household plastic parts."},
                new String[]{"Electrical Work", "Wiring, switchboards, fittings and general electrical repairs."},
                new String[]{"Plumbing", "Pipe fitting, leak repair, bathroom and kitchen plumbing work."}
        );

        for (String[] cat : defaults) {
            if (!categoryRepository.existsByNameIgnoreCase(cat[0])) {
                categoryRepository.save(ServiceCategory.builder()
                        .name(cat[0])
                        .description(cat[1])
                        .active(true)
                        .build());
            }
        }
    }
}
