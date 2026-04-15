package com.esprit.courseservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.esprit.courseservice.domain.CourseStatus;
import com.esprit.courseservice.domain.CourseType;
import com.esprit.courseservice.dto.CourseDtos.CourseChapterRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseRequest;
import com.esprit.courseservice.dto.CourseDtos.CourseSectionRequest;
import com.esprit.courseservice.entity.Course;
import com.esprit.courseservice.exception.BadRequestException;
import com.esprit.courseservice.repository.CourseRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private QuizServiceClient quizServiceClient;

    private CourseService courseService;

    @BeforeEach
    void setUp() {
        courseService = new CourseService(
                courseRepository,
                new CourseMapper(),
                quizServiceClient,
                new CourseDifficultyCalculator()
        );
    }

    @Test
    void shouldRejectCourseWithDuplicateChapterNumbers() {
        CourseRequest request = new CourseRequest(
                "Business English Sprint",
                "This request intentionally contains duplicate chapter numbers for validation testing.",
                CourseType.BLENDED_COURSE,
                CourseStatus.PUBLISHED,
                "Intermediate",
                "/images/course.jpg",
                "/images/banner.jpg",
                "Teacher Demo",
                "Business",
                2,
                "2 weeks",
                List.of(
                        chapterRequest("Chapter One", 1, "chapter-1.pdf"),
                        chapterRequest("Chapter Two", 1, "chapter-2.pdf")
                )
        );

        BadRequestException exception = assertThrows(BadRequestException.class, () -> courseService.create(request));

        assertEquals("Chapter numbers must be unique.", exception.getMessage());
    }

    @Test
    void shouldGenerateUniqueSlugWhenTitleAlreadyExists() {
        CourseRequest request = new CourseRequest(
                "Advanced Security Course",
                "A complete backend security course used to verify unique slug generation inside the service layer.",
                CourseType.BLENDED_COURSE,
                CourseStatus.PUBLISHED,
                "Advanced",
                "/images/course.jpg",
                "/images/banner.jpg",
                "Teacher Demo",
                "Security",
                1,
                "3 weeks",
                List.of(chapterRequest("Security Basics", 1, "security.pdf"))
        );

        Course existing = new Course();
        existing.setId(10L);
        existing.setSlug("advanced-security-course");

        when(courseRepository.findBySlug("advanced-security-course")).thenReturn(Optional.of(existing));
        when(courseRepository.findBySlug("advanced-security-course-2")).thenReturn(Optional.empty());
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> {
            Course course = invocation.getArgument(0);
            course.setId(11L);
            return course;
        });

        var response = courseService.create(request);

        assertEquals("advanced-security-course-2", response.slug());
    }

    @Test
    void shouldRenameLinkedQuizWhenCourseTitleChanges() {
        Course existing = existingCourse(5L, "Old Title");
        CourseRequest request = new CourseRequest(
                "New Title",
                "A refreshed course title used to verify quiz synchronization after a course update operation.",
                CourseType.BLENDED_COURSE,
                CourseStatus.PUBLISHED,
                "Intermediate",
                "/images/course.jpg",
                "/images/banner.jpg",
                "Teacher Demo",
                "Business",
                1,
                "2 weeks",
                List.of(chapterRequest("Updated Chapter", 1, "updated.pdf"))
        );

        when(courseRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(courseRepository.findBySlug("new-title")).thenReturn(Optional.empty());
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        courseService.update(5L, request);

        verify(quizServiceClient).renameCourse("Old Title", "New Title");
    }

    @Test
    void shouldNotRenameLinkedQuizWhenCourseTitleDoesNotChange() {
        Course existing = existingCourse(5L, "Stable Title");
        CourseRequest request = new CourseRequest(
                "Stable Title",
                "A stable course title used to verify that quiz synchronization is skipped when the name is unchanged.",
                CourseType.BLENDED_COURSE,
                CourseStatus.PUBLISHED,
                "Intermediate",
                "/images/course.jpg",
                "/images/banner.jpg",
                "Teacher Demo",
                "Business",
                1,
                "2 weeks",
                List.of(chapterRequest("Updated Chapter", 1, "updated.pdf"))
        );

        when(courseRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(courseRepository.findBySlug("stable-title")).thenReturn(Optional.of(existing));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));

        courseService.update(5L, request);

        verify(quizServiceClient, never()).renameCourse(any(), any());
    }

    @Test
    void shouldDeleteLinkedQuizzesWhenCourseIsDeleted() {
        Course existing = existingCourse(8L, "Delete Me");
        when(courseRepository.findById(8L)).thenReturn(Optional.of(existing));

        courseService.delete(8L);

        verify(courseRepository).delete(existing);
        verify(quizServiceClient).deleteByCourseTitle("Delete Me");
    }

    private Course existingCourse(Long id, String title) {
        Course course = new Course();
        course.setId(id);
        course.setTitle(title);
        course.setDescription("Existing course description with enough content to pass validation.");
        course.setType(CourseType.BLENDED_COURSE);
        course.setStatus(CourseStatus.PUBLISHED);
        course.setLevel("Intermediate");
        course.setImage("/images/course.jpg");
        course.setBanner("/images/banner.jpg");
        course.setSlug(title.toLowerCase().replace(' ', '-'));
        course.setActionLabel("Enroll now");
        course.setInstructor("Teacher Demo");
        course.setCategory("Business");
        course.setChapters(1);
        course.setDuration("2 weeks");
        return course;
    }

    private CourseChapterRequest chapterRequest(String name, int number, String pdfUrl) {
        return new CourseChapterRequest(
                name,
                number,
                pdfUrl,
                List.of(new CourseSectionRequest("Section 1", false))
        );
    }
}
