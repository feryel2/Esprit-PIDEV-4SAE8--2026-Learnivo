import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService, Professor, AdminProfessorFormData } from '../../services/data.service';
import { LucideAngularModule, Plus, Search, X, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-admin-professors',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="animate-slide-up space-y-10">
      <!-- Header Section -->
      <div class="admin-page-header">
        <div class="header-info">
          <h1>Manage <span class="text-gradient">Professors</span></h1>
          <p>Supervise and organize instructors across all academic departments.</p>
        </div>
        <button (click)="onCreateProfessor()" class="btn-premium btn-premium-primary">
          <lucide-icon [name]="Plus" [size]="20"></lucide-icon>
          Add Professor
        </button>
      </div>

      <!-- Search & Filters Container -->
      <div class="flex flex-col md:flex-row gap-6 items-end justify-between">
         <div class="w-full md:w-96 relative">
            <lucide-icon [name]="Search" [size]="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></lucide-icon>
            <input
              [(ngModel)]="searchTerm"
              (ngModelChange)="currentPage = 1"
              type="text"
              placeholder="Search by name or email..."
              class="admin-input pl-12"
            />
         </div>
      </div>

      <!-- Form Card (Conditional) -->
      <div *ngIf="formVisible" class="admin-glass-card animate-slide-up">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-black text-slate-800">
            {{ formMode === 'create' ? 'Create New Professor' : 'Edit Professor Details' }}
          </h2>
          <button (click)="closeForm()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <lucide-icon [name]="X" [size]="20"></lucide-icon>
          </button>
        </div>
        
        <form (ngSubmit)="submitForm(profForm)" #profForm="ngForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Name</label>
            <input
              [(ngModel)]="formData.name"
              name="name"
              required
              minlength="3"
              #nameCtrl="ngModel"
              placeholder="e.g. Dr. Jane Smith"
              class="admin-input"
            />
            <p *ngIf="submitted && nameCtrl.invalid" class="text-[11px] font-bold text-rose-500 mt-1">
              Minimum 3 characters required.
            </p>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
            <input
              [(ngModel)]="formData.email"
              name="email"
              type="email"
              required
              email
              #emailCtrl="ngModel"
              placeholder="prof.name@learnivo.edu"
              class="admin-input"
            />
          </div>

          <div class="md:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" (click)="closeForm()" class="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
            <button type="submit" class="btn-premium btn-premium-primary px-10">
              {{ formMode === 'create' ? 'Create Professor' : 'Update Record' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Main Data Table -->
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Professor</th>
              <th>Contact Email</th>
              <th class="text-right">Management</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let professor of pagedProfessors()">
              <td><span class="font-mono text-xs font-bold opacity-40">#{{ professor.id }}</span></td>
              <td>
                <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-teal-600 text-xs">
                     {{ professor.name.charAt(0) }}
                   </div>
                   <span class="font-bold text-slate-700">{{ professor.name }}</span>
                </div>
              </td>
              <td><span class="text-slate-500 font-medium">{{ professor.email }}</span></td>
              <td>
                <div class="flex items-center justify-end gap-3">
                  <button (click)="onEditProfessor(professor)" class="p-2 hover:bg-teal-50 text-teal-600 rounded-xl transition-all">
                    <lucide-icon [name]="Edit2" [size]="18"></lucide-icon>
                  </button>
                  <button (click)="onDeleteProfessor(professor)" class="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all">
                    <lucide-icon [name]="Trash2" [size]="18"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Table Footer / Pagination -->
        <div class="bg-slate-50/50 p-6 flex items-center justify-between border-t border-slate-100">
           <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Reviewing {{ pagedProfessors().length }} of {{ data.professors().length }} experts
           </div>
           
           <div class="flex items-center gap-4">
             <span class="text-xs font-bold text-slate-500">PAGE {{ currentPage }} / {{ totalPages }}</span>
             <div class="flex gap-2">
                <button (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1" 
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 transition-all hover:border-teal-400">
                  <lucide-icon [name]="ChevronLeft" [size]="16"></lucide-icon>
                </button>
                <button (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 transition-all hover:border-teal-400">
                  <lucide-icon [name]="ChevronRight" [size]="16"></lucide-icon>
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProfessorsComponent {
  data = inject(DataService);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly X = X;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  formVisible = false;
  formMode: 'create' | 'edit' = 'create';
  editingId: number | string | null = null;
  formData: AdminProfessorFormData = {
    name: '',
    email: ''
  };

  submitted = false;

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  onCreateProfessor() {
    this.formMode = 'create';
    this.editingId = null;
    this.formData = { name: '', email: '' };
    this.formVisible = true;
  }

  onEditProfessor(professor: Professor) {
    this.formMode = 'edit';
    this.editingId = professor.id ?? null;
    this.formData = {
      name: professor.name,
      email: professor.email
    };
    this.formVisible = true;
  }

  onDeleteProfessor(professor: Professor) {
    if (!professor.id) return;
    const confirmDelete = confirm(`Supprimer le professeur « ${professor.name} » ?`);
    if (!confirmDelete) return;
    this.data.deleteProfessor(professor.id);
  }

  submitForm(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
    if (this.formMode === 'create') {
      this.data.createProfessor(this.formData);
    } else if (this.editingId != null) {
      this.data.updateProfessor(this.editingId, this.formData);
    }
    this.formVisible = false;
    this.submitted = false;
  }

  closeForm() {
    this.formVisible = false;
    this.submitted = false;
  }

  private filteredProfessors(): Professor[] {
    const term = this.searchTerm.trim().toLowerCase();
    const list = this.data.professors();
    if (!term) return list;
    return list.filter(p =>
      (p.name ?? '').toLowerCase().includes(term) ||
      (p.email ?? '').toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    const total = this.filteredProfessors().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  pagedProfessors(): Professor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProfessors().slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}

