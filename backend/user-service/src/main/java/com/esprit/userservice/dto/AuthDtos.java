package com.esprit.userservice.dto;

import com.esprit.userservice.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password,
            UserRole role
    ) {
    }

    public record LoginResponse(
            Long id,
            String fullName,
            String email,
            UserRole role,
            String redirectPath,
            String token
    ) {
    }

    public record UserResponse(
            Long id,
            String fullName,
            String email,
            UserRole role
    ) {
    }

    public record CurrentUserResponse(
            Long id,
            String fullName,
            String email,
            UserRole role,
            String redirectPath
    ) {
    }
}
