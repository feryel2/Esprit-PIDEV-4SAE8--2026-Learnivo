import { BehaviorSubject } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ChapterDetailComponent } from './chapter-detail.component';
import {
  DataService,
  Quiz,
  QuizAttemptResult,
  QuizHintResult,
  Training,
  TrainingChapter
} from '../services/data.service';
import { LearningProgressService } from '../services/learning-progress.service';

describe('ChapterDetailComponent', () => {
  let fixture: ComponentFixture<ChapterDetailComponent>;
  let component: ChapterDetailComponent;
  let router: Router;
  let routeParams$: BehaviorSubject<{ slug: string; chapterId: string }>;

  const training: Training = {
    id: 1,
    title: 'Grammar Bootcamp',
    description: 'Course description',
    type: 'Blended course',
    status: 'Published',
    level: 'Intermediate',
    image: '/images/course.jpg',
    banner: '/images/banner.jpg',
    slug: 'grammar-bootcamp',
    action: 'Enroll now',
    chapters: 2,
    duration: '4 weeks',
    chaptersData: [
      { name: 'Chapter 1', number: 1, pdfUrl: 'https://example.com/chapter-1.pdf', sections: [] },
      { name: 'Chapter 2', number: 2, pdfUrl: 'https://example.com/chapter-2.pdf', sections: [] }
    ]
  };

  const questions = [
    {
      id: 'q1',
      text: 'Choose the right answer',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      explanation: 'Because B is correct.',
      difficulty: 'Intermediate' as const,
      weight: 3
    }
  ];

  const quiz: Quiz = {
    id: 7,
    title: 'Grammar Final Quiz',
    course: training.title,
    category: 'Grammar',
    difficulty: 'Intermediate',
    questions: 1,
    duration: '10 min',
    passScore: 70,
    status: 'Published',
    items: questions
  };

  const dataServiceMock = {
    getPublishedTrainingBySlug: jasmine.createSpy('getPublishedTrainingBySlug'),
    getQuizByCourseTitle: jasmine.createSpy('getQuizByCourseTitle'),
    getQuizQuestions: jasmine.createSpy('getQuizQuestions'),
    getQuizHint: jasmine.createSpy('getQuizHint'),
    evaluateQuiz: jasmine.createSpy('evaluateQuiz')
  };

  const progressServiceMock = {
    syncQuizState: jasmine.createSpy('syncQuizState'),
    getProgressPercent: jasmine.createSpy('getProgressPercent').and.returnValue(25),
    isQuizUnlocked: jasmine.createSpy('isQuizUnlocked').and.returnValue(true),
    getNextUnlockedIncompleteChapter: jasmine
      .createSpy('getNextUnlockedIncompleteChapter')
      .and.returnValue(null as TrainingChapter | null),
    getLastQuizResult: jasmine
      .createSpy('getLastQuizResult')
      .and.returnValue({ taken: false, score: null, baseScore: null, status: null }),
    hasPassedQuiz: jasmine.createSpy('hasPassedQuiz').and.returnValue(false),
    getQuizAttempts: jasmine.createSpy('getQuizAttempts').and.returnValue(0),
    shouldRevealQuizAnswers: jasmine.createSpy('shouldRevealQuizAnswers').and.returnValue(false),
    isChapterUnlocked: jasmine
      .createSpy('isChapterUnlocked')
      .and.callFake((currentTraining: Training, chapterNumber: number) => chapterNumber === 1),
    isChapterCompleted: jasmine.createSpy('isChapterCompleted').and.returnValue(false),
    markChapterCompleted: jasmine.createSpy('markChapterCompleted'),
    recordQuizAttempt: jasmine.createSpy('recordQuizAttempt').and.returnValue({
      quizAttempts: 1,
      quizPassed: false,
      revealAnswers: false,
      quizTaken: true,
      lastQuizScore: 0,
      lastQuizBaseScore: 0,
      lastQuizStatus: 'failed'
    })
  };

  beforeEach(async () => {
    dataServiceMock.getPublishedTrainingBySlug.calls.reset();
    dataServiceMock.getQuizByCourseTitle.calls.reset();
    dataServiceMock.getQuizQuestions.calls.reset();
    dataServiceMock.getQuizHint.calls.reset();
    dataServiceMock.evaluateQuiz.calls.reset();
    progressServiceMock.syncQuizState.calls.reset();
    progressServiceMock.getProgressPercent.calls.reset();
    progressServiceMock.isQuizUnlocked.calls.reset();
    progressServiceMock.getNextUnlockedIncompleteChapter.calls.reset();
    progressServiceMock.getLastQuizResult.calls.reset();
    progressServiceMock.hasPassedQuiz.calls.reset();
    progressServiceMock.getQuizAttempts.calls.reset();
    progressServiceMock.shouldRevealQuizAnswers.calls.reset();
    progressServiceMock.isChapterUnlocked.calls.reset();
    progressServiceMock.isChapterCompleted.calls.reset();
    progressServiceMock.markChapterCompleted.calls.reset();
    progressServiceMock.recordQuizAttempt.calls.reset();

    routeParams$ = new BehaviorSubject({ slug: training.slug, chapterId: '1' });

    dataServiceMock.getPublishedTrainingBySlug.and.resolveTo(training);
    dataServiceMock.getQuizByCourseTitle.and.resolveTo(quiz);
    dataServiceMock.getQuizQuestions.and.returnValue(questions);
    dataServiceMock.getQuizHint.and.resolveTo({
      quizId: quiz.id,
      questionId: 'q1',
      hint: 'Think about the rule before choosing.',
      hintLevel: 1,
      remainingHints: 2,
      source: 'AI'
    });
    dataServiceMock.evaluateQuiz.and.resolveTo({
      correctAnswers: 1,
      totalQuestions: 1,
      baseScore: 100,
      earnedWeight: 2,
      totalWeight: 2,
      bonusPoints: 0,
      penaltyPoints: 0,
      score: 100,
      passed: true,
      review: []
    });

    await TestBed.configureTestingModule({
      imports: [ChapterDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: routeParams$.asObservable() } },
        { provide: DataService, useValue: dataServiceMock },
        { provide: LearningProgressService, useValue: progressServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    localStorage.clear();
  });

  function prepareQuizState() {
    component.training.set(training);
    component.currentChapter.set(null);
    component.isQuizStep.set(true);
    component.quiz.set(quiz);
    component.questions.set(questions);
    component.selectedAnswers.set(Array(questions.length).fill(-1));
    component.quizSubmitted.set(false);
    component.quizPassed.set(false);
    component.quizAttempts.set(0);
    component.questionHints.set({});
    component.hintLoadingQuestionId.set(null);
    component.hintError.set('');
    component.antiCheatTriggered.set(false);
    component.antiCheatMessage.set('');
  }

  it('loads the requested chapter and linked quiz data', () => {
    expect(dataServiceMock.getPublishedTrainingBySlug).toHaveBeenCalledWith(training.slug);
    expect(dataServiceMock.getQuizByCourseTitle).toHaveBeenCalledWith(training.title);
    expect(progressServiceMock.syncQuizState).toHaveBeenCalledWith(training.slug, quiz.id);
    expect(component.training()?.slug).toBe(training.slug);
    expect(component.currentChapter()?.number).toBe(1);
    expect(component.isQuizStep()).toBe(false);
  });

  it('marks the current chapter as completed and navigates to the next unlocked chapter', async () => {
    progressServiceMock.getNextUnlockedIncompleteChapter.and.callFake(() => training.chaptersData?.[1] ?? null);

    await component.markCurrentChapterCompleted();

    expect(progressServiceMock.markChapterCompleted).toHaveBeenCalledWith(training.slug, 1);
    expect(router.navigate).toHaveBeenCalledWith(['/courses', training.slug, 2]);
  });

  it('submits quiz answers and stores the result', async () => {
    prepareQuizState();
    component.selectAnswer(0, 1);

    await component.submitQuiz();

    expect(dataServiceMock.evaluateQuiz).toHaveBeenCalledWith(quiz.id, { q1: 1 });
    expect(component.quizSubmitted()).toBe(true);
    expect(component.quizScore()).toBe(100);
  });

  it('requests and stores a hint for the active quiz question', async () => {
    prepareQuizState();
    component.selectAnswer(0, 2);
    await component.requestHint(0);

    expect(dataServiceMock.getQuizHint).toHaveBeenCalledWith(quiz.id, 'q1', 1, 2);
    expect(component.currentHint('q1')?.hint).toBe('Think about the rule before choosing.');
    expect(component.hintError()).toBe('');
    expect(component.isHintLoading('q1')).toBe(false);
  });

  it('does not allow hints for questions below weight 3', async () => {
    prepareQuizState();
    component.questions.set([{ ...questions[0], weight: 2 }]);

    await component.requestHint(0);

    expect(component.isHintEligible('q1')).toBe(false);
    expect(component.canRequestHint('q1')).toBe(false);
    expect(component.hintButtonLabel('q1')).toBe('Hints for weight 3 only');
    expect(dataServiceMock.getQuizHint).not.toHaveBeenCalled();
  });

  it('fails the attempt automatically when the window loses focus during the quiz', async () => {
    prepareQuizState();
    (component as any).startQuizMonitoring();

    window.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(progressServiceMock.recordQuizAttempt).toHaveBeenCalledWith(training.slug, false, 0, 0);
    expect(component.quizSubmitted()).toBe(true);
    expect(component.antiCheatTriggered()).toBe(true);
    expect(component.antiCheatMessage()).toContain('Leaving the quiz window is not allowed');
  });
});
