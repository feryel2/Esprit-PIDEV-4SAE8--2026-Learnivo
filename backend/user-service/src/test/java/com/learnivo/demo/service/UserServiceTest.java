package com.learnivo.demo.service;

import com.learnivo.demo.dto.user.UserCreateDTO;
import com.learnivo.demo.dto.user.UserResponseDTO;
import com.learnivo.demo.entity.Profile;
import com.learnivo.demo.entity.User;
import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import com.learnivo.demo.repository.ProfileRepository;
import com.learnivo.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService – Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private ProfileRepository profileRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    private UserCreateDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleDTO = new UserCreateDTO();
        sampleDTO.setEmail("test@example.com");
        sampleDTO.setPassword("password123");
        sampleDTO.setFirstName("John");
        sampleDTO.setLastName("Doe");
        sampleDTO.setRole(Role.STUDENT);
    }

    @Test
    @DisplayName("createUser() success")
    void createUser_success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_pass");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        UserResponseDTO result = userService.createUser(sampleDTO);

        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).save(any(User.class));
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    @DisplayName("createUser() throws exception when email exists")
    void createUser_emailExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(sampleDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    @DisplayName("getUserById() success")
    void getUserById_success() {
        User user = User.builder().id(1L).email("user@test.com").status(UserStatus.ACTIVE).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(profileRepository.findByUser(user)).thenReturn(Optional.empty());

        UserResponseDTO result = userService.getUserById(1L);

        assertThat(result.getEmail()).isEqualTo("user@test.com");
    }
}
