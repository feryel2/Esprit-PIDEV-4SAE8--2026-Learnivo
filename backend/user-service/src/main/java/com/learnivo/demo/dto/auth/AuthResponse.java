package com.learnivo.demo.dto.auth;

import com.learnivo.demo.enums.Role;

public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private Role role;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email, Role role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public static class AuthResponseBuilder {
        private String token;
        private Long userId;
        private String email;
        private Role role;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, userId, email, role);
        }
    }
}
