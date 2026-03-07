package com.esprit.quizservice;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class QuizServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldListSeededQuizzes() throws Exception {
        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void shouldEvaluateQuizAttempt() throws Exception {
        mockMvc.perform(post("/api/quizzes/1/evaluate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "answers": {
                                    "fluency-1": 0,
                                    "fluency-2": 0,
                                    "fluency-3": 2
                                  }
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.passed").value(true))
                .andExpect(jsonPath("$.score").value(100.0));
    }

    @Test
    void shouldRenameCourseTitleAcrossMatchingQuizzes() throws Exception {
        mockMvc.perform(patch("/api/quizzes/sync/course-title")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "previousTitle": "Speak Fluent English in 30 Days - No Boring Grammar Rules!",
                                  "nextTitle": "Speak Fluent English Updated"
                                }
                                """))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/quizzes/by-course").param("courseTitle", "Speak Fluent English Updated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.course").value("Speak Fluent English Updated"));
    }
}
