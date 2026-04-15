package com.esprit.courseservice.service;

import com.esprit.courseservice.dto.QuizSyncDtos.CourseRenameRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "quiz-service", path = "/api/quizzes")
public interface QuizServiceFeignClient {

    @PatchMapping("/sync/course-title")
    void renameCourse(@RequestBody CourseRenameRequest request);

    @DeleteMapping("/sync/by-course")
    void deleteByCourseTitle(@RequestParam("courseTitle") String courseTitle);
}
