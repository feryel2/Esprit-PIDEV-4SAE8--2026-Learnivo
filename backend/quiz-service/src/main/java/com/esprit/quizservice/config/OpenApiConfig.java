package com.esprit.quizservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Learnivo Quiz Service API",
                version = "v1",
                description = "Quiz management, publication workflow, evaluation, and course synchronization endpoints.",
                contact = @Contact(name = "Learnivo Team"),
                license = @License(name = "Internal academic project")
        ),
        servers = @Server(url = "http://localhost:8082", description = "Local quiz-service")
)
public class OpenApiConfig {
}
