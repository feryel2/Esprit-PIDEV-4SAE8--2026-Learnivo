package com.learnivo.demo.dto.auth;

import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import java.time.LocalDateTime;

public class MeResponse {
    private Long id;
    private String email;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    // SocietyAgent fields
    private String societyName;
    private String societyEmail;
    private String societyPhone;
    private String societyAddress;

    public MeResponse() {}

    public MeResponse(Long id, String email, Role role, UserStatus status, LocalDateTime createdAt, LocalDateTime lastLogin, String firstName, String lastName, String phone, String address, String societyName, String societyEmail, String societyPhone, String societyAddress) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.societyName = societyName;
        this.societyEmail = societyEmail;
        this.societyPhone = societyPhone;
        this.societyAddress = societyAddress;
    }

    public static MeResponseBuilder builder() {
        return new MeResponseBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }
    public String getSocietyEmail() { return societyEmail; }
    public void setSocietyEmail(String societyEmail) { this.societyEmail = societyEmail; }
    public String getSocietyPhone() { return societyPhone; }
    public void setSocietyPhone(String societyPhone) { this.societyPhone = societyPhone; }
    public String getSocietyAddress() { return societyAddress; }
    public void setSocietyAddress(String societyAddress) { this.societyAddress = societyAddress; }

    public static class MeResponseBuilder {
        private Long id;
        private String email;
        private Role role;
        private UserStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private String firstName;
        private String lastName;
        private String phone;
        private String address;
        private String societyName;
        private String societyEmail;
        private String societyPhone;
        private String societyAddress;

        public MeResponseBuilder id(Long id) { this.id = id; return this; }
        public MeResponseBuilder email(String email) { this.email = email; return this; }
        public MeResponseBuilder role(Role role) { this.role = role; return this; }
        public MeResponseBuilder status(UserStatus status) { this.status = status; return this; }
        public MeResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public MeResponseBuilder lastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; return this; }
        public MeResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public MeResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public MeResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public MeResponseBuilder address(String address) { this.address = address; return this; }
        public MeResponseBuilder societyName(String societyName) { this.societyName = societyName; return this; }
        public MeResponseBuilder societyEmail(String societyEmail) { this.societyEmail = societyEmail; return this; }
        public MeResponseBuilder societyPhone(String societyPhone) { this.societyPhone = societyPhone; return this; }
        public MeResponseBuilder societyAddress(String societyAddress) { this.societyAddress = societyAddress; return this; }

        public MeResponse build() {
            return new MeResponse(id, email, role, status, createdAt, lastLogin, firstName, lastName, phone, address, societyName, societyEmail, societyPhone, societyAddress);
        }
    }
}
