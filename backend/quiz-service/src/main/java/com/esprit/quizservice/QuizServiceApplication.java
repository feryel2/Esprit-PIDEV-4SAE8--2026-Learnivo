package com.esprit.quizservice;

import com.esprit.quizservice.config.QuizAiProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(QuizAiProperties.class)
public class QuizServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizServiceApplication.class, args);
    }
}
