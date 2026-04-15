package com.esprit.userservice.service;

import com.esprit.userservice.domain.UserRole;
import com.esprit.userservice.dto.AuthDtos.LoginRequest;
import com.esprit.userservice.dto.AuthDtos.LoginResponse;
import com.esprit.userservice.dto.AuthDtos.CurrentUserResponse;
import com.esprit.userservice.dto.AuthDtos.UserResponse;
import com.esprit.userservice.entity.AppUser;
import com.esprit.userservice.exception.BadRequestException;
import com.esprit.userservice.repository.AppUserRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Transactional
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        if (request.role() == null) {
            throw new BadRequestException("Please select Student or Teacher access.");
        }

        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        String normalizedPassword = request.password().trim();
        AppUser user = appUserRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> createStudentUserIfAllowed(normalizedEmail, normalizedPassword, request.role()));

        if (!passwordMatches(normalizedPassword, user)) {
            throw new BadRequestException("Invalid email or password.");
        }

        if (user.getRole() != request.role()) {
            throw new BadRequestException("Selected access does not match this account.");
        }

        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getRole() == UserRole.TEACHER ? "/teacher" : "/student",
                jwtService.generateToken(user)
        );
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return appUserRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole()))
                .toList();
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse currentUser(String email) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Authenticated user not found."));
        return new CurrentUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getRole() == UserRole.TEACHER ? "/teacher" : "/student"
        );
    }

    private AppUser createStudentUserIfAllowed(String email, String password, UserRole role) {
        if (role != UserRole.STUDENT) {
            throw new BadRequestException("Invalid email or password.");
        }

        if (!email.endsWith("@learnivo.local")) {
            throw new BadRequestException("Student email must use the @learnivo.local domain.");
        }

        if (password.isBlank()) {
            throw new BadRequestException("Password is required.");
        }

        String fullName = buildStudentDisplayName(email);
        return appUserRepository.save(new AppUser(fullName, email, passwordEncoder.encode(password), UserRole.STUDENT));
    }

    private boolean passwordMatches(String rawPassword, AppUser user) {
        String storedPassword = user.getPassword();
        if (isEncodedPassword(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        boolean matches = storedPassword.equals(rawPassword);
        if (matches) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            appUserRepository.save(user);
        }
        return matches;
    }

    private boolean isEncodedPassword(String password) {
        return password != null && password.startsWith("$2");
    }

    private String buildStudentDisplayName(String email) {
        String localPart = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        String cleaned = localPart.replace('.', ' ').replace('_', ' ').replace('-', ' ').trim();

        if (cleaned.isBlank()) {
            return "Student";
        }

        String[] tokens = cleaned.split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String token : tokens) {
            if (token.isBlank()) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(' ');
            }
            builder.append(Character.toUpperCase(token.charAt(0)));
            if (token.length() > 1) {
                builder.append(token.substring(1).toLowerCase(Locale.ROOT));
            }
        }

        return builder.toString();
    }
}
