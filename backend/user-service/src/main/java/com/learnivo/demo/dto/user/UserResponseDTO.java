package com.learnivo.demo.dto.user;

import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import java.time.LocalDateTime;

public class UserResponseDTO {
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

    public UserResponseDTO() {}

    public UserResponseDTO(Long id, String email, Role role, UserStatus status, LocalDateTime createdAt, LocalDateTime lastLogin, String firstName, String lastName, String phone, String address, String societyName, String societyEmail, String societyPhone, String societyAddress) {
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

    public static UserResponseDTOBuilder builder() {
        return new UserResponseDTOBuilder();
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

    public static class UserResponseDTOBuilder {
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

        public UserResponseDTOBuilder id(Long id) { this.id = id; return this; }
        public UserResponseDTOBuilder email(String email) { this.email = email; return this; }
        public UserResponseDTOBuilder role(Role role) { this.role = role; return this; }
        public UserResponseDTOBuilder status(UserStatus status) { this.status = status; return this; }
        public UserResponseDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserResponseDTOBuilder lastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; return this; }
        public UserResponseDTOBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserResponseDTOBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserResponseDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public UserResponseDTOBuilder address(String address) { this.address = address; return this; }
        public UserResponseDTOBuilder societyName(String societyName) { this.societyName = societyName; return this; }
        public UserResponseDTOBuilder societyEmail(String societyEmail) { this.societyEmail = societyEmail; return this; }
        public UserResponseDTOBuilder societyPhone(String societyPhone) { this.societyPhone = societyPhone; return this; }
        public UserResponseDTOBuilder societyAddress(String societyAddress) { this.societyAddress = societyAddress; return this; }

        public UserResponseDTO build() {
            return new UserResponseDTO(id, email, role, status, createdAt, lastLogin, firstName, lastName, phone, address, societyName, societyEmail, societyPhone, societyAddress);
        }
    }
}
