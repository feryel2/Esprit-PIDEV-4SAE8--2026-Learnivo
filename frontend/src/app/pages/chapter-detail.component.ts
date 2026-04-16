import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, FileText, Trophy, Lock, CheckCircle2, X, Lightbulb, Sparkles } from 'lucide-angular';
import { DataService, Quiz, QuizHintResult, QuizQuestion, Training, TrainingChapter } from '../services/data.service';
import { LearningProgressService } from '../services/learning-progress.service';

@Component({
  selector: 'app-chapter-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './chapter-detail.component.html',
})
export class ChapterDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private data = inject(DataService);
  private sanitizer = inject(DomSanitizer);
  private progress = inject(LearningProgressService);

  training = signal<Training | null>(null);
  currentChapter = signal<TrainingChapter | null>(null);
  isQuizStep = signal(false);
  quiz = signal<Quiz | null>(null);
  questions = signal<QuizQuestion[]>([]);
  selectedAnswers = signal<number[]>([]);
  questionHints = signal<Record<string, QuizHintResult>>({});
  hintLoadingQuestionId = signal<string | null>(null);
  hintError = signal('');
  quizScore = signal<number | null>(null);
  quizBaseScore = signal<number | null>(null);
  quizPassed = signal(false);
  quizSubmitted = signal(false);
  quizAttempts = signal(0);
  revealAnswers = signal(false);
  loadError = signal('');
  antiCheatTriggered = signal(false);
  antiCheatMessage = signal('');
  restoredStoredResult = signal(false);
  resultOverlayVisible = signal(false);

  private readonly boundVisibilityHandler = () => this.handleQuizVisibilityViolation('Tab switching is not allowed during this quiz.');
  private readonly boundWindowBlurHandler = () => this.handleQuizVisibilityViolation('Leaving the quiz window is not allowed during this quiz.');
  private quizMonitoringActive = false;

  readonly ArrowLeftIcon = ArrowLeft;
  readonly FileTextIcon = FileText;
  readonly TrophyIcon = Trophy;
  readonly LockIcon = Lock;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly XIcon = X;
  readonly LightbulbIcon = Lightbulb;
  readonly SparklesIcon = Sparkles;
  readonly hintLevels = [1, 2, 3];

  chapterPdfUrl = computed<SafeResourceUrl | null>(() => {
    const pdfUrl = this.currentChapter()?.pdfUrl;
    return pdfUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl) : null;
  });

  isLastChapter = computed(() => {
    const training = this.training();
    const chapter = this.currentChapter();
    const chapters = training?.chaptersData ?? [];

    if (!chapter || chapters.length === 0) {
      return false;
    }

    return chapters[chapters.length - 1]?.number === chapter.number;
  });

  progressPercent = computed(() => {
    const training = this.training();
    return training ? this.progress.getProgressPercent(training, Boolean(this.quiz())) : 0;
  });

  constructor() {
    this.route.params.subscribe((params) => {
      void this.loadStep(params['slug'], params['chapterId']);
    });
  }

  ngOnDestroy() {
    this.stopQuizMonitoring();
  }

  private async loadStep(slug: string, chapterId: string) {
    this.loadError.set('');

    try {
      const training = await this.data.getPublishedTrainingBySlug(slug);
      this.training.set(training);

      let linkedQuiz: Quiz | null = null;
      try {
        linkedQuiz = await this.data.getQuizByCourseTitle(training.title);
      } catch {
        linkedQuiz = null;
      }
      this.progress.syncQuizState(training.slug, linkedQuiz?.id ?? null);
      this.quiz.set(linkedQuiz);

      if (chapterId === 'quiz') {
        if (!this.progress.isQuizUnlocked(training)) {
          const nextChapter = this.progress.getNextUnlockedIncompleteChapter(training) ?? training.chaptersData?.[0] ?? null;
          if (nextChapter) {
            await this.router.navigate(['/courses', training.slug, nextChapter.number]);
          }
          return;
        }

        this.isQuizStep.set(true);
        this.currentChapter.set(null);
        const questions = linkedQuiz ? this.data.getQuizQuestions(linkedQuiz) : [];
        this.questions.set(questions);
        this.selectedAnswers.set(Array(questions.length).fill(-1));
        this.questionHints.set({});
        this.hintLoadingQuestionId.set(null);
        this.hintError.set('');
        this.quizScore.set(null);
        this.quizBaseScore.set(null);
        const lastQuizResult = this.progress.getLastQuizResult(training.slug);
        this.quizPassed.set(this.progress.hasPassedQuiz(training.slug));
        this.quizSubmitted.set(lastQuizResult.taken);
        this.quizScore.set(lastQuizResult.score);
        this.quizBaseScore.set(lastQuizResult.baseScore);
        this.restoredStoredResult.set(lastQuizResult.taken);
        this.resultOverlayVisible.set(lastQuizResult.taken);
        this.quizAttempts.set(this.progress.getQuizAttempts(training.slug));
        this.revealAnswers.set(this.progress.shouldRevealQuizAnswers(training.slug));
        this.antiCheatTriggered.set(false);
        this.antiCheatMessage.set('');
        this.startQuizMonitoring();
        return;
      }

      const chapterNumber = Number(chapterId);
      const requestedChapter = training.chaptersData?.find((item) => item.number === chapterNumber)
        ?? training.chaptersData?.[0]
        ?? null;
      if (requestedChapter && !this.progress.isChapterUnlocked(training, requestedChapter.number)) {
        const nextChapter = this.progress.getNextUnlockedIncompleteChapter(training) ?? training.chaptersData?.[0] ?? null;
        if (nextChapter) {
          await this.router.navigate(['/courses', training.slug, nextChapter.number]);
        }
        return;
      }

      const chapter = requestedChapter;
      this.currentChapter.set(chapter);
      this.isQuizStep.set(false);
      this.questions.set([]);
      this.selectedAnswers.set([]);
      this.questionHints.set({});
      this.hintLoadingQuestionId.set(null);
      this.hintError.set('');
      this.quizScore.set(null);
      this.quizBaseScore.set(null);
      this.quizPassed.set(false);
      this.quizSubmitted.set(false);
      this.quizAttempts.set(this.progress.getQuizAttempts(training.slug));
      this.revealAnswers.set(this.progress.shouldRevealQuizAnswers(training.slug));
      this.antiCheatTriggered.set(false);
      this.antiCheatMessage.set('');
      this.restoredStoredResult.set(false);
      this.resultOverlayVisible.set(false);
      this.stopQuizMonitoring();
    } catch {
      this.training.set(null);
      this.currentChapter.set(null);
      this.quiz.set(null);
      this.questions.set([]);
      this.selectedAnswers.set([]);
      this.questionHints.set({});
      this.hintLoadingQuestionId.set(null);
      this.hintError.set('');
      this.isQuizStep.set(false);
      this.antiCheatTriggered.set(false);
      this.antiCheatMessage.set('');
      this.restoredStoredResult.set(false);
      this.resultOverlayVisible.set(false);
      this.stopQuizMonitoring();
      this.loadError.set('We could not load this course step right now.');
    }
  }

  canTakeQuiz() {
    const training = this.training();
    return !!training
      && this.progress.isQuizUnlocked(training)
      && this.quizAttempts() < 2
      && !this.quizPassed();
  }

  isChapterCompleted(chapterNumber: number) {
    const training = this.training();
    return training ? this.progress.isChapterCompleted(training.slug, chapterNumber) : false;
  }

  isChapterUnlocked(chapterNumber: number) {
    const training = this.training();
    return training ? this.progress.isChapterUnlocked(training, chapterNumber) : false;
  }

  isQuizUnlocked() {
    const training = this.training();
    return training ? this.progress.isQuizUnlocked(training) : false;
  }

  async markCurrentChapterCompleted() {
    const training = this.training();
    const chapter = this.currentChapter();
    if (!training || !chapter) return;

    this.progress.markChapterCompleted(training.slug, chapter.number);

    const nextChapter = this.progress.getNextUnlockedIncompleteChapter(training);
    if (nextChapter) {
      await this.router.navigate(['/courses', training.slug, nextChapter.number]);
      return;
    }

    if (this.quiz()) {
      await this.router.navigate(['/courses', training.slug, 'quiz']);
    }
  }

  selectAnswer(questionIndex: number, answerIndex: number) {
    const next = [...this.selectedAnswers()];
    next[questionIndex] = answerIndex;
    this.selectedAnswers.set(next);
    this.hintError.set('');
  }

  currentHint(questionId: string) {
    return this.questionHints()[questionId] ?? null;
  }

  isHintLoading(questionId: string) {
    return this.hintLoadingQuestionId() === questionId;
  }

  isHintEligible(questionId: string) {
    const question = this.questions().find((item) => item.id === questionId);
    return (question?.weight ?? 1) === 3;
  }

  canRequestHint(questionId: string) {
    const hint = this.currentHint(questionId);
    return this.isHintEligible(questionId)
      && this.canTakeQuiz()
      && !this.quizSubmitted()
      && (hint?.remainingHints ?? 3) > 0;
  }

  usedHintLevel(questionId: string) {
    return this.currentHint(questionId)?.hintLevel ?? 0;
  }

  hintButtonLabel(questionId: string) {
    if (this.isHintLoading(questionId)) {
      return 'Generating...';
    }

    const hint = this.currentHint(questionId);
    if (!hint) {
      return this.isHintEligible(questionId) ? 'Get hint' : 'Hints for weight 3 only';
    }

    return hint.remainingHints > 0 ? 'Get another hint' : 'No hints left';
  }

  async requestHint(questionIndex: number) {
    const quiz = this.quiz();
    const question = this.questions()[questionIndex];
    if (!quiz || !question || !this.canRequestHint(question.id)) {
      return;
    }

    const existingHint = this.currentHint(question.id);
    const nextHintLevel = Math.min(3, (existingHint?.hintLevel ?? 0) + 1);
    const selectedAnswer = this.selectedAnswers()[questionIndex];

    this.hintLoadingQuestionId.set(question.id);
    this.hintError.set('');

    try {
      const result = await this.data.getQuizHint(
        quiz.id,
        question.id,
        nextHintLevel,
        selectedAnswer >= 0 ? selectedAnswer : null
      );

      this.questionHints.update((current) => ({
        ...current,
        [question.id]: result
      }));
    } catch (error) {
      this.hintError.set(this.formatHintError(error));
    } finally {
      this.hintLoadingQuestionId.set(null);
    }
  }

  async submitQuiz() {
    const quiz = this.quiz();
    const questions = this.questions();
    const training = this.training();
    if (!quiz || questions.length === 0 || !training || !this.canTakeQuiz()) return;

    const answers = questions.reduce<Record<string, number>>((accumulator, question, index) => {
      const answer = this.selectedAnswers()[index];
      if (answer >= 0) {
        accumulator[question.id] = answer;
      }
      return accumulator;
    }, {});

    const result = await this.data.evaluateQuiz(quiz.id, answers);
    const passed = result.passed;
    const progress = this.progress.recordQuizAttempt(training.slug, passed, result.score, result.baseScore);
    this.quizBaseScore.set(result.baseScore);
    this.quizScore.set(result.score);
    this.quizPassed.set(progress.quizPassed);
    this.quizSubmitted.set(true);
    this.quizAttempts.set(progress.quizAttempts);
    this.revealAnswers.set(progress.revealAnswers);
    this.restoredStoredResult.set(false);
    this.resultOverlayVisible.set(true);
    this.stopQuizMonitoring();
  }

  retryQuiz() {
    if (!this.canTakeQuiz()) return;

    this.selectedAnswers.set(Array(this.questions().length).fill(-1));
    this.questionHints.set({});
    this.hintLoadingQuestionId.set(null);
    this.hintError.set('');
    this.quizScore.set(null);
    this.quizBaseScore.set(null);
    this.quizSubmitted.set(false);
    this.antiCheatTriggered.set(false);
    this.antiCheatMessage.set('');
    this.restoredStoredResult.set(false);
    this.resultOverlayVisible.set(false);
    this.startQuizMonitoring();
  }

  private startQuizMonitoring() {
    if (this.quizMonitoringActive || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    if (!this.isQuizStep() || this.quizSubmitted() || !this.canTakeQuiz()) {
      return;
    }

    document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    window.addEventListener('blur', this.boundWindowBlurHandler);
    this.quizMonitoringActive = true;
  }

  private stopQuizMonitoring() {
    if (!this.quizMonitoringActive || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    window.removeEventListener('blur', this.boundWindowBlurHandler);
    this.quizMonitoringActive = false;
  }

  private handleQuizVisibilityViolation(message: string) {
    if (!this.quizMonitoringActive || !this.isQuizStep() || this.quizSubmitted() || !this.canTakeQuiz()) {
      return;
    }

    if (typeof document !== 'undefined' && !document.hidden && message.includes('Tab switching')) {
      return;
    }

    const training = this.training();
    if (!training) {
      return;
    }

    const progress = this.progress.recordQuizAttempt(training.slug, false, 0, 0);
    this.quizBaseScore.set(0);
    this.quizScore.set(0);
    this.quizPassed.set(progress.quizPassed);
    this.quizSubmitted.set(true);
    this.quizAttempts.set(progress.quizAttempts);
    this.revealAnswers.set(progress.revealAnswers);
    this.antiCheatTriggered.set(true);
    this.antiCheatMessage.set(`${message} This attempt has been marked as failed automatically.`);
    this.restoredStoredResult.set(false);
    this.resultOverlayVisible.set(true);
    this.stopQuizMonitoring();
  }

  closeResultOverlay() {
    this.resultOverlayVisible.set(false);
  }

  private formatHintError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = typeof error.error?.error === 'string'
        ? error.error.error.trim()
        : typeof error.error?.message === 'string'
          ? error.error.message.trim()
          : '';

      if (error.status === 401 || error.status === 403) {
        return 'Hint service is currently blocked by backend security (401/403). Restart the gateway and quiz service, then try again.';
      }

      if (backendMessage) {
        return backendMessage;
      }

      if (error.status > 0) {
        return `Hint request failed with status ${error.status}. Please try again.`;
      }
    }

    return 'We could not generate a hint right now. Please try again.';
  }
}
