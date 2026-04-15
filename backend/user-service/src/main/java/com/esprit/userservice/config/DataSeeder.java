package com.esprit.userservice.config;

import com.esprit.userservice.domain.UserRole;
import com.esprit.userservice.entity.AppUser;
import com.esprit.userservice.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUsers(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (appUserRepository.count() > 0) {
                return;
            }

            appUserRepository.save(new AppUser(
                    "Student Demo",
                    "student@learnivo.local",
                    passwordEncoder.encode("student123"),
                    UserRole.STUDENT
            ));

            appUserRepository.save(new AppUser(
                    "Teacher Demo",
                    "teacher@learnivo.local",
                    passwordEncoder.encode("teacher123"),
                    UserRole.TEACHER
            ));
        };
    }
}
