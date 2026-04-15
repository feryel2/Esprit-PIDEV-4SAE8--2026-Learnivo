import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  LogOut,
  ChevronRight,
  Trophy,
  Video,
  FileQuestion,
  BookOpen
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border bg-white">
      <div class="flex items-center gap-3 border-b border-border p-6">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
            <span class="text-lg font-bold text-white">T</span>
        </div>
        <span class="text-xl font-bold tracking-tight">Teacher<span class="text-teal-600 underline decoration-2 underline-offset-4">Panel</span></span>
      </div>

      <nav class="flex-1 space-y-2 overflow-y-auto p-4">
        <a routerLink="/teacher" routerLinkActive="bg-teal-50 text-teal-600" [routerLinkActiveOptions]="{exact: true}" 
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="LayoutDashboard" [size]="18"></lucide-icon>
            <span class="font-medium">Dashboard</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/courses" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="GraduationCap" [size]="18"></lucide-icon>
            <span class="font-medium">Courses</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/quizzes" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="FileQuestion" [size]="18"></lucide-icon>
            <span class="font-medium">Quizzes</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/clubs" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Users" [size]="18"></lucide-icon>
            <span class="font-medium">Clubs</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/events" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Calendar" [size]="18"></lucide-icon>
            <span class="font-medium">Events</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/competitions" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Trophy" [size]="18"></lucide-icon>
            <span class="font-medium">Competitions</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/teacher/classes" routerLinkActive="bg-teal-50 text-teal-600"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Video" [size]="18"></lucide-icon>
            <span class="font-medium">Classes</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>

        <a routerLink="/student"
           class="group flex items-center justify-between rounded-xl p-3 transition-all duration-300 hover:bg-teal-50 hover:text-teal-600">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="BookOpen" [size]="18"></lucide-icon>
            <span class="font-medium">Student View</span>
          </div>
          <lucide-icon [name]="ChevronRight" [size]="14" class="opacity-0 transition-opacity group-hover:opacity-100"></lucide-icon>
        </a>
      </nav>

      <div class="border-t border-border p-4">
        <button type="button" (click)="logout()" class="flex w-full items-center gap-3 rounded-xl p-3 text-destructive transition-all hover:bg-destructive/10">
          <lucide-icon [name]="LogOut" [size]="18"></lucide-icon>
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly LayoutDashboard = LayoutDashboard;
  readonly GraduationCap = GraduationCap;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly Trophy = Trophy;
  readonly Video = Video;
  readonly FileQuestion = FileQuestion;
  readonly BookOpen = BookOpen;

  logout() {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
