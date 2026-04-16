package com.learnivo.demo.entity;

import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, name = "password_hash")
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    // Champs spécifiques pour SocietyAgent
    @Column(name = "society_name")
    private String societyName;
    
    @Column(name = "society_email")
    private String societyEmail;
    
    @Column(name = "society_phone")
    private String societyPhone;
    
    @Column(name = "society_address")
    private String societyAddress;

    public User() {}

    public User(Long id, String email, String passwordHash, Role role, UserStatus status, LocalDateTime createdAt, LocalDateTime lastLogin, String societyName, String societyEmail, String societyPhone, String societyAddress) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = status != null ? status : UserStatus.ACTIVE;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.societyName = societyName;
        this.societyEmail = societyEmail;
        this.societyPhone = societyPhone;
        this.societyAddress = societyAddress;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }
    public String getSocietyEmail() { return societyEmail; }
    public void setSocietyEmail(String societyEmail) { this.societyEmail = societyEmail; }
    public String getSocietyPhone() { return societyPhone; }
    public void setSocietyPhone(String societyPhone) { this.societyPhone = societyPhone; }
    public String getSocietyAddress() { return societyAddress; }
    public void setSocietyAddress(String societyAddress) { this.societyAddress = societyAddress; }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String passwordHash;
        private Role role;
        private UserStatus status = UserStatus.ACTIVE;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private String societyName;
        private String societyEmail;
        private String societyPhone;
        private String societyAddress;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder status(UserStatus status) { this.status = status; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder lastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; return this; }
        public UserBuilder societyName(String societyName) { this.societyName = societyName; return this; }
        public UserBuilder societyEmail(String societyEmail) { this.societyEmail = societyEmail; return this; }
        public UserBuilder societyPhone(String societyPhone) { this.societyPhone = societyPhone; return this; }
        public UserBuilder societyAddress(String societyAddress) { this.societyAddress = societyAddress; return this; }

        public User build() {
            return new User(id, email, passwordHash, role, status, createdAt, lastLogin, societyName, societyEmail, societyPhone, societyAddress);
        }
    }
}
