import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../api/services/document.service';
import { InternshipDocument, InternshipDocumentRequest, InternshipDocumentType } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-documents',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Documents</span></h1>
          <p class="text-muted-foreground">Internship documents and files.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add Document
        </button>
      </div>

      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-teal-200 shadow-md">
        <h2 class="text-lg font-bold mb-4">{{ editingItem ? 'Edit Document' : 'New Document' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Type <span class="text-rose-500">*</span></label>
              <select formControlName="type" class="block w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="CONVENTION">CONVENTION</option>
                <option value="REPORT">REPORT</option>
                <option value="PRESENTATION">PRESENTATION</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">Internship ID <span class="text-rose-500">*</span></label>
              <input type="number" formControlName="internshipId" placeholder="e.g. 1" [class]="fldClass('internshipId')" />
              <div *ngIf="isInvalid('internshipId')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('internshipId') }}</div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1">URL <span class="text-rose-500">*</span></label>
              <input formControlName="url" placeholder="https://..." [class]="fldClass('url')" />
              <div *ngIf="isInvalid('url')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('url') }}</div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold mb-1">Comment</label>
              <input formControlName="comment" placeholder="Optional note..." [class]="fldClass('comment')" />
              <div *ngIf="isInvalid('comment')" class="text-rose-600 text-xs mt-1">⚠ {{ getError('comment') }}</div>
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" formControlName="validated" id="validated"
                class="w-4 h-4 rounded border-border text-teal-600 focus:ring-teal-400" />
              <label for="validated" class="text-sm font-medium cursor-pointer">Mark as Validated</label>
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
          <input [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Search by comment..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
        </div>
        <select [(ngModel)]="filterType" (ngModelChange)="applyFilter()"
          class="px-3 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm">
          <option value="">All Types</option>
          <option value="CONVENTION">CONVENTION</option>
          <option value="REPORT">REPORT</option>
          <option value="PRESENTATION">PRESENTATION</option>
        </select>
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
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Internship</th>
                  <th class="px-6 py-4">URL</th>
                  <th class="px-6 py-4">Comment</th>
                  <th class="px-6 py-4">Validated</th>
                  <th class="px-6 py-4">Uploaded</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr *ngFor="let d of paged()" class="hover:bg-muted/20 transition-colors">
                  <td class="px-6 py-4">
                    <span [class]="typeClass(d.type)">{{ d.type }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">#{{ d.internship.id }}</td>
                  <td class="px-6 py-4 text-sm">
                    <a [href]="d.url" target="_blank" class="text-teal-600 underline hover:text-teal-700 truncate block max-w-[140px]">View File</a>
                  </td>
                  <td class="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{{ d.comment || '—' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="d.validated ? 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700' : 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground'">
                      {{ d.validated ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-muted-foreground">{{ d.uploadedAt ? (d.uploadedAt | date:'shortDate') : '—' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="edit(d)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                        <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                      </button>
                      <button (click)="remove(d)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                        <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div *ngIf="filtered.length === 0" class="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <lucide-icon [name]="FileText" [size]="40" class="opacity-30"></lucide-icon>
            <p class="font-medium">No documents found</p>
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
export class AdminDocumentsComponent {
  private service = inject(DocumentService);
  private fb = inject(FormBuilder);

  readonly Plus = Plus; readonly Edit2 = Edit2; readonly Trash2 = Trash2;
  readonly Search = Search; readonly ChevronLeft = ChevronLeft; readonly ChevronRight = ChevronRight;
  readonly FileText = FileText; readonly Math = Math;

  all: InternshipDocument[] = [];
  filtered: InternshipDocument[] = [];
  loading = false;
  editing = signal(false);
  editingItem?: InternshipDocument;
  searchQuery = ''; filterType = '';
  page = 1; size = 8;
  get totalPages() { return Math.ceil(this.filtered.length / this.size); }

  form = this.fb.group({
    type: ['CONVENTION' as InternshipDocumentType, Validators.required],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    comment: ['', Validators.maxLength(500)],
    internshipId: [null as number | null, [Validators.required, Validators.min(1)]],
    validated: [false]
  });

  constructor() { this.load(); }

  load() {
    this.loading = true;
    this.service.list().subscribe({ next: (d: any) => { this.all = Array.isArray(d) ? d : (d?.content ?? []); this.applyFilter(); this.loading = false; }, error: () => { this.loading = false; } });
  }

  applyFilter() {
    this.page = 1;
    let r = [...this.all];
    const q = this.searchQuery.toLowerCase().trim();
    if (q) r = r.filter(d => d.comment?.toLowerCase().includes(q));
    if (this.filterType) r = r.filter(d => d.type === this.filterType);
    this.filtered = r;
  }

  paged() { const s = (this.page - 1) * this.size; return this.filtered.slice(s, s + this.size); }
  pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  goPage(p: number) { if (p < 1 || p > this.totalPages) return; this.page = p; }

  typeClass(type: string) {
    const base = 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ';
    if (type === 'CONVENTION') return base + 'bg-blue-100 text-blue-700';
    if (type === 'REPORT') return base + 'bg-purple-100 text-purple-700';
    return base + 'bg-amber-100 text-amber-700';
  }

  startNew() { this.editingItem = undefined; this.form.reset({ type: 'CONVENTION', validated: false }); this.editing.set(true); }
  edit(d: InternshipDocument) {
    this.editingItem = d;
    this.form.patchValue({ type: d.type, url: d.url, comment: d.comment, internshipId: d.internship.id, validated: !!d.validated });
    this.editing.set(true);
  }
  cancel() { this.editing.set(false); this.editingItem = undefined; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto: InternshipDocumentRequest = this.form.value as unknown as InternshipDocumentRequest;
    const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }
  remove(d: InternshipDocument) { if (!confirm('Delete this document?')) return; this.service.delete(d.id).subscribe(() => this.load()); }

  fldClass(name: string) {
    const base = 'block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 transition-colors';
    const c = this.form.get(name);
    return (c?.invalid && (c.dirty || c.touched)) ? `${base} border-rose-400 focus:ring-rose-300 bg-rose-50` : `${base} border-border focus:ring-teal-400`;
  }
  isInvalid(n: string) { const c = this.form.get(n); return !!(c?.invalid && (c.dirty || c.touched)); }
  getError(n: string) {
    const c = this.form.get(n); if (!c?.errors) return '';
    if (c.errors['required']) return 'This field is required';
    if (c.errors['pattern']) return 'URL must start with http:// or https://';
    if (c.errors['maxlength']) return `Maximum ${c.errors['maxlength'].requiredLength} characters`;
    if (c.errors['min']) return `Value must be at least ${c.errors['min'].min}`;
    return 'Invalid value';
  }
}
