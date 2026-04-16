package com.learnivo.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "profiles")
public class Profile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    private String phone;
    
    private String address;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(name = "photo_url")
    private String photoUrl;

    public Profile() {}

    public Profile(Long id, User user, String firstName, String lastName, String phone, String address, LocalDate birthDate, String photoUrl) {
        this.id = id;
        this.user = user;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.address = address;
        this.birthDate = birthDate;
        this.photoUrl = photoUrl;
    }

    public static ProfileBuilder builder() {
        return new ProfileBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public static class ProfileBuilder {
        private Long id;
        private User user;
        private String firstName;
        private String lastName;
        private String phone;
        private String address;
        private LocalDate birthDate;
        private String photoUrl;

        public ProfileBuilder id(Long id) { this.id = id; return this; }
        public ProfileBuilder user(User user) { this.user = user; return this; }
        public ProfileBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public ProfileBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public ProfileBuilder phone(String phone) { this.phone = phone; return this; }
        public ProfileBuilder address(String address) { this.address = address; return this; }
        public ProfileBuilder birthDate(LocalDate birthDate) { this.birthDate = birthDate; return this; }
        public ProfileBuilder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }

        public Profile build() {
            return new Profile(id, user, firstName, lastName, phone, address, birthDate, photoUrl);
        }
    }
}
