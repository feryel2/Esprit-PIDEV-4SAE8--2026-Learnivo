package com.learnivo.demo.service;

import com.learnivo.demo.dto.auth.AuthResponse;
import com.learnivo.demo.dto.auth.LoginRequest;
import com.learnivo.demo.dto.auth.RegisterRequest;
import com.learnivo.demo.entity.User;
import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import com.learnivo.demo.repository.ProfileRepository;
import com.learnivo.demo.repository.UserRepository;
import com.learnivo.demo.repository.VerificationTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService – Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ProfileRepository profileRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsServiceImpl userDetailsService;
    @Mock
    private EmailService emailService;
    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("register() success")
    void register_success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@test.com");
        request.setPassword("pass");
        request.setRole(Role.STUDENT);

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mock(UserDetails.class));
        when(jwtService.generateToken(any())).thenReturn("jwt_token");

        AuthResponse response = authService.register(request);

        assertThat(response.getToken()).isEqualTo("jwt_token");
        assertThat(response.getEmail()).isEqualTo("new@test.com");
    }

    @Test
    @DisplayName("login() success")
    void login_success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@test.com");
        request.setPassword("pass");

        User user = User.builder().id(1L).email("test@test.com").status(UserStatus.ACTIVE).build();
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mock(UserDetails.class));
        when(jwtService.generateToken(any())).thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("jwt_token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
