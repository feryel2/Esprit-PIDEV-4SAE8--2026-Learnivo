package com.learnivo.demo.dto.user;

import com.learnivo.demo.enums.Role;
import com.learnivo.demo.enums.UserStatus;
import jakarta.validation.constraints.Email;

public class UserUpdateDTO {
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String password; // Si fourni, sera re-hashé
    
    private Role role;
    
    private UserStatus status;
    
    // Profile fields
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    
    // SocietyAgent fields
    private String societyName;
    private String societyEmail;
    private String societyPhone;
    private String societyAddress;

    public UserUpdateDTO() {}

    public UserUpdateDTO(String email, String password, Role role, UserStatus status, String firstName, String lastName, String phone, String address, String societyName, String societyEmail, String societyPhone, String societyAddress) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.societyName = societyName;
        this.societyEmail = societyEmail;
        this.societyPhone = societyPhone;
        this.societyAddress = societyAddress;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

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
}
