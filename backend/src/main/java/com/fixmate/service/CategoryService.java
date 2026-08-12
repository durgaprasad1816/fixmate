package com.fixmate.service;

import com.fixmate.dto.CategoryRequest;
import com.fixmate.entity.ServiceCategory;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Handles admin's ability to add/manage "occupations" (types of work) at runtime,
// with no code changes needed - exactly what was asked for.
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public ServiceCategory addCategory(CategoryRequest req) {
        if (categoryRepository.existsByNameIgnoreCase(req.getName())) {
            throw new BadRequestException("A category with this name already exists");
        }
        ServiceCategory category = ServiceCategory.builder()
                .name(req.getName())
                .description(req.getDescription())
                .active(true)
                .build();
        return categoryRepository.save(category);
    }

    public List<ServiceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<ServiceCategory> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public ServiceCategory toggleActive(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setActive(!category.isActive());
        return categoryRepository.save(category);
    }

    public ServiceCategory updateCategory(Long id, CategoryRequest req) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(req.getName());
        category.setDescription(req.getDescription());
        return categoryRepository.save(category);
    }
}
