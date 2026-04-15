package com.esprit.userservice.controller;

import com.esprit.userservice.dto.AuthDtos.LoginRequest;
import com.esprit.userservice.dto.AuthDtos.LoginResponse;
import com.esprit.userservice.dto.AuthDtos.CurrentUserResponse;
import com.esprit.userservice.dto.AuthDtos.UserResponse;
import com.esprit.userservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Users", description = "Authentication and user lookup endpoints.")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Authenticate a teacher or student")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Authentication succeeded"),
            @ApiResponse(responseCode = "400", description = "Invalid credentials or role", content = @Content)
    })
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/auth/me")
    @Operation(summary = "Get the currently authenticated user")
    public CurrentUserResponse currentUser(Authentication authentication) {
        return authService.currentUser(authentication.getName());
    }

    @GetMapping("/users")
    @Operation(summary = "List registered users")
    public List<UserResponse> users() {
        return authService.findAll();
    }
}
