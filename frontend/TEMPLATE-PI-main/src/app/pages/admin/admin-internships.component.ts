import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternshipService } from '../../api/services/internship.service';
import { Internship, InternshipRequest, InternshipStatus } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { dateRangeValidator } from '../../shared/validators/custom-validators';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, ChevronsUpDown, ClipboardList } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-internships',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
    template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Internships</span></h1>
          <p class="text-muted-foreground">Create, edit, or remove internships.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add New Internship
        </button>
      </div>

      <!-- Form -->
      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-teal-200 shadow-md">
        <h2 class="text-lg font-bold mb-4">{{ editingItem ? 'Edit Internship' : 'New Internship' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Start Date <span class="text-rose-500">*</span></label>
              <input type="date" formControlName="startDate" [class]="fldClass('startDate')" />
              <div *ngIf="isInvalid('startDate')" class="text-rose-600 text-xs mt-1">⚠ This field is required</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">End Date <span class="text-rose-500">*</span></label>
              <input type="date" formControlName="endDate" [class]="fldClass('endDate')" />
              <div *ngIf="isInvalid('endDate')" class="text-rose-600 text-xs mt-1">⚠ This field is required</div>
            </div>
            <div *ngIf="form.errors?.['dateRangeInvalid'] && form.get('startDate')?.touched && form.get('endDate')?.touched"
              class="md:col-span-2 text-rose-600 text-xs p-2 bg-rose-50 rounded-lg border border-rose-200">
              ⚠ Start date must be before end date
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Tutor Name</label>
              <input formControlName="tutorName" placeholder="e.g. Dr. Ahmed Ben Ali" [class]="fldClass('tutorName')" />
              <div *ngIf="isInvalid('tutorName')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('tutorName') }}</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Status <span class="text-rose-500">*</span></label>
              <select formControlName="status" class="block w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="FINISHED">FINISHED</option>
                <option value="VALIDATED">VALIDATED</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1">Objectives</label>
              <textarea formControlName="objectives" rows="3" placeholder="Describe internship objectives..."
                class="block w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"></textarea>
              <div class="flex justify-between mt-1">
                <div *ngIf="isInvalid('objectives')" class="text-rose-600 text-xs">⚠ Maximum 500 characters</div>
                <div class="text-xs text-muted-foreground ml-auto">{{ form.get('objectives')?.value?.length ?? 0 }}/500</div>
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

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <lucide-icon [name]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"></lucide-icon>
          <input [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Search by tutor name..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
        </div>
        <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()"
          class="px-3 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm">
          <option value="">All Statuses</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="FINISHED">FINISHED</option>
          <option value="VALIDATED">VALIDATED</option>
        </select>
      </div>

      <!-- Table -->
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
                  <th class="px-6 py-4">Start Date</th>
                  <th class="px-6 py-4">End Date</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Tutor</th>
                  <th class="px-6 py-4">Objectives</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr *ngFor="let i of paged()" class="hover:bg-muted/20 transition-colors">
                  <td class="px-6 py-4 text-sm">{{ i.startDate }}</td>
                  <td class="px-6 py-4 text-sm">{{ i.endDate }}</td>
                  <td class="px-6 py-4">
                    <span [class]="statusClass(i.status)">{{ i.status | titlecase }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm">{{ i.tutorName || '—' }}</td>
                  <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{{ i.objectives || '—' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="edit(i)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                        <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="remove(i)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="filtered.length === 0" class="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <lucide-icon [name]="ClipboardList" [size]="40" class="opacity-30"></lucide-icon>
            <p class="font-medium">No internships found</p>
          </div>
          <div *ngIf="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <p class="text-sm text-muted-foreground">
              Showing {{ (page - 1) * size + 1 }}–{{ Math.min(page * size, filtered.length) }} of {{ filtered.length }}
            </p>
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
export class AdminInternshipsComponent {
    private service = inject(InternshipService);
    private fb = inject(FormBuilder);

    readonly Plus = Plus; readonly Edit2 = Edit2; readonly Trash2 = Trash2;
    readonly Search = Search; readonly ChevronLeft = ChevronLeft; readonly ChevronRight = ChevronRight;
    readonly ClipboardList = ClipboardList; readonly Math = Math;

    all: Internship[] = [];
    filtered: Internship[] = [];
    loading = false;
    editing = signal(false);
    editingItem?: Internship;
    searchQuery = '';
    filterStatus = '';
    page = 1; size = 8;
    get totalPages() { return Math.ceil(this.filtered.length / this.size); }

    form = this.fb.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        objectives: ['', Validators.maxLength(500)],
        tutorName: ['', Validators.maxLength(100)],
        status: ['IN_PROGRESS', Validators.required]
      },
      { validators: dateRangeValidator }
    );

    constructor() { this.load(); }

    load() {
      this.loading = true;
      this.service.list().subscribe({ next: (d: any) => { this.all = Array.isArray(d) ? d : (d?.content ?? []); this.applyFilter(); this.loading = false; }, error: () => { this.loading = false; } });
    }

    applyFilter() {
      this.page = 1;
      let r = [...this.all];
      const q = this.searchQuery.toLowerCase().trim();
      if (q) r = r.filter(i => i.tutorName?.toLowerCase().includes(q));
      if (this.filterStatus) r = r.filter(i => i.status === this.filterStatus);
      this.filtered = r;
    }

    paged() { const s = (this.page - 1) * this.size; return this.filtered.slice(s, s + this.size); }
    pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
    goPage(p: number) { if (p < 1 || p > this.totalPages) return; this.page = p; }

    statusClass(s: string) {
      const base = 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ';
      if (s === 'IN_PROGRESS') return base + 'bg-blue-100 text-blue-700';
      if (s === 'FINISHED') return base + 'bg-amber-100 text-amber-700';
      return base + 'bg-emerald-100 text-emerald-700';
    }

    startNew() { this.editingItem = undefined; this.form.reset({ status: 'IN_PROGRESS' }); this.editing.set(true); }
    edit(i: Internship) { this.editingItem = i; this.form.patchValue(i as any); this.editing.set(true); }
    cancel() { this.editing.set(false); this.editingItem = undefined; }

    save() {
      if (this.form.invalid) { this.form.markAllAsTouched(); return; }
      const raw = this.form.getRawValue();
      const dto: InternshipRequest = {
        startDate: raw.startDate ?? '', endDate: raw.endDate ?? '',
        objectives: raw.objectives || undefined, status: (raw.status as InternshipStatus) ?? 'IN_PROGRESS',
        tutorName: raw.tutorName || undefined
      };
      const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
      obs.subscribe(() => { this.load(); this.cancel(); });
    }

    remove(i: Internship) { if (!confirm('Delete this internship?')) return; this.service.delete(i.id).subscribe(() => this.load()); }

    fldClass(name: string) {
      const base = 'block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition-colors';
      const c = this.form.get(name);
      return (c?.invalid && (c.dirty || c.touched)) ? `${base} border-rose-400 focus:ring-rose-300 bg-rose-50` : `${base} border-border focus:ring-teal-400`;
    }

    isInvalid(n: string) { const c = this.form.get(n); return !!(c?.invalid && (c.dirty || c.touched)); }
    getError(n: string) {
      const c = this.form.get(n); if (!c?.errors) return '';
      if (c.errors['maxlength']) return `Maximum ${c.errors['maxlength'].requiredLength} characters`;
      return 'Invalid value';
    }
}

