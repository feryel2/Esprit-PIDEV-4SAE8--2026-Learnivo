package com.esprit.courseservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.esprit.courseservice.domain.CourseDifficulty;
import com.esprit.courseservice.domain.CourseStatus;
import com.esprit.courseservice.domain.CourseType;
import com.esprit.courseservice.entity.ChapterSection;
import com.esprit.courseservice.entity.Course;
import com.esprit.courseservice.entity.CourseChapter;
import java.util.List;
import org.junit.jupiter.api.Test;

class CourseDifficultyCalculatorTest {

    private final CourseDifficultyCalculator calculator = new CourseDifficultyCalculator();

    @Test
    void shouldClassifySimpleCourseAsBeginner() {
        Course course = baseCourse();
        course.setTitle("English Basics");
        course.setDescription("Simple starter course for daily communication.");
        course.setType(CourseType.LIVE_CLASSES);
        course.setChapters(1);
        course.setDuration("1 week");
        course.setChaptersData(List.of(chapter("Introduction", 1, 1)));

        CourseDifficultyCalculator.DifficultyAssessment assessment = calculator.assess(course);

        assertEquals(CourseDifficulty.BEGINNER, assessment.label());
        assertTrue(assessment.score() < 35);
        assertEquals(8.0, assessment.chapterLoad());
        assertEquals(6.0, assessment.sectionDensity());
    }

    @Test
    void shouldClassifyDenseCourseAsAdvanced() {
        Course course = baseCourse();
        course.setTitle("Advanced Business English Masterclass");
        course.setDescription("Professional presentation strategy bootcamp for advanced fluency and IELTS style communication in real business settings.");
        course.setType(CourseType.BLENDED_COURSE);
        course.setChapters(5);
        course.setDuration("2 months");
        course.setChaptersData(List.of(
                chapter("Business presentations", 1, 4),
                chapter("Negotiation strategy", 2, 4),
                chapter("Professional fluency drills", 3, 4),
                chapter("IELTS speaking workshop", 4, 4),
                chapter("Executive communication", 5, 4)
        ));

        CourseDifficultyCalculator.DifficultyAssessment assessment = calculator.assess(course);

        assertEquals(CourseDifficulty.ADVANCED, assessment.label());
        assertEquals(100.0, assessment.score());
        assertEquals(40.0, assessment.chapterLoad());
        assertEquals(20.0, assessment.durationLoad());
        assertEquals(6.0, assessment.deliveryComplexity());
    }

    private Course baseCourse() {
        Course course = new Course();
        course.setTitle("Course");
        course.setDescription("Description");
        course.setType(CourseType.LIVE_CLASSES);
        course.setStatus(CourseStatus.PUBLISHED);
        course.setLevel("Beginner");
        course.setImage("/images/course.jpg");
        course.setBanner("/images/banner.jpg");
        course.setSlug("course");
        course.setActionLabel("Enroll");
        course.setInstructor("Instructor");
        course.setCategory("English");
        course.setChapters(1);
        course.setDuration("1 week");
        return course;
    }

    private CourseChapter chapter(String name, int number, int sectionCount) {
        CourseChapter chapter = new CourseChapter();
        chapter.setName(name);
        chapter.setNumber(number);
        chapter.setPdfUrl("chapter-" + number + ".pdf");
        chapter.setSections(
                java.util.stream.IntStream.range(0, sectionCount)
                        .mapToObj(index -> {
                            ChapterSection section = new ChapterSection();
                            section.setName(name + " section " + (index + 1));
                            section.setCompleted(false);
                            section.setChapter(chapter);
                            return section;
                        })
                        .toList()
        );
        return chapter;
    }
}
