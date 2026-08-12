package com.fixmate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterCustomerRequest {
    @NotBlank
    private String fullName;
    @NotBlank @Email
    private String email;
    @NotBlank @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;
    @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
