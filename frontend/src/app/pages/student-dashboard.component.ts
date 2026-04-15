import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="bg-[linear-gradient(180deg,#fcfffe_0%,#f1f8f6_100%)] px-4 py-14 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl space-y-8">
        <div class="rounded-[2rem] bg-slate-900 px-8 py-10 text-white shadow-2xl shadow-slate-900/15">
          <p class="text-sm uppercase tracking-[0.3em] text-teal-300">Student space</p>
          <h1 class="mt-4 text-3xl font-black sm:text-4xl">Welcome back, {{ displayName() }}.</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Continue your courses, review chapter progress, and jump back into quizzes from one place.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <a routerLink="/courses" class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">Courses</p>
            <h2 class="mt-3 text-xl font-bold text-slate-900">Explore trainings</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Browse active courses and open a chapter in one click.</p>
          </a>

          <a routerLink="/classes" class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Classes</p>
            <h2 class="mt-3 text-xl font-bold text-slate-900">Join live sessions</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Check schedules, instructors, and your next class.</p>
          </a>

          <a routerLink="/certificate" class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Certificate</p>
            <h2 class="mt-3 text-xl font-bold text-slate-900">Track achievements</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">View your learning milestones and completion outcomes.</p>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class StudentDashboardComponent {
  private readonly authService = inject(AuthService);

  readonly displayName = computed(() => this.authService.currentUser()?.fullName ?? 'Student');
}
