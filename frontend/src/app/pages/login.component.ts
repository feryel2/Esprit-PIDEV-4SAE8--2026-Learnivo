import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.18),_transparent_45%),linear-gradient(180deg,#f6fffd_0%,#eff8f7_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div class="space-y-6">
          <span class="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-1 text-sm font-semibold text-teal-700">
            Student and teacher access
          </span>
          <div class="space-y-4">
            <h1 class="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Sign in and enter the right space for your role.
            </h1>
            <p class="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Students continue their learning journey. Teachers manage courses, quizzes, and the teaching dashboard.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-teal-900/5 backdrop-blur">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Student access</p>
              <p class="mt-3 text-sm text-slate-700">Use your-name@learnivo.local</p>
              <p class="text-sm text-slate-700">Example: feryel@learnivo.local</p>
            </div>
            <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-teal-900/5 backdrop-blur">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Teacher demo</p>
              <p class="mt-3 text-sm text-slate-700">Email: teacher@learnivo.local</p>
              <p class="text-sm text-slate-700">Password: teacher123</p>
            </div>
          </div>
        </div>

        <div class="rounded-[2rem] border border-white/70 bg-white p-8 shadow-2xl shadow-slate-900/10">
          <div class="mb-8">
            <p class="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">Login</p>
            <h2 class="mt-3 text-2xl font-bold text-slate-900">Access your account</h2>
          </div>

          <form class="space-y-5" (ngSubmit)="submit()">
            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                [(ngModel)]="email"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                placeholder="name@example.com"
                required
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                name="password"
                [(ngModel)]="password"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                placeholder="Enter your password"
                required
              />
            </label>

            <div class="space-y-3">
              <p class="text-sm font-medium text-slate-700">Choose access</p>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  (click)="role.set('STUDENT')"
                  class="rounded-2xl border px-4 py-4 text-left transition"
                  [class.border-teal-600]="role() === 'STUDENT'"
                  [class.bg-teal-50]="role() === 'STUDENT'"
                  [class.border-slate-200]="role() !== 'STUDENT'"
                >
                  <p class="font-semibold text-slate-900">Student</p>
                  <p class="mt-1 text-sm text-slate-600">Courses, chapters, quizzes, and certificates.</p>
                </button>
                <button
                  type="button"
                  (click)="role.set('TEACHER')"
                  class="rounded-2xl border px-4 py-4 text-left transition"
                  [class.border-emerald-600]="role() === 'TEACHER'"
                  [class.bg-emerald-50]="role() === 'TEACHER'"
                  [class.border-slate-200]="role() !== 'TEACHER'"
                >
                  <p class="font-semibold text-slate-900">Teacher</p>
                  <p class="mt-1 text-sm text-slate-600">Teaching dashboard, course management, and quizzes.</p>
                </button>
              </div>
            </div>

            @if (errorMessage()) {
              <div class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {{ errorMessage() }}
              </div>
            }

            <button
              type="submit"
              [disabled]="submitting()"
              class="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {{ submitting() ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  role = signal<UserRole>('STUDENT');
  submitting = signal(false);
  errorMessage = signal('');

  async submit() {
    this.errorMessage.set('');
    this.submitting.set(true);

    try {
      const user = await this.authService.login({
        email: this.email.trim(),
        password: this.password,
        role: this.role(),
      });

      await this.router.navigateByUrl(user.redirectPath);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to sign in right now.');
    } finally {
      this.submitting.set(false);
    }
  }
}
