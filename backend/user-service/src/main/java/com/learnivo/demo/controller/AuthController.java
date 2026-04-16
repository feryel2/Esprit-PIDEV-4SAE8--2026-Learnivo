package com.learnivo.demo.controller;

import com.learnivo.demo.dto.auth.AuthResponse;
import com.learnivo.demo.dto.auth.LoginRequest;
import com.learnivo.demo.dto.auth.MeResponse;
import com.learnivo.demo.dto.auth.RegisterRequest;
import com.learnivo.demo.entity.User;
import com.learnivo.demo.service.AuthService;
import com.learnivo.demo.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<MeResponse> getCurrentUser() {
        User user = SecurityUtil.getCurrentUser();
        MeResponse response = authService.getCurrentUser(user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully");
    }
}
