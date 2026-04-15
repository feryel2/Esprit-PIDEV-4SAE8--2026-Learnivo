import { LearningProgressService } from './learning-progress.service';
import { Training } from './data.service';
import { AuthUser } from './auth.service';

describe('LearningProgressService', () => {
  let service: LearningProgressService;
  let currentUser: AuthUser | null;

  const training: Training = {
    id: 1,
    title: 'Grammar Bootcamp',
    description: 'Course description',
    type: 'Blended course',
    status: 'Published',
    level: 'Intermediate',
    image: '/images/course.jpg',
    slug: 'grammar-bootcamp',
    action: 'Enroll now',
    chapters: 3,
    duration: '4 weeks',
    chaptersData: [
      { name: 'Chapter 1', number: 1, pdfUrl: '1.pdf', sections: [] },
      { name: 'Chapter 2', number: 2, pdfUrl: '2.pdf', sections: [] },
      { name: 'Chapter 3', number: 3, pdfUrl: '3.pdf', sections: [] }
    ]
  };

  beforeEach(() => {
    localStorage.clear();
    currentUser = {
      id: 1,
      fullName: 'Student One',
      email: 'student1@example.com',
      role: 'STUDENT',
      redirectPath: '/student',
      token: 'student-token'
    };
    service = new LearningProgressService({
      currentUser: () => currentUser
    } as any);
  });

  it('should unlock the first chapter only by default', () => {
    expect(service.isChapterUnlocked(training, 1)).toBe(true);
    expect(service.isChapterUnlocked(training, 2)).toBe(false);
    expect(service.isQuizUnlocked(training)).toBe(false);
  });

  it('should unlock the quiz after all chapters are completed', () => {
    service.markChapterCompleted(training.slug, 1);
    service.markChapterCompleted(training.slug, 2);
    service.markChapterCompleted(training.slug, 3);

    expect(service.isQuizUnlocked(training)).toBe(true);
    expect(service.getProgressPercent(training, true)).toBe(50);
  });

  it('should reveal answers after two failed quiz attempts', () => {
    service.recordQuizAttempt(training.slug, false);
    const secondAttempt = service.recordQuizAttempt(training.slug, false);

    expect(secondAttempt.quizAttempts).toBe(2);
    expect(secondAttempt.revealAnswers).toBe(true);
    expect(service.shouldRevealQuizAnswers(training.slug)).toBe(true);
  });

  it('should mark progress as complete after a passed quiz', () => {
    service.markChapterCompleted(training.slug, 1);
    service.markChapterCompleted(training.slug, 2);
    service.markChapterCompleted(training.slug, 3);
    service.recordQuizAttempt(training.slug, true);

    expect(service.hasPassedQuiz(training.slug)).toBe(true);
    expect(service.getProgressPercent(training, true)).toBe(100);
  });

  it('should keep progress separate for each student', () => {
    service.markChapterCompleted(training.slug, 1);
    service.recordQuizAttempt(training.slug, false, 40, 40);

    currentUser = {
      id: 2,
      fullName: 'Student Two',
      email: 'student2@example.com',
      role: 'STUDENT',
      redirectPath: '/student',
      token: 'student-two-token'
    };

    expect(service.isChapterCompleted(training.slug, 1)).toBe(false);
    expect(service.getQuizAttempts(training.slug)).toBe(0);
    expect(service.getLastQuizResult(training.slug).taken).toBe(false);
  });
});
