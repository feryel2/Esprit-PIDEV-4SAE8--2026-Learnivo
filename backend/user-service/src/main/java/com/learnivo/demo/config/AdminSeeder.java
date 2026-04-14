package com.learnivo.demo.config;

import com.learnivo.demo.entity.Profile;
import com.learnivo.demo.entity.User;
import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import com.learnivo.demo.repository.ProfileRepository;
import com.learnivo.demo.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL    = "admin@learnivo.com";
    private static final String ADMIN_PASSWORD = "Admin12345";

    @PostConstruct
    public void seed() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return; // already exists
        }

        User admin = User.builder()
                .email(ADMIN_EMAIL)
                .passwordHash(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
        admin = userRepository.save(admin);

        Profile profile = Profile.builder()
                .user(admin)
                .firstName("Admin")
                .lastName("Learnivo")
                .build();
        profileRepository.save(profile);

        log.info("=================================================");
        log.info("  Admin account created:");
        log.info("  Email    : {}", ADMIN_EMAIL);
        log.info("  Password : {}", ADMIN_PASSWORD);
        log.info("=================================================");
    }
}