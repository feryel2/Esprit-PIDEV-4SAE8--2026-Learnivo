import { Injectable, signal } from '@angular/core';
import { Training } from './data.service';

interface CourseProgress {
  completedChapters: number[];
  quizAttempts: number;
  quizPassed: boolean;
  revealAnswers: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LearningProgressService {
  private readonly storageKey = 'frontend_learning_progress';
  private progressStore = signal<Record<string, CourseProgress>>(this.readStore());

  getNextLearningRoute(training: Training) {
    const progress = this.getCourseProgress(training.slug);
    const nextChapter = (training.chaptersData ?? []).find(
      (chapter) => !progress.completedChapters.includes(chapter.number)
    );

    return ['/courses', training.slug, String(nextChapter?.number ?? 'quiz')];
  }

  isChapterCompleted(trainingSlug: string, chapterNumber: number) {
    return this.getCourseProgress(trainingSlug).completedChapters.includes(chapterNumber);
  }

  getCompletedChapters(trainingSlug: string) {
    return [...this.getCourseProgress(trainingSlug).completedChapters];
  }

  getQuizAttempts(trainingSlug: string) {
    return this.getCourseProgress(trainingSlug).quizAttempts;
  }

  hasPassedQuiz(trainingSlug: string) {
    return this.getCourseProgress(trainingSlug).quizPassed;
  }

  shouldRevealQuizAnswers(trainingSlug: string) {
    return this.getCourseProgress(trainingSlug).revealAnswers;
  }

  markChapterCompleted(trainingSlug: string, chapterNumber: number) {
    const progress = this.getCourseProgress(trainingSlug);
    if (!progress.completedChapters.includes(chapterNumber)) {
      const updated: CourseProgress = {
        ...progress,
        completedChapters: [...progress.completedChapters, chapterNumber].sort((a, b) => a - b)
      };
      this.saveCourseProgress(trainingSlug, updated);
    }
  }

  areAllChaptersCompleted(training: Training) {
    return (training.chaptersData ?? []).every((chapter) =>
      this.isChapterCompleted(training.slug, chapter.number)
    );
  }

  recordQuizAttempt(trainingSlug: string, passed: boolean) {
    const progress = this.getCourseProgress(trainingSlug);
    const attempts = Math.min(2, progress.quizAttempts + 1);
    const updated: CourseProgress = {
      ...progress,
      quizAttempts: attempts,
      quizPassed: progress.quizPassed || passed,
      revealAnswers: !passed && attempts >= 2
    };
    this.saveCourseProgress(trainingSlug, updated);
    return updated;
  }

  resetQuiz(trainingSlug: string) {
    const progress = this.getCourseProgress(trainingSlug);
    const updated: CourseProgress = {
      ...progress,
      quizAttempts: 0,
      quizPassed: false,
      revealAnswers: false
    };
    this.saveCourseProgress(trainingSlug, updated);
  }

  private getCourseProgress(trainingSlug: string): CourseProgress {
    const store = this.progressStore();
    const progress = store[trainingSlug];
    return {
      completedChapters: Array.isArray(progress?.completedChapters) ? progress.completedChapters : [],
      quizAttempts: Math.min(2, Math.max(0, Number(progress?.quizAttempts ?? 0) || 0)),
      quizPassed: Boolean(progress?.quizPassed),
      revealAnswers: Boolean(progress?.revealAnswers)
    };
  }

  private saveCourseProgress(trainingSlug: string, progress: CourseProgress) {
    const store = { ...this.progressStore(), [trainingSlug]: progress };
    this.progressStore.set(store);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(store));
    }
  }

  private readStore(): Record<string, CourseProgress> {
    if (typeof window === 'undefined') return {};

    const stored = window.localStorage.getItem(this.storageKey);
    if (!stored) return {};

    try {
      return JSON.parse(stored) as Record<string, CourseProgress>;
    } catch {
      window.localStorage.removeItem(this.storageKey);
      return {};
    }
  }
}
