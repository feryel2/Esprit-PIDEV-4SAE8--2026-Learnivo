import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Lock, CheckCircle2, Trophy } from 'lucide-angular';
import { DataService, CourseRecommendation, CourseRecommendationResult, Quiz, Training } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { LearningProgressService } from '../services/learning-progress.service';

@Component({
  selector: 'app-training-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './training-detail.component.html',
})
export class TrainingDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private learningProgress = inject(LearningProgressService);
  private authService = inject(AuthService);

  readonly ArrowRightIcon = ArrowRight;
  readonly LockIcon = Lock;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly TrophyIcon = Trophy;

  training = signal<Training | null>(null);
  quiz = signal<Quiz | null>(null);
  recommendations = signal<CourseRecommendation[]>([]);
  recommendationSource = signal<CourseRecommendationResult['source'] | null>(null);
  recommendationsLoading = signal(false);
  recommendationsError = signal('');

  ngOnInit() {
    this.route.params.subscribe(params => {
      void this.loadTraining(params['slug']);
    });
  }

  private async loadTraining(slug: string) {
    try {
      const found = await this.dataService.getPublishedTrainingBySlug(slug);
      this.training.set(found);
      const linkedQuiz = await this.dataService.getQuizByCourseTitle(found.title);
      this.learningProgress.syncQuizState(found.slug, linkedQuiz?.id ?? null);
      this.quiz.set(linkedQuiz);
      if (this.authService.isLoggedIn()) {
        await this.loadRecommendations(found);
      } else {
        this.recommendations.set([]);
        this.recommendationSource.set(null);
        this.recommendationsError.set('Sign in to unlock personalized course recommendations.');
        this.recommendationsLoading.set(false);
      }
    } catch {
      this.training.set(null);
      this.quiz.set(null);
      this.recommendations.set([]);
      this.recommendationSource.set(null);
      this.recommendationsError.set('');
      this.recommendationsLoading.set(false);
    }
  }

  private async loadRecommendations(training: Training) {
    this.recommendationsLoading.set(true);
    this.recommendationsError.set('');
    this.recommendations.set([]);
    this.recommendationSource.set(null);

    try {
      const response = await this.dataService.getCourseRecommendations(training, {
        goal: `Recommend the best next English-learning courses after ${training.title}.`,
        limit: 3
      });
      this.recommendations.set(
        response.recommendations.filter((item) => item.course.id !== training.id).slice(0, 3)
      );
      this.recommendationSource.set(response.source);
    } catch {
      this.recommendationsError.set('Recommendations are unavailable right now.');
    } finally {
      this.recommendationsLoading.set(false);
    }
  }

  continueLearningLink() {
    const current = this.training();
    if (!current) return ['/courses'];
    return this.learningProgress.getNextLearningRoute(current, Boolean(this.quiz()));
  }

  progressPercent() {
    const current = this.training();
    if (!current) return 0;
    return this.learningProgress.getProgressPercent(current, Boolean(this.quiz()));
  }

  completedChapterCount() {
    const current = this.training();
    if (!current) return 0;
    return this.learningProgress.getCompletedChapterCount(current);
  }

  isChapterCompleted(chapterNumber: number) {
    const current = this.training();
    return current ? this.learningProgress.isChapterCompleted(current.slug, chapterNumber) : false;
  }

  isChapterUnlocked(chapterNumber: number) {
    const current = this.training();
    return current ? this.learningProgress.isChapterUnlocked(current, chapterNumber) : false;
  }

  isQuizUnlocked() {
    const current = this.training();
    return current ? this.learningProgress.isQuizUnlocked(current) : false;
  }

  hasPassedQuiz() {
    const current = this.training();
    return current ? this.learningProgress.hasPassedQuiz(current.slug) : false;
  }

  hasTakenQuiz() {
    const current = this.training();
    return current ? this.learningProgress.hasTakenQuiz(current.slug) : false;
  }

  lastQuizResult() {
    const current = this.training();
    return current
      ? this.learningProgress.getLastQuizResult(current.slug)
      : { taken: false, score: null, baseScore: null, status: null };
  }

  recommendationBadge() {
    return this.recommendationSource() === 'AI' ? 'AI selected' : 'Smart match';
  }
}
