package com.esprit.quizservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.esprit.quizservice.config.QuizMailProperties;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

class QuizResultEmailServiceTest {

    @Test
    void shouldReturnSimulatedResultWhenMailIsDisabled() {
        QuizMailProperties properties = new QuizMailProperties();
        properties.setEnabled(false);

        QuizResultEmailService service = new QuizResultEmailService(provider(null), properties);
        QuizResultEmailService.DeliveryResult result = service.sendResultEmail(
                "student@test.com",
                "Quiz passed",
                "Preview",
                "Next step",
                List.of("Highlight")
        );

        assertFalse(result.delivered());
        assertEquals("SIMULATED", result.deliveryMode());
    }

    @Test
    void shouldSendEmailWhenMailIsEnabled() {
        QuizMailProperties properties = new QuizMailProperties();
        properties.setEnabled(true);
        properties.setFrom("sender@test.com");
        JavaMailSender sender = mock(JavaMailSender.class);

        QuizResultEmailService service = new QuizResultEmailService(provider(sender), properties);
        QuizResultEmailService.DeliveryResult result = service.sendResultEmail(
                "student@test.com",
                "Quiz passed",
                "Preview",
                "Next step",
                List.of("Highlight one", "Highlight two")
        );

        assertTrue(result.delivered());
        assertEquals("SMTP", result.deliveryMode());
        verify(sender).send(any(SimpleMailMessage.class));
    }

    private ObjectProvider<JavaMailSender> provider(JavaMailSender sender) {
        return new ObjectProvider<>() {
            @Override
            public JavaMailSender getObject(Object... args) {
                return sender;
            }

            @Override
            public JavaMailSender getIfAvailable() {
                return sender;
            }

            @Override
            public JavaMailSender getIfUnique() {
                return sender;
            }

            @Override
            public JavaMailSender getObject() {
                return sender;
            }
        };
    }
}
