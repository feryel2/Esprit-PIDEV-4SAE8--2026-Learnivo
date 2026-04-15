package com.esprit.courseservice.controller;

import com.esprit.courseservice.domain.CourseStatus;
import com.esprit.courseservice.domain.CourseType;
import com.esprit.courseservice.domain.CourseQuizProgressStatus;
import com.esprit.courseservice.dto.CourseAssetUploadResponse;
import com.esprit.courseservice.dto.CourseDtos.CourseAnalyticsResponse;
import com.esprit.courseservice.dto.CourseDtos.CourseDifficultyResponse;
import com.esprit.courseservice.dto.CourseDtos.CourseProgressResponse;
import com.esprit.courseservice.dto.CourseDtos.CourseRecommendationRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseRecommendationResponse;
import com.esprit.courseservice.dto.CourseDtos.CourseRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseResponse;
import com.esprit.courseservice.service.CourseAssetStorageService;
import com.esprit.courseservice.service.CourseAiRecommendationService;
import com.esprit.courseservice.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Manage courses, progress tracking, analytics, and learning assets.")
public class CourseController {

    private final CourseService courseService;
    private final CourseAssetStorageService courseAssetStorageService;
    private final CourseAiRecommendationService courseAiRecommendationService;

    public CourseController(
            CourseService courseService,
            CourseAssetStorageService courseAssetStorageService,
            CourseAiRecommendationService courseAiRecommendationService
    ) {
        this.courseService = courseService;
        this.courseAssetStorageService = courseAssetStorageService;
        this.courseAiRecommendationService = courseAiRecommendationService;
    }

    @GetMapping
    @Operation(summary = "List courses", description = "Returns all courses with optional filters for search, status, level, category, and type.")
    public List<CourseResponse> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) CourseType type
    ) {
        return courseService.findAll(search, status, level, category, type);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a course by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Course found"),
            @ApiResponse(responseCode = "404", description = "Course not found", content = @Content)
    })
    public CourseResponse findById(@PathVariable Long id) {
        return courseService.findById(id);
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get a course by slug")
    public CourseResponse findBySlug(@PathVariable String slug) {
        return courseService.findBySlug(slug);
    }

    @GetMapping("/{id}/progress")
    @Operation(summary = "Get course progress", description = "Returns chapter completion progress and quiz unlock state for a course.")
    public CourseProgressResponse progress(
            @PathVariable Long id,
            @Parameter(description = "Quiz state for the learner in this course")
            @RequestParam(defaultValue = "NOT_STARTED") CourseQuizProgressStatus quizStatus
    ) {
        return courseService.progress(id, quizStatus);
    }

    @GetMapping("/{id}/difficulty")
    @Operation(summary = "Get course difficulty analysis")
    public CourseDifficultyResponse difficulty(@PathVariable Long id) {
        return courseService.difficulty(id);
    }

    @PostMapping("/recommendations/ai")
    @Operation(summary = "Get AI-assisted course recommendations", description = "Ranks the best courses for a learner profile using AI when configured, with a local fallback strategy otherwise.")
    public CourseRecommendationResponse recommend(@Valid @RequestBody CourseRecommendationRequest request) {
        return courseAiRecommendationService.recommend(request);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a course")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Course created"),
            @ApiResponse(responseCode = "400", description = "Invalid course payload", content = @Content)
    })
    public CourseResponse create(@Valid @RequestBody CourseRequest request) {
        return courseService.create(request);
    }

    @PostMapping(path = "/assets/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload a course cover image")
    @ApiResponse(responseCode = "201", description = "Cover uploaded", content = @Content(schema = @Schema(implementation = CourseAssetUploadResponse.class)))
    public CourseAssetUploadResponse uploadCover(@RequestParam("file") MultipartFile file) {
        return new CourseAssetUploadResponse(courseAssetStorageService.storeCoverImage(file));
    }

    @PostMapping(path = "/assets/chapter-pdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Upload a chapter PDF")
    @ApiResponse(responseCode = "201", description = "PDF uploaded", content = @Content(schema = @Schema(implementation = CourseAssetUploadResponse.class)))
    public CourseAssetUploadResponse uploadChapterPdf(@RequestParam("file") MultipartFile file) {
        return new CourseAssetUploadResponse(courseAssetStorageService.storeChapterPdf(file));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a course")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return courseService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update or toggle course status", description = "Pass a status to set it explicitly, or omit it to toggle between draft and published.")
    public CourseResponse updateStatus(@PathVariable Long id, @RequestParam(required = false) CourseStatus status) {
        return status == null ? courseService.toggleStatus(id) : courseService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a course")
    public void delete(@PathVariable Long id) {
        courseService.delete(id);
    }

    @GetMapping("/analytics/overview")
    @Operation(summary = "Get course analytics overview")
    public CourseAnalyticsResponse analytics() {
        return courseService.analytics();
    }
}
