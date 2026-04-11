package com.learnivo.demo.service;

import com.learnivo.demo.dto.auth.AuthResponse;
import com.learnivo.demo.dto.auth.LoginRequest;
import com.learnivo.demo.dto.auth.MeResponse;
import com.learnivo.demo.dto.auth.RegisterRequest;
import com.learnivo.demo.entity.Profile;
import com.learnivo.demo.entity.User;
import com.learnivo.demo.entity.VerificationToken;
import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import com.learnivo.demo.repository.ProfileRepository;
import com.learnivo.demo.repository.UserRepository;
import com.learnivo.demo.repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final RecaptchaService recaptchaService;
    private final EmailService emailService;
    private final VerificationTokenRepository verificationTokenRepository;

    @Value("${app.url}")
    private String appUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!recaptchaService.verifyRecaptcha(request.getRecaptchaToken())) {
            throw new RuntimeException("Invalid Recaptcha token");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status(UserStatus.INACTIVE) // Account created but not verified
                .createdAt(LocalDateTime.now())
                .build();
        
        if (request.getRole() == Role.SOCIETY_AGENT) {
            user.setSocietyName(request.getSocietyName());
            user.setSocietyEmail(request.getSocietyEmail());
            user.setSocietyPhone(request.getSocietyPhone());
            user.setSocietyAddress(request.getSocietyAddress());
        }
        
        user = userRepository.save(user);
        
        Profile profile = Profile.builder()
                .user(user)
                .build();
        profileRepository.save(profile);

        // Create verification token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(verificationToken);

        // Send email
        emailService.sendVerificationEmail(user.getEmail(), token, appUrl);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            throw new RuntimeException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        verificationTokenRepository.delete(verificationToken);
        emailService.sendWelcomeEmail(user.getEmail());
    }
    
    public AuthResponse login(LoginRequest request) {
        if (!recaptchaService.verifyRecaptcha(request.getRecaptchaToken())) {
            throw new RuntimeException("Invalid Recaptcha token");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new RuntimeException("Account not verified. Please check your email.");
        } else if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("Account is suspended.");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
    
    public MeResponse getCurrentUser(User user) {
        Profile profile = profileRepository.findByUser(user).orElse(null);
        
        return MeResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .firstName(profile != null ? profile.getFirstName() : null)
                .lastName(profile != null ? profile.getLastName() : null)
                .phone(profile != null ? profile.getPhone() : null)
                .address(profile != null ? profile.getAddress() : null)
                .societyName(user.getSocietyName())
                .societyEmail(user.getSocietyEmail())
                .societyPhone(user.getSocietyPhone())
                .societyAddress(user.getSocietyAddress())
                .build();
    }
}
