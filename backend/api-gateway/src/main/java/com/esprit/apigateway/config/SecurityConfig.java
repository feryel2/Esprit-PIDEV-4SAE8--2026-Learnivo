package com.esprit.apigateway.config;

import com.esprit.apigateway.security.JwtAuthenticationWebFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    @ConditionalOnProperty(name = "app.security.enabled", havingValue = "true", matchIfMissing = true)
    public SecurityWebFilterChain securedFilterChain(ServerHttpSecurity http, JwtAuthenticationWebFilter jwtAuthenticationWebFilter) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/actuator/**").permitAll()
                        .pathMatchers("/api/auth/login").permitAll()
                        .pathMatchers("/uploads/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/courses/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/courses/recommendations/ai").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/quizzes/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/quizzes/*/evaluate").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/quizzes/*/hint").permitAll()
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/api/auth/me").authenticated()
                        .pathMatchers("/api/users/**").hasRole("TEACHER")
                        .pathMatchers("/api/courses/**").hasRole("TEACHER")
                        .pathMatchers("/api/quizzes/**").hasRole("TEACHER")
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }

    @Bean
    @ConditionalOnProperty(name = "app.security.enabled", havingValue = "false")
    public SecurityWebFilterChain openFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchange -> exchange.anyExchange().permitAll())
                .build();
    }
}
