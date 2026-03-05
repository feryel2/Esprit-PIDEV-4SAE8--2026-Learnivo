package com.learnivo.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Programmatic API Gateway route configuration.
 * Routes are also defined declaratively in application.yml.
 * This class demonstrates fluent Java DSL routing.
 */
@Configuration
public class GatewayConfig {

    /**
     * Defines all routes to the learnivo certification microservice
     * discovered via Eureka (lb:// = load-balanced, service-registry lookup).
     */
    @Bean
    public RouteLocator learnivoRoutes(RouteLocatorBuilder builder) {
        return builder.routes()

            // Certificates CRUD
            .route("cert-route", r -> r
                .path("/gateway/certificates/**")
                .filters(f -> f.rewritePath("/gateway/(?<segment>.*)", "/api/${segment}"))
                .uri("lb://learnivo"))

            // Internships CRUD
            .route("internship-route", r -> r
                .path("/gateway/internships/**")
                .filters(f -> f.rewritePath("/gateway/(?<segment>.*)", "/api/${segment}"))
                .uri("lb://learnivo"))

            // Applications CRUD
            .route("application-route", r -> r
                .path("/gateway/applications/**")
                .filters(f -> f.rewritePath("/gateway/(?<segment>.*)", "/api/${segment}"))
                .uri("lb://learnivo"))

            // Events CRUD
            .route("events-route", r -> r
                .path("/gateway/events/**")
                .filters(f -> f.rewritePath("/gateway/(?<segment>.*)", "/api/${segment}"))
                .uri("lb://learnivo"))

            // Certification Rules
            .route("rules-route", r -> r
                .path("/gateway/certification-rules/**")
                .filters(f -> f.rewritePath("/gateway/(?<segment>.*)", "/api/${segment}"))
                .uri("lb://learnivo"))

            .build();
    }
}
