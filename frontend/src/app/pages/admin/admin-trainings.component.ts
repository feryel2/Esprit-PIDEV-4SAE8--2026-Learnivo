import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, TrainingStatus } from '../../services/data.service';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  ArrowUpDown,
  BookOpen,
  Layers3,
  BarChart3
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">
            Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Courses</span>
          </h1>
          <p class="text-muted-foreground">Add, edit, or remove course programs from the platform.</p>
        </div>
        <a
          routerLink="/admin/courses/new"
          class="group inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:scale-105 hover:bg-teal-700 active:scale-95"
        >
          <lucide-icon [name]="Plus" [size]="18" class="transition-transform group-hover:rotate-90"></lucide-icon>
          Add Course
        </a>
      </div>

      <div class="flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm md:flex-row">
        <div class="relative w-full flex-1">
          <lucide-icon [name]="Search" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search courses by title, category, or instructor..."
            class="w-full rounded-xl border-none bg-muted/30 py-3 pl-12 pr-4 text-sm transition-all focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div class="grid w-full gap-3 md:w-auto md:grid-cols-3">
          <div class="flex items-center gap-2 rounded-xl border border-border px-4 py-3">
            <lucide-icon [name]="ArrowUpDown" [size]="16" class="text-muted-foreground"></lucide-icon>
            <select
              [ngModel]="statusFilter()"
              (ngModelChange)="onStatusFilterChange($event)"
              class="w-full bg-transparent text-sm font-medium outline-none md:min-w-32"
            >
              <option value="All">Status: All</option>
              <option value="Published">Status: Published</option>
              <option value="Draft">Status: Draft</option>
            </select>
          </div>
          <div class="flex items-center gap-2 rounded-xl border border-border px-4 py-3">
            <lucide-icon [name]="ArrowUpDown" [size]="16" class="text-muted-foreground"></lucide-icon>
            <select
              [ngModel]="levelFilter()"
              (ngModelChange)="onLevelFilterChange($event)"
              class="w-full bg-transparent text-sm font-medium outline-none md:min-w-32"
            >
              <option value="All">Level: All</option>
              <option value="Beginner">Level: Beginner</option>
              <option value="Intermediate">Level: Intermediate</option>
              <option value="Mid-level">Level: Mid-level</option>
              <option value="Upper-intermediate">Level: Upper-intermediate</option>
              <option value="Advanced">Level: Advanced</option>
            </select>
          </div>
          <div class="flex items-center gap-2 rounded-xl border border-border px-4 py-3">
            <lucide-icon [name]="ArrowUpDown" [size]="16" class="text-muted-foreground"></lucide-icon>
            <select
              [ngModel]="categoryFilter()"
              (ngModelChange)="onCategoryFilterChange($event)"
              class="w-full bg-transparent text-sm font-medium outline-none md:min-w-32"
            >
              <option value="All">Category: All</option>
              @for (category of categoryOptions(); track category) {
              <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>
        </div>
        <div class="flex w-full items-center gap-3 md:w-auto">
          <button
            (click)="exportCurrentResults()"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition-all hover:bg-muted/50 md:w-auto"
          >
            <lucide-icon [name]="Download" [size]="16"></lucide-icon>
            Export
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th class="px-6 py-4">Course</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Instructor</th>
                <th class="px-6 py-4">Difficulty</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let training of paginatedCourses()" class="group transition-colors hover:bg-muted/20">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <img [src]="training.image" [alt]="training.title" class="h-12 w-12 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105" />
                    <div>
                      <p class="text-sm font-bold">{{ training.title }}</p>
                      <p class="text-xs text-muted-foreground">{{ training.duration || 'Duration not set' }} • {{ training.chapters || 0 }} chapters</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5 truncate">
                  <span class="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-600">
                    {{ training.category || 'Uncategorized' }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <p class="text-sm font-medium">{{ training.instructor || 'No instructor' }}</p>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col gap-1">
                    <span
                      class="inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
                      [class.bg-emerald-50]="training.difficultyLabel === 'Beginner'"
                      [class.text-emerald-700]="training.difficultyLabel === 'Beginner'"
                      [class.bg-amber-50]="training.difficultyLabel === 'Intermediate'"
                      [class.text-amber-700]="training.difficultyLabel === 'Intermediate'"
                      [class.bg-rose-50]="training.difficultyLabel === 'Advanced'"
                      [class.text-rose-700]="training.difficultyLabel === 'Advanced'"
                      [class.bg-slate-100]="!training.difficultyLabel"
                      [class.text-slate-600]="!training.difficultyLabel"
                    >
                      {{ training.difficultyLabel || 'Unknown' }}
                    </span>
                    <p class="text-xs text-muted-foreground">
                      Score {{ training.difficultyScore ?? 0 }}/100
                    </p>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <button
                    type="button"
                    (click)="toggleCourseStatus(training.id)"
                    class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition"
                    [class.bg-emerald-50]="training.status === 'Published'"
                    [class.text-emerald-700]="training.status === 'Published'"
                    [class.bg-amber-50]="training.status === 'Draft'"
                    [class.text-amber-700]="training.status === 'Draft'"
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      [class.bg-emerald-500]="training.status === 'Published'"
                      [class.bg-amber-500]="training.status === 'Draft'"
                    ></span>
                    {{ training.status }}
                  </button>
                </td>
                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <a [routerLink]="['/admin/courses', training.id, 'edit']" class="rounded-lg p-2 transition-all hover:bg-teal-50 hover:text-teal-600" title="Edit">
                      <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                    </a>
                    <button (click)="deleteCourse(training.id)" class="rounded-lg p-2 transition-all hover:bg-rose-50 hover:text-rose-600" title="Delete">
                      <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                    </button>
                    <a [routerLink]="['/courses', training.slug]" class="rounded-lg p-2 transition-all hover:bg-muted" title="View">
                      <lucide-icon [name]="ExternalLink" [size]="16"></lucide-icon>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between border-t border-border bg-muted/5 p-6">
          <p class="text-xs font-medium text-muted-foreground">
            Showing <span class="text-foreground">{{ startItem() }}</span> to
            <span class="text-foreground">{{ endItem() }}</span> of
            <span class="text-foreground">{{ filteredCourses().length }}</span> results
          </p>
          <div class="flex items-center gap-2">
            <button
              (click)="goToPreviousPage()"
              class="rounded-xl border border-border px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-white disabled:opacity-50"
              [disabled]="currentPage() === 1"
            >
              Previous
            </button>
            <span class="px-2 text-xs font-medium text-muted-foreground">
              Page {{ currentPage() }} / {{ totalPages() }}
            </span>
            <button
              (click)="goToNextPage()"
              class="rounded-xl border border-border px-4 py-2 text-xs font-bold shadow-sm transition-all hover:bg-white disabled:opacity-50"
              [disabled]="currentPage() === totalPages()"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-3xl border border-border bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total courses</p>
              <p class="mt-1 text-2xl font-extrabold text-foreground">{{ data.trainings().length }}</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <lucide-icon [name]="BookOpen" [size]="18"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-border bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visible results</p>
              <p class="mt-1 text-2xl font-extrabold text-foreground">{{ filteredCourses().length }}</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <lucide-icon [name]="Layers3" [size]="18"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-border bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average chapters</p>
              <p class="mt-1 text-2xl font-extrabold text-foreground">{{ averageChapters() }}</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <lucide-icon [name]="BarChart3" [size]="18"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-border bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Published courses</p>
              <p class="mt-1 text-2xl font-extrabold text-foreground">{{ publishedCoursesCount() }}</p>
              <p class="mt-1 text-xs text-muted-foreground">{{ draftCoursesCount() }} draft course(s)</p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <lucide-icon [name]="ArrowUpDown" [size]="18"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-foreground">Course analytics</h2>
            <p class="text-sm text-muted-foreground">Pie chart of course categories across the full catalog.</p>
          </div>
          <div class="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            {{ categoryBreakdown().length }} categories
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-8 lg:flex-row lg:items-center">
          <div class="relative mx-auto flex h-64 w-64 items-center justify-center">
            <svg viewBox="0 0 220 220" class="h-64 w-64 -rotate-90 drop-shadow-sm">
              <circle cx="110" cy="110" r="70" fill="none" stroke="#e5e7eb" stroke-width="28"></circle>
              @for (segment of pieSegments(); track segment.label) {
              <circle
                cx="110"
                cy="110"
                r="70"
                fill="none"
                [attr.stroke]="segment.color"
                stroke-width="28"
                stroke-linecap="butt"
                [attr.stroke-dasharray]="segment.dashArray"
                [attr.stroke-dashoffset]="segment.dashOffset"
              ></circle>
              }
            </svg>
            <div class="absolute flex flex-col items-center justify-center text-center">
              <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
              <p class="text-3xl font-extrabold text-foreground">{{ categoryBreakdown().length }}</p>
            </div>
          </div>

          <div class="flex-1 space-y-3">
            @for (segment of categoryBreakdown(); track segment.label) {
            <div class="flex items-center justify-between gap-4 rounded-2xl bg-muted/30 px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="h-3 w-3 rounded-full" [style.background]="segment.color"></span>
                <div>
                  <p class="text-sm font-semibold text-foreground">{{ segment.label }}</p>
                  <p class="text-xs text-muted-foreground">{{ segment.count }} course(s)</p>
                </div>
              </div>
              <p class="text-sm font-bold text-foreground">{{ segment.percent }}%</p>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminTrainingsComponent {
  data = inject(DataService);
  private document = inject(DOCUMENT);
  readonly pageSize = 4;
  searchQuery = signal('');
  currentPage = signal(1);
  statusFilter = signal<'All' | TrainingStatus>('All');
  levelFilter = signal<'All' | 'Beginner' | 'Intermediate' | 'Mid-level' | 'Upper-intermediate' | 'Advanced'>('All');
  categoryFilter = signal<string>('All');
  private readonly chartColors = ['#0f766e', '#2563eb', '#f59e0b', '#e11d48', '#7c3aed', '#16a34a', '#ea580c'];
  categoryOptions = computed(() =>
    Array.from(new Set(this.data.trainings().map((item) => item.category || 'Uncategorized'))).sort((a, b) => a.localeCompare(b))
  );

  filteredCourses = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    let result = !query
      ? [...this.data.trainings()]
      : this.data.trainings().filter((training) =>
          training.title.toLowerCase().includes(query) ||
          (training.category ?? '').toLowerCase().includes(query) ||
          (training.instructor ?? '').toLowerCase().includes(query)
        );

    result = result.filter((training) => {
      if (this.statusFilter() !== 'All' && training.status !== this.statusFilter()) return false;
      if (this.levelFilter() !== 'All' && training.level !== this.levelFilter()) return false;
      if (this.categoryFilter() !== 'All' && (training.category || 'Uncategorized') !== this.categoryFilter()) return false;
      return true;
    });

    return result.sort((a, b) => a.title.localeCompare(b.title));
  });

  categoryBreakdown = computed(() => {
    const total = this.data.trainings().length || 1;
    const counts = new Map<string, number>();

    for (const training of this.data.trainings()) {
      const key = training.category || 'Uncategorized';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], index) => ({
        label,
        count,
        percent: Math.round((count / total) * 100),
        color: this.chartColors[index % this.chartColors.length]
      }));
  });

  pieSegments = computed(() => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const total = this.data.trainings().length || 1;
    let offset = 0;

    return this.categoryBreakdown().map((segment) => {
      const length = (segment.count / total) * circumference;
      const item = {
        ...segment,
        dashArray: `${length} ${circumference - length}`,
        dashOffset: -offset
      };
      offset += length;
      return item;
    });
  });

  averageChapters = computed(() => {
    if (this.data.trainings().length === 0) return 0;
    const total = this.data.trainings().reduce((sum, item) => sum + (item.chapters ?? 0), 0);
    return Math.round((total / this.data.trainings().length) * 10) / 10;
  });

  publishedCoursesCount = computed(() =>
    this.data.trainings().filter((item) => item.status === 'Published').length
  );

  draftCoursesCount = computed(() =>
    this.data.trainings().filter((item) => item.status === 'Draft').length
  );

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredCourses().length / this.pageSize)));

  paginatedCourses = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return this.filteredCourses().slice(start, start + this.pageSize);
  });

  startItem = computed(() => {
    if (this.filteredCourses().length === 0) return 0;
    return (Math.min(this.currentPage(), this.totalPages()) - 1) * this.pageSize + 1;
  });

  endItem = computed(() => {
    if (this.filteredCourses().length === 0) return 0;
    return this.startItem() + this.paginatedCourses().length - 1;
  });

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Download = Download;
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpDown = ArrowUpDown;
  readonly BookOpen = BookOpen;
  readonly Layers3 = Layers3;
  readonly BarChart3 = BarChart3;

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  onStatusFilterChange(value: 'All' | TrainingStatus) {
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  onLevelFilterChange(value: 'All' | 'Beginner' | 'Intermediate' | 'Mid-level' | 'Upper-intermediate' | 'Advanced') {
    this.levelFilter.set(value);
    this.currentPage.set(1);
  }

  onCategoryFilterChange(value: string) {
    this.categoryFilter.set(value);
    this.currentPage.set(1);
  }

  goToPreviousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  exportCurrentResults() {
    const results = this.filteredCourses();
    const printWindow = window.open('', '_blank', 'width=1100,height=800');

    if (!printWindow) {
      this.data.addNotification({
        title: 'Export blocked',
        message: 'The browser blocked the export window. Allow pop-ups and try again.',
        href: '/admin/courses'
      });
      return;
    }

    const rows = results.map((course) => `
      <tr>
        <td>${this.escapeHtml(course.title)}</td>
        <td>${this.escapeHtml(course.category || 'Uncategorized')}</td>
        <td>${this.escapeHtml(course.level)}</td>
        <td>${this.escapeHtml(course.difficultyLabel || 'Unknown')} (${course.difficultyScore ?? 0}/100)</td>
        <td>${this.escapeHtml(course.status)}</td>
        <td>${this.escapeHtml(course.instructor || 'No instructor')}</td>
        <td>${this.escapeHtml(course.duration || 'Duration not set')}</td>
        <td>${course.chapters ?? 0}</td>
      </tr>
    `).join('');

    const queryLabel = this.searchQuery().trim() || 'No search filter';
    const sortLabel = this.getFilterLabel();
    const exportedAt = new Date().toLocaleString();

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Courses Export</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 32px;
              color: #0f172a;
            }
            h1 {
              margin: 0 0 8px;
              font-size: 28px;
            }
            .meta {
              margin-bottom: 24px;
              color: #475569;
              font-size: 14px;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 12px;
              margin-bottom: 24px;
            }
            .card {
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              padding: 12px;
            }
            .card strong {
              display: block;
              font-size: 12px;
              text-transform: uppercase;
              color: #64748b;
              margin-bottom: 6px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              vertical-align: top;
              text-align: left;
            }
            th {
              background: #f8fafc;
              font-size: 12px;
              text-transform: uppercase;
              color: #475569;
            }
            .empty {
              margin-top: 24px;
              padding: 18px;
              border: 1px dashed #cbd5e1;
              border-radius: 12px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <h1>Courses Export</h1>
          <div class="meta">Exported on ${this.escapeHtml(exportedAt)}</div>

          <div class="summary">
            <div class="card">
              <strong>Search</strong>
              <span>${this.escapeHtml(queryLabel)}</span>
            </div>
            <div class="card">
              <strong>Sort</strong>
              <span>${this.escapeHtml(sortLabel)}</span>
            </div>
            <div class="card">
              <strong>Results</strong>
              <span>${results.length} course(s)</span>
            </div>
          </div>

          ${results.length === 0 ? `
            <div class="empty">No courses match the current search and sort settings.</div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Chapters</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    this.data.addNotification({
      title: 'PDF export ready',
      message: `${results.length} filtered course(s) prepared for PDF export.`,
      href: '/admin/courses'
    });
  }

  async deleteCourse(id: number | string) {
    const course = this.data.trainings().find(item => item.id === id);
    try {
      await this.data.deleteTraining(id);
      if (this.currentPage() > this.totalPages()) {
        this.currentPage.set(this.totalPages());
      }
      if (course) {
        this.data.addNotification({
          title: 'Course deleted',
          message: `"${course.title}" was removed from the course catalog.`,
          href: '/admin/courses'
        });
      }
    } catch {
      this.data.addNotification({
        title: 'Delete failed',
        message: 'The course could not be deleted because the backend is unavailable.',
        href: '/admin/courses'
      });
    }
  }

  async toggleCourseStatus(id: number | string) {
    const course = this.data.trainings().find(item => item.id === id);
    if (!course) return;

    const nextStatus: TrainingStatus = course.status === 'Published' ? 'Draft' : 'Published';
    try {
      await this.data.setTrainingStatus(id, nextStatus);
      this.data.addNotification({
        title: 'Course status updated',
        message: `"${course.title}" is now ${nextStatus.toLowerCase()}.`,
        href: '/admin/courses'
      });
    } catch {
      this.data.addNotification({
        title: 'Status update failed',
        message: 'The course status could not be updated because the backend is unavailable.',
        href: '/admin/courses'
      });
    }
  }

  private getFilterLabel() {
    return `Status: ${this.statusFilter()} | Level: ${this.levelFilter()} | Category: ${this.categoryFilter()}`;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
