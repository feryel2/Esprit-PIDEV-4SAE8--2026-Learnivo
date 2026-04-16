package com.learnivo.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ticket_categories")
public class TicketCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String description;

    public TicketCategory() {}

    public TicketCategory(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static TicketCategoryBuilder builder() {
        return new TicketCategoryBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static class TicketCategoryBuilder {
        private Long id;
        private String name;
        private String description;

        public TicketCategoryBuilder id(Long id) { this.id = id; return this; }
        public TicketCategoryBuilder name(String name) { this.name = name; return this; }
        public TicketCategoryBuilder description(String description) { this.description = description; return this; }

        public TicketCategory build() {
            return new TicketCategory(id, name, description);
        }
    }
}
