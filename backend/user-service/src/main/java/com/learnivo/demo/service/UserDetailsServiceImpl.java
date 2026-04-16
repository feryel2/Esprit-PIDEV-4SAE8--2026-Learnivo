package com.learnivo.demo.service;

import com.learnivo.demo.entity.User;
import com.learnivo.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(user.getRole().name())
                .accountExpired(false)
                .accountLocked(user.getStatus() == com.learnivo.demo.enums.UserStatus.SUSPENDED)
                .credentialsExpired(false)
                .disabled(user.getStatus() != com.learnivo.demo.enums.UserStatus.ACTIVE)
                .build();
    }
}
