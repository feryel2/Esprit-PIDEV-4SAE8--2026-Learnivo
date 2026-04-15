package com.esprit.quizservice.controller;

import com.esprit.quizservice.domain.QuizStatus;
import com.esprit.quizservice.dto.QuizSyncDtos.CourseRenameRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizAnalyticsResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizAttemptRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizAttemptResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizHintRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizHintResponse;
import com.esprit.quizservice.dto.QuizDtos.QuizRequest;
import com.esprit.quizservice.dto.QuizDtos.QuizResponse;
import com.esprit.quizservice.service.QuizHintService;
import com.esprit.quizservice.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quizzes")
@Tag(name = "Quizzes", description = "Manage quizzes, learner evaluation, publishing, and course synchronization.")
public class QuizController {

    private final QuizService quizService;
    private final QuizHintService quizHintService;

    public QuizController(QuizService quizService, QuizHintService quizHintService) {
        this.quizService = quizService;
        this.quizHintService = quizHintService;
    }

    @GetMapping
    @Operation(summary = "List quizzes", description = "Returns quizzes with optional filtering by search, status, difficulty, category, and course.")
    public List<QuizResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) QuizStatus status,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String course
    ) {
        return quizService.findAll(search, status, difficulty, category, course);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a quiz by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quiz found"),
            @ApiResponse(responseCode = "404", description = "Quiz not found", content = @Content)
    })
    public QuizResponse findById(@PathVariable Long id) {
        return quizService.findById(id);
    }

    @GetMapping("/by-course")
    @Operation(summary = "Get the active published quiz for a course")
    public QuizResponse findPublishedByCourse(@RequestParam String courseTitle) {
        return quizService.findPublishedByCourse(courseTitle);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a quiz")
    public QuizResponse create(@Valid @RequestBody QuizRequest request) {
        return quizService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a quiz")
    public QuizResponse update(@PathVariable Long id, @Valid @RequestBody QuizRequest request) {
        return quizService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update or toggle quiz status")
    public QuizResponse updateStatus(@PathVariable Long id, @RequestParam(required = false) QuizStatus status) {
        return status == null ? quizService.toggleStatus(id) : quizService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a quiz")
    public void delete(@PathVariable Long id) {
        quizService.delete(id);
    }

    @PatchMapping("/sync/course-title")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Rename linked course title in quizzes")
    public void renameCourseTitle(@Valid @RequestBody CourseRenameRequest request) {
        quizService.renameCourseTitle(request.previousTitle(), request.nextTitle());
    }

    @DeleteMapping("/sync/by-course")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete quizzes linked to a course title")
    public void deleteByCourseTitle(@RequestParam String courseTitle) {
        quizService.deleteByCourseTitle(courseTitle);
    }

    @PostMapping("/{id}/evaluate")
    @Operation(summary = "Evaluate a learner quiz attempt")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quiz attempt evaluated"),
            @ApiResponse(responseCode = "400", description = "Invalid attempt payload", content = @Content)
    })
    public QuizAttemptResponse evaluate(@PathVariable Long id, @Valid @RequestBody QuizAttemptRequest request) {
        return quizService.evaluate(id, request);
    }

    @PostMapping("/{id}/hint")
    @Operation(summary = "Generate an AI-assisted hint for a quiz question")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hint generated"),
            @ApiResponse(responseCode = "400", description = "Invalid hint payload", content = @Content),
            @ApiResponse(responseCode = "404", description = "Quiz or question not found", content = @Content)
    })
    public QuizHintResponse generateHint(@PathVariable Long id, @Valid @RequestBody QuizHintRequest request) {
        return quizHintService.generateHint(id, request);
    }

    @GetMapping("/analytics/overview")
    @Operation(summary = "Get quiz analytics overview")
    public QuizAnalyticsResponse analytics() {
        return quizService.analytics();
    }
}
