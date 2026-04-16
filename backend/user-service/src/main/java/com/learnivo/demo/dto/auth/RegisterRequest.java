package com.learnivo.demo.dto.auth;

import com.learnivo.demo.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotNull(message = "Role is required")
    private Role role;
    
    // Champs optionnels pour SocietyAgent
    private String societyName;
    private String societyEmail;
    private String societyPhone;
    private String societyAddress;
    
    // Recaptcha
    private String recaptchaToken;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, Role role, String societyName, String societyEmail, String societyPhone, String societyAddress, String recaptchaToken) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.societyName = societyName;
        this.societyEmail = societyEmail;
        this.societyPhone = societyPhone;
        this.societyAddress = societyAddress;
        this.recaptchaToken = recaptchaToken;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getSocietyEmail() { return societyEmail; }
    public void setSocietyEmail(String societyEmail) { this.societyEmail = societyEmail; }

    public String getSocietyPhone() { return societyPhone; }
    public void setSocietyPhone(String societyPhone) { this.societyPhone = societyPhone; }

    public String getSocietyAddress() { return societyAddress; }
    public void setSocietyAddress(String societyAddress) { this.societyAddress = societyAddress; }

    public String getRecaptchaToken() { return recaptchaToken; }
    public void setRecaptchaToken(String recaptchaToken) { this.recaptchaToken = recaptchaToken; }
}
