import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationService } from '../../api/services/evaluation.service';
import { InternshipEvaluation, InternshipEvaluationRequest } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Star } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-evaluations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Evaluations</span></h1>
          <p class="text-muted-foreground">Internship evaluations and scores.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add Evaluation
        </button>
      </div>

      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-teal-200 shadow-md">
        <h2 class="text-lg font-bold mb-4">{{ editingItem ? 'Edit Evaluation' : 'New Evaluation' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Internship ID <span class="text-rose-500">*</span></label>
              <input type="number" formControlName="internshipId" placeholder="e.g. 1" [class]="fldClass('internshipId')" />
              <div *ngIf="isInvalid('internshipId')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('internshipId') }}</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Score (0–20) <span class="text-rose-500">*</span></label>
              <input type="number" step="0.5" formControlName="score" placeholder="e.g. 15" [class]="fldClass('score')" />
              <div *ngIf="isInvalid('score')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('score') }}</div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1">Feedback</label>
              <textarea formControlName="feedback" rows="3" placeholder="Overall evaluation feedback..."
                class="block w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"></textarea>
              <div class="flex justify-between mt-1">
                <div *ngIf="isInvalid('feedback')" class="text-rose-600 text-xs">⚠ Maximum 1000 characters</div>
                <div class="text-xs text-muted-foreground ml-auto">{{ form.get('feedback')?.value?.length ?? 0 }}/1000</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors">
              {{ editingItem ? 'Update' : 'Create' }}
            </button>
            <button type="button" (click)="cancel()" class="px-6 py-2 rounded-lg border border-border hover:bg-muted/40 transition-colors">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Search -->
      <div class="relative max-w-sm">
        <lucide-icon [name]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"></lucide-icon>
        <input [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Search by feedback..."
          class="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
      </div>

      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div *ngIf="loading" class="flex items-center justify-center py-16 text-muted-foreground gap-3">
          <div class="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
        <div *ngIf="!loading">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th class="px-6 py-4">Internship</th>
                  <th class="px-6 py-4">Score</th>
                  <th class="px-6 py-4">Grade</th>
                  <th class="px-6 py-4">Feedback</th>
                  <th class="px-6 py-4">Evaluated At</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr *ngFor="let e of paged()" class="hover:bg-muted/20 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium">#{{ e.internship.id }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-20 bg-muted rounded-full h-2">
                        <div class="h-2 rounded-full transition-all"
                          [style.width.%]="(e.score / 20) * 100"
                          [class]="e.score >= 14 ? 'bg-emerald-500' : e.score >= 10 ? 'bg-amber-400' : 'bg-rose-500'"></div>
                      </div>
                      <span class="font-semibold text-sm">{{ e.score }}/20</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="gradeClass(e.score)">{{ gradeLetter(e.score) }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{{ e.feedback || '—' }}</td>
                  <td class="px-6 py-4 text-sm text-muted-foreground">{{ e.evaluatedAt ? (e.evaluatedAt | date:'shortDate') : '—' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="edit(e)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                        <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="remove(e)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="filtered.length === 0" class="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <lucide-icon [name]="Star" [size]="40" class="opacity-30"></lucide-icon>
            <p class="font-medium">No evaluations found</p>
          </div>
          <div *ngIf="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <p class="text-sm text-muted-foreground">Showing {{ (page - 1) * size + 1 }}–{{ Math.min(page * size, filtered.length) }} of {{ filtered.length }}</p>
            <div class="flex items-center gap-1">
              <button (click)="goPage(page - 1)" [disabled]="page === 1" class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
                <lucide-icon [name]="ChevronLeft" [size]="16"></lucide-icon>
              </button>
              <button *ngFor="let p of pages()" (click)="goPage(p)"
                [class]="p === page ? 'w-8 h-8 rounded-lg bg-teal-600 text-white text-sm font-bold' : 'w-8 h-8 rounded-lg hover:bg-muted text-sm transition-colors'">{{ p }}</button>
              <button (click)="goPage(page + 1)" [disabled]="page === totalPages" class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
                <lucide-icon [name]="ChevronRight" [size]="16"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminEvaluationsComponent {
  private service = inject(EvaluationService);
  private fb = inject(FormBuilder);

  readonly Plus = Plus; readonly Edit2 = Edit2; readonly Trash2 = Trash2;
  readonly Search = Search; readonly ChevronLeft = ChevronLeft; readonly ChevronRight = ChevronRight;
  readonly Star = Star; readonly Math = Math;

  all: InternshipEvaluation[] = [];
  filtered: InternshipEvaluation[] = [];
  loading = false;
  editing = signal(false);
  editingItem?: InternshipEvaluation;
  searchQuery = ''; page = 1; size = 8;
  get totalPages() { return Math.ceil(this.filtered.length / this.size); }

  form = this.fb.group({
    internshipId: [null as number | null, [Validators.required, Validators.min(1)]],
    score: [0, [Validators.required, Validators.min(0), Validators.max(20)]],
    feedback: ['', Validators.maxLength(1000)]
  });

  constructor() { this.load(); }

  load() {
    this.loading = true;
    this.service.list().subscribe({ next: (d: any) => { this.all = Array.isArray(d) ? d : (d?.content ?? []); this.applyFilter(); this.loading = false; }, error: () => { this.loading = false; } });
  }

  applyFilter() {
    this.page = 1;
    const q = this.searchQuery.toLowerCase().trim();
    this.filtered = q ? this.all.filter(e => e.feedback?.toLowerCase().includes(q)) : [...this.all];
  }

  paged() { const s = (this.page - 1) * this.size; return this.filtered.slice(s, s + this.size); }
  pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  goPage(p: number) { if (p < 1 || p > this.totalPages) return; this.page = p; }

  gradeLetter(score: number): string {
    if (score >= 18) return 'A+'; if (score >= 16) return 'A'; if (score >= 14) return 'B';
    if (score >= 12) return 'C'; if (score >= 10) return 'D'; return 'F';
  }
  gradeClass(score: number): string {
    const base = 'inline-flex w-8 h-8 items-center justify-center rounded-full text-xs font-bold ';
    if (score >= 14) return base + 'bg-emerald-100 text-emerald-700';
    if (score >= 10) return base + 'bg-amber-100 text-amber-700';
    return base + 'bg-rose-100 text-rose-600';
  }

  startNew() { this.editingItem = undefined; this.form.reset({ score: 0, feedback: '' }); this.editing.set(true); }
  edit(e: InternshipEvaluation) {
    this.editingItem = e;
    this.form.patchValue({ internshipId: e.internship.id, score: e.score, feedback: e.feedback ?? '' });
    this.editing.set(true);
  }
  cancel() { this.editing.set(false); this.editingItem = undefined; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto: InternshipEvaluationRequest = this.form.value as unknown as InternshipEvaluationRequest;
    const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }
  remove(e: InternshipEvaluation) { if (!confirm('Delete this evaluation?')) return; this.service.delete(e.id).subscribe(() => this.load()); }

  fldClass(name: string) {
    const base = 'block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition-colors';
    const c = this.form.get(name);
    return (c?.invalid && (c.dirty || c.touched)) ? `${base} border-rose-400 focus:ring-rose-300 bg-rose-50` : `${base} border-border focus:ring-teal-400`;
  }
  isInvalid(n: string) { const c = this.form.get(n); return !!(c?.invalid && (c.dirty || c.touched)); }
  getError(n: string) {
    const c = this.form.get(n); if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['min']) return `Value must be at least ${c.errors['min'].min}`;
    if (c.errors['max']) return `Value must not exceed ${c.errors['max'].max}`;
    if (c.errors['maxlength']) return `Maximum ${c.errors['maxlength'].requiredLength} characters`;
    return 'Invalid value';
  }
}

