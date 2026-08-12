package com.fixmate.repository;

import com.fixmate.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    Optional<ServiceCategory> findByNameIgnoreCase(String name);
    List<ServiceCategory> findByActiveTrue();
    boolean existsByNameIgnoreCase(String name);
}
