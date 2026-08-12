package com.fixmate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Used by admin to add a brand-new occupation/type of work.
@Data
public class CategoryRequest {
    @NotBlank
    private String name;
    private String description;
}
