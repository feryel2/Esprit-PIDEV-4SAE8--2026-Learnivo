package com.esprit.courseservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Learnivo Course Service API",
                version = "v1",
                description = "Course catalog, chapter progression, difficulty analysis, and course asset upload endpoints.",
                contact = @Contact(name = "Learnivo Team"),
                license = @License(name = "Internal academic project")
        ),
        servers = @Server(url = "http://localhost:8081", description = "Local course-service")
)
public class OpenApiConfig {
}
