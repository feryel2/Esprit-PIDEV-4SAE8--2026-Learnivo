import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowLeft, FileText, Trophy } from 'lucide-angular';
import { DataService, Quiz, QuizQuestion, Training, TrainingChapter } from '../services/data.service';
import { LearningProgressService } from '../services/learning-progress.service';

@Component({
  selector: 'app-chapter-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './chapter-detail.component.html',
})
export class ChapterDetailComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private sanitizer = inject(DomSanitizer);
  private progress = inject(LearningProgressService);

  training = signal<Training | null>(null);
  currentChapter = signal<TrainingChapter | null>(null);
  isQuizStep = signal(false);
  quiz = signal<Quiz | null>(null);
  questions = signal<QuizQuestion[]>([]);
  selectedAnswers = signal<number[]>([]);
  quizScore = signal<number | null>(null);
  quizPassed = signal(false);
  quizSubmitted = signal(false);
  quizAttempts = signal(0);
  revealAnswers = signal(false);
  loadError = signal('');

  readonly ArrowLeftIcon = ArrowLeft;
  readonly FileTextIcon = FileText;
  readonly TrophyIcon = Trophy;

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

  constructor() {
    this.route.params.subscribe((params) => {
      void this.loadStep(params['slug'], params['chapterId']);
    });
  }

  private async loadStep(slug: string, chapterId: string) {
    this.loadError.set('');

    try {
      const training = await this.data.getTrainingBySlug(slug);
      this.training.set(training);

      let linkedQuiz: Quiz | null = null;
      try {
        linkedQuiz = await this.data.getQuizByCourseTitle(training.title);
      } catch {
        linkedQuiz = null;
      }
      this.quiz.set(linkedQuiz);

      if (chapterId === 'quiz') {
        this.isQuizStep.set(true);
        this.currentChapter.set(null);
        const questions = linkedQuiz ? this.data.getQuizQuestions(linkedQuiz) : [];
        this.questions.set(questions);
        this.selectedAnswers.set(Array(questions.length).fill(-1));
        this.quizScore.set(null);
        this.quizPassed.set(this.progress.hasPassedQuiz(training.slug));
        this.quizSubmitted.set(false);
        this.quizAttempts.set(this.progress.getQuizAttempts(training.slug));
        this.revealAnswers.set(this.progress.shouldRevealQuizAnswers(training.slug));
        return;
      }

      const chapterNumber = Number(chapterId);
      const chapter = training.chaptersData?.find((item) => item.number === chapterNumber)
        ?? training.chaptersData?.[0]
        ?? null;
      this.currentChapter.set(chapter);
      this.isQuizStep.set(false);
      this.questions.set([]);
      this.selectedAnswers.set([]);
      this.quizScore.set(null);
      this.quizPassed.set(false);
      this.quizSubmitted.set(false);
      this.quizAttempts.set(this.progress.getQuizAttempts(training.slug));
      this.revealAnswers.set(this.progress.shouldRevealQuizAnswers(training.slug));
    } catch {
      this.training.set(null);
      this.currentChapter.set(null);
      this.quiz.set(null);
      this.questions.set([]);
      this.selectedAnswers.set([]);
      this.isQuizStep.set(false);
      this.loadError.set('We could not load this course step right now.');
    }
  }

  canTakeQuiz() {
    return this.quizAttempts() < 2 && !this.quizPassed();
  }

  selectAnswer(questionIndex: number, answerIndex: number) {
    const next = [...this.selectedAnswers()];
    next[questionIndex] = answerIndex;
    this.selectedAnswers.set(next);
  }

  submitQuiz() {
    const quiz = this.quiz();
    const questions = this.questions();
    const training = this.training();
    if (!quiz || questions.length === 0 || !training || !this.canTakeQuiz()) return;

    const correct = questions.filter((question, index) => this.selectedAnswers()[index] === question.correctAnswer).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= quiz.passScore;
    const progress = this.progress.recordQuizAttempt(training.slug, passed);
    this.quizScore.set(score);
    this.quizPassed.set(progress.quizPassed);
    this.quizSubmitted.set(true);
    this.quizAttempts.set(progress.quizAttempts);
    this.revealAnswers.set(progress.revealAnswers);
  }

  retryQuiz() {
    if (!this.canTakeQuiz()) return;

    this.selectedAnswers.set(Array(this.questions().length).fill(-1));
    this.quizScore.set(null);
    this.quizSubmitted.set(false);
  }
}
