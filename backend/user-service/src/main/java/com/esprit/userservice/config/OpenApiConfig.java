package com.esprit.userservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Learnivo User Service API",
                version = "v1",
                description = "Authentication and user listing endpoints for teacher and student access.",
                contact = @Contact(name = "Learnivo Team"),
                license = @License(name = "Internal academic project")
        ),
        servers = @Server(url = "http://localhost:8083", description = "Local user-service")
)
public class OpenApiConfig {
}
