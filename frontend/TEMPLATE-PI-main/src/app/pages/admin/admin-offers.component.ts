import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../api/services/offer.service';
import { InternshipOffer, InternshipOfferRequest, InternshipOfferStatus } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Download,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    CheckCircle,
    XCircle,
    BarChart2
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-offers',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
    template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Offers</span></h1>
          <p class="text-muted-foreground">Create, edit, or remove internship offers.</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="exportCsv()" title="Export CSV"
            class="border border-border px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-muted/40 transition-all text-sm">
            <lucide-icon [name]="Download" [size]="16"></lucide-icon> Export CSV
          </button>
          <button (click)="startNew()"
            class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
            <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
            Add New Offer
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-teal-50 rounded-xl"><lucide-icon [name]="Briefcase" [size]="22" class="text-teal-600"></lucide-icon></div>
          <div><p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</p><p class="text-2xl font-bold">{{ allOffers.length }}</p></div>
        </div>
        <div class="bg-white rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-emerald-50 rounded-xl"><lucide-icon [name]="CheckCircle" [size]="22" class="text-emerald-600"></lucide-icon></div>
          <div><p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Open</p><p class="text-2xl font-bold text-emerald-600">{{ openCount }}</p></div>
        </div>
        <div class="bg-white rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-rose-50 rounded-xl"><lucide-icon [name]="XCircle" [size]="22" class="text-rose-500"></lucide-icon></div>
          <div><p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Closed</p><p class="text-2xl font-bold text-rose-500">{{ closedCount }}</p></div>
        </div>
      </div>

      <!-- Form -->
      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-teal-200 shadow-md">
        <h2 class="text-lg font-bold mb-4">{{ editingItem ? 'Edit Offer' : 'New Offer' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Title <span class="text-rose-500">*</span></label>
              <input formControlName="title" placeholder="e.g. Frontend Developer Intern"
                [class]="fieldClass('title')" />
              <div *ngIf="isInvalid('title')" class="text-rose-600 text-xs mt-1 flex items-center gap-1">⚠ {{ getError('title') }}</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Company <span class="text-rose-500">*</span></label>
              <input formControlName="company" placeholder="e.g. Google"
                [class]="fieldClass('company')" />
              <div *ngIf="isInvalid('company')" class="text-rose-600 text-xs mt-1 flex items-center gap-1">⚠ {{ getError('company') }}</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Location</label>
              <input formControlName="location" placeholder="e.g. Tunis, Tunisia"
                [class]="fieldClass('location')" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Deadline <span class="text-rose-500">*</span></label>
              <input type="date" formControlName="deadline" [class]="fieldClass('deadline')" />
              <div *ngIf="isInvalid('deadline')" class="text-rose-600 text-xs mt-1 flex items-center gap-1">⚠ This field is required</div>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Status <span class="text-rose-500">*</span></label>
              <select formControlName="status" class="mt-0 block w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1">Description</label>
              <textarea formControlName="description" rows="3" placeholder="Describe the internship opportunity..."
                class="block w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"></textarea>
              <div *ngIf="isInvalid('description')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('description') }}</div>
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

      <!-- Search & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <lucide-icon [name]="Search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"></lucide-icon>
          <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" placeholder="Search by title or company..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
        </div>
        <select [(ngModel)]="filterStatus" (ngModelChange)="onSearch()"
          class="px-3 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm">
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <!-- Loading -->
        <div *ngIf="loading" class="flex items-center justify-center py-16 text-muted-foreground gap-3">
          <div class="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          Loading offers...
        </div>

        <div *ngIf="!loading">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th class="px-6 py-4 cursor-pointer select-none hover:text-foreground transition-colors" (click)="sort('title')">
                    <div class="flex items-center gap-1">Title <lucide-icon [name]="getSortIcon('title')" [size]="14"></lucide-icon></div>
                  </th>
                  <th class="px-6 py-4 cursor-pointer select-none hover:text-foreground transition-colors" (click)="sort('company')">
                    <div class="flex items-center gap-1">Company <lucide-icon [name]="getSortIcon('company')" [size]="14"></lucide-icon></div>
                  </th>
                  <th class="px-6 py-4">Location</th>
                  <th class="px-6 py-4 cursor-pointer select-none hover:text-foreground transition-colors" (click)="sort('deadline')">
                    <div class="flex items-center gap-1">Deadline <lucide-icon [name]="getSortIcon('deadline')" [size]="14"></lucide-icon></div>
                  </th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr *ngFor="let o of pagedOffers()" class="hover:bg-muted/20 transition-colors group">
                  <td class="px-6 py-4 font-medium">{{ o.title }}</td>
                  <td class="px-6 py-4">{{ o.company }}</td>
                  <td class="px-6 py-4 text-muted-foreground text-sm">{{ o.location || '—' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span [class]="isExpired(o.deadline) ? 'text-rose-500 font-medium' : ''">{{ o.deadline }}</span>
                    <span *ngIf="isExpired(o.deadline)" class="ml-1 text-xs text-rose-400">(expired)</span>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="o.status === 'OPEN'
                      ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700'
                      : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-600'">
                      {{ o.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="edit(o)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                        <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="remove(o)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="filteredOffers.length === 0" class="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <lucide-icon [name]="Briefcase" [size]="40" class="opacity-30"></lucide-icon>
            <p class="font-medium">No offers found</p>
            <p class="text-sm">{{ searchQuery || filterStatus ? 'Try adjusting your search or filter.' : 'Click "Add New Offer" to get started.' }}</p>
          </div>

          <!-- Pagination -->
          <div *ngIf="totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <p class="text-sm text-muted-foreground">
              Showing {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filteredOffers.length) }} of {{ filteredOffers.length }}
            </p>
            <div class="flex items-center gap-1">
              <button (click)="goPage(currentPage - 1)" [disabled]="currentPage === 1"
                class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <lucide-icon [name]="ChevronLeft" [size]="16"></lucide-icon>
              </button>
              <button *ngFor="let p of pageNumbers()" (click)="goPage(p)"
                [class]="p === currentPage
                  ? 'w-8 h-8 rounded-lg bg-teal-600 text-white text-sm font-bold'
                  : 'w-8 h-8 rounded-lg hover:bg-muted text-sm transition-colors'">
                {{ p }}
              </button>
              <button (click)="goPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                class="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <lucide-icon [name]="ChevronRight" [size]="16"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminOffersComponent {
    private service = inject(OfferService);
    private fb = inject(FormBuilder);

    readonly Plus = Plus; readonly Edit2 = Edit2; readonly Trash2 = Trash2;
    readonly Download = Download; readonly Search = Search; readonly Briefcase = Briefcase;
    readonly CheckCircle = CheckCircle; readonly XCircle = XCircle; readonly BarChart2 = BarChart2;
    readonly ChevronLeft = ChevronLeft; readonly ChevronRight = ChevronRight;
    readonly ChevronUp = ChevronUp; readonly ChevronDown = ChevronDown; readonly ChevronsUpDown = ChevronsUpDown;
    readonly Math = Math;

    allOffers: InternshipOffer[] = [];
    filteredOffers: InternshipOffer[] = [];
    loading = false;
    editing = signal(false);
    editingItem?: InternshipOffer;

    // Search & filter
    searchQuery = '';
    filterStatus = '';

    // Sort
    sortField: keyof InternshipOffer | '' = '';
    sortDir: 'asc' | 'desc' = 'asc';

    // Pagination
    currentPage = 1;
    pageSize = 8;
    get totalPages() { return Math.ceil(this.filteredOffers.length / this.pageSize); }
    get openCount() { return this.allOffers.filter(o => o.status === 'OPEN').length; }
    get closedCount() { return this.allOffers.filter(o => o.status === 'CLOSED').length; }

    form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      company: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      location: ['', Validators.maxLength(100)],
      deadline: ['', Validators.required],
      status: ['OPEN', Validators.required],
      description: ['', Validators.maxLength(500)]
    });

    constructor() { this.load(); }

    load() {
      this.loading = true;
      this.service.list().subscribe({
        next: (data: any) => {
          // Handle both plain arrays and Spring Page objects { content: [...] }
          this.allOffers = Array.isArray(data) ? data : (data?.content ?? []);
          this.applyFilter();
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }

    onSearch() { this.currentPage = 1; this.applyFilter(); }

    applyFilter() {
      let result = [...this.allOffers];
      const q = this.searchQuery.toLowerCase().trim();
      if (q) result = result.filter(o =>
        o.title.toLowerCase().includes(q) || o.company.toLowerCase().includes(q));
      if (this.filterStatus) result = result.filter(o => o.status === this.filterStatus);
      if (this.sortField) {
        result.sort((a, b) => {
          const av = (a[this.sortField as keyof InternshipOffer] ?? '') as string;
          const bv = (b[this.sortField as keyof InternshipOffer] ?? '') as string;
          return this.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        });
      }
      this.filteredOffers = result;
    }

    sort(field: keyof InternshipOffer) {
      if (this.sortField === field) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      else { this.sortField = field; this.sortDir = 'asc'; }
      this.applyFilter();
    }

    getSortIcon(field: string) {
      if (this.sortField !== field) return this.ChevronsUpDown;
      return this.sortDir === 'asc' ? this.ChevronUp : this.ChevronDown;
    }

    pagedOffers(): InternshipOffer[] {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredOffers.slice(start, start + this.pageSize);
    }

    pageNumbers(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    goPage(p: number) {
      if (p < 1 || p > this.totalPages) return;
      this.currentPage = p;
    }

    isExpired(deadline: string): boolean {
      return !!deadline && new Date(deadline) < new Date();
    }

    startNew() {
      this.editingItem = undefined;
      this.form.reset({ status: 'OPEN' });
      this.editing.set(true);
    }

    edit(o: InternshipOffer) {
      this.editingItem = o;
      this.form.patchValue(o as any);
      this.editing.set(true);
    }

    cancel() { this.editing.set(false); this.editingItem = undefined; }

    save() {
      if (this.form.invalid) { this.form.markAllAsTouched(); return; }
      const raw = this.form.getRawValue();
      const dto: InternshipOfferRequest = {
        title: raw.title ?? '',
        company: raw.company ?? '',
        location: raw.location || undefined,
        deadline: raw.deadline ?? '',
        status: (raw.status as InternshipOfferStatus) ?? 'OPEN'
      };
      const obs = this.editingItem
        ? this.service.update(this.editingItem.id, dto)
        : this.service.create(dto);
      obs.subscribe(() => { this.load(); this.cancel(); });
    }

    remove(o: InternshipOffer) {
      if (!confirm(`Delete offer "${o.title}"?`)) return;
      this.service.delete(o.id).subscribe(() => this.load());
    }

    exportCsv() {
      const headers = ['ID', 'Title', 'Company', 'Location', 'Deadline', 'Status'];
      const rows = this.filteredOffers.map(o =>
        [o.id, `"${o.title}"`, `"${o.company}"`, o.location ?? '', o.deadline, o.status].join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'offers.csv'; a.click();
      URL.revokeObjectURL(url);
    }

    fieldClass(name: string): string {
      const base = 'block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition-colors';
      const ctrl = this.form.get(name);
      if (ctrl?.invalid && (ctrl.dirty || ctrl.touched))
        return `${base} border-rose-400 focus:ring-rose-300 bg-rose-50`;
      return `${base} border-border focus:ring-teal-400`;
    }

    isInvalid(controlName: string): boolean {
      const c = this.form.get(controlName);
      return !!(c?.invalid && (c.dirty || c.touched));
    }

    getError(controlName: string): string {
      const ctrl = this.form.get(controlName);
      if (!ctrl?.errors) return '';
      if (ctrl.errors['required']) return 'This field is required';
      if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters`;
      if (ctrl.errors['maxlength']) return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters`;
      return 'Invalid value';
    }
}
