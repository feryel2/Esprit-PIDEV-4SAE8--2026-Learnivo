package com.esprit.courseservice.config;

import com.esprit.courseservice.domain.CourseStatus;
import com.esprit.courseservice.domain.CourseType;
import com.esprit.courseservice.dto.CourseDtos.CourseChapterRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseSectionRequest;
import com.esprit.courseservice.repository.CourseRepository;
import com.esprit.courseservice.service.CourseService;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCourses(CourseRepository courseRepository, CourseService courseService) {
        return args -> {
            if (courseRepository.count() > 0) {
                return;
            }

            courseService.create(new CourseRequest(
                    "Speak Fluent English in 30 Days - No Boring Grammar Rules!",
                    "Struggling to speak confidently? This course focuses on real-world conversations, confidence building, and pronunciation habits that make learners speak more naturally.",
                    CourseType.BLENDED_COURSE,
                    CourseStatus.PUBLISHED,
                    "Beginner",
                    "/images/training-1.jpg",
                    "/images/course-banner.jpg",
                    "Dr. Sarah Wilson",
                    "Speaking",
                    3,
                    "4 weeks",
                    List.of(
                            new CourseChapterRequest("Introduction to Fluency", 1, "chapter-1.pdf",
                                    List.of(
                                            new CourseSectionRequest("Overcoming Fear of Speaking", false),
                                            new CourseSectionRequest("Building Consistency", true)
                                    )),
                            new CourseChapterRequest("Real-world Conversations", 2, "chapter-2.pdf", List.of()),
                            new CourseChapterRequest("Pronunciation Hacks", 3, "chapter-3.pdf", List.of())
                    )
            ));

            courseService.create(new CourseRequest(
                    "The Ultimate English Writing Masterclass: From Beginner to Pro!",
                    "This course teaches learners how to structure essays, sharpen vocabulary, and write with clarity across email, academic, and creative formats.",
                    CourseType.LIVE_CLASSES,
                    CourseStatus.PUBLISHED,
                    "Mid-level",
                    "/images/training-2.jpg",
                    "/images/course-banner.jpg",
                    "Mark Thompson",
                    "Writing",
                    2,
                    "6 weeks",
                    List.of(
                            new CourseChapterRequest("Writing Foundations", 1, "writing-1.pdf", List.of()),
                            new CourseChapterRequest("Powerful Editing", 2, "writing-2.pdf", List.of())
                    )
            ));

            courseService.create(new CourseRequest(
                    "Accent Makeover: Sound Like a Native in Just Weeks!",
                    "Learners practice rhythm, intonation, and pronunciation drills that improve speech clarity and reduce hesitation in spoken English.",
                    CourseType.LIVE_CLASSES,
                    CourseStatus.DRAFT,
                    "Advanced",
                    "/images/training-3.jpg",
                    "/images/course-banner.jpg",
                    "Emma Watson",
                    "Pronunciation",
                    2,
                    "3 weeks",
                    List.of(
                            new CourseChapterRequest("Rhythm Training", 1, "accent-1.pdf", List.of()),
                            new CourseChapterRequest("Intonation Practice", 2, "accent-2.pdf", List.of())
                    )
            ));
        };
    }
}
