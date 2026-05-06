import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService, Student, AdminStudentFormData } from '../../services/data.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Students</span></h1>
          <p class="text-muted-foreground">Manage learners accounts registered in the platform.</p>
        </div>
        <button (click)="onCreateStudent()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95">
          + Add Student
        </button>
      </div>

      <!-- Search -->
      <div class="flex justify-end">
        <input
          [(ngModel)]="searchTerm"
          (ngModelChange)="currentPage = 1"
          type="text"
          placeholder="Search students..."
          class="w-full md:w-72 px-3 py-2 rounded-xl border border-border text-sm"
        />
      </div>

      <div *ngIf="formVisible" class="bg-white border border-border rounded-3xl shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold">
            {{ formMode === 'create' ? 'Create new student' : 'Edit student' }}
          </h2>
          <button type="button" class="text-sm text-muted-foreground hover:text-foreground" (click)="closeForm()">
            Close
          </button>
        </div>
        <form (ngSubmit)="submitForm(studentForm)" #studentForm="ngForm" class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Name</label>
            <input
              [(ngModel)]="formData.name"
              name="name"
              required
              minlength="3"
              #nameCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
            <p *ngIf="submitted && nameCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              Le nom est obligatoire (min. 3 caractères).
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Email</label>
            <input
              [(ngModel)]="formData.email"
              name="email"
              type="email"
              required
              email
              #emailCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
            <p *ngIf="submitted && emailCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              Un email valide est obligatoire.
            </p>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded-xl border border-border text-sm font-medium" (click)="closeForm()">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold">
              {{ formMode === 'create' ? 'Save student' : 'Update student' }}
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let student of pagedStudents()" class="hover:bg-muted/20 transition-colors">
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ student.id }}</td>
                <td class="px-6 py-4 text-sm font-medium">{{ student.name }}</td>
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ student.email }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button class="px-3 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                            (click)="onEditStudent(student)">Edit</button>
                    <button class="px-3 py-1 rounded-lg border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50"
                            (click)="onDeleteStudent(student)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <span>Page {{ currentPage }} / {{ totalPages }}</span>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 rounded-lg border border-border disabled:opacity-50"
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 1"
            >
              Prev
            </button>
            <button
              class="px-3 py-1 rounded-lg border border-border disabled:opacity-50"
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminStudentsComponent {
  data = inject(DataService);

  formVisible = false;
  formMode: 'create' | 'edit' = 'create';
  editingId: number | string | null = null;
  formData: AdminStudentFormData = {
    name: '',
    email: ''
  };

  submitted = false;

  searchTerm = '';
  currentPage = 1;
  pageSize = 5;

  onCreateStudent() {
    this.formMode = 'create';
    this.editingId = null;
    this.formData = { name: '', email: '' };
    this.formVisible = true;
  }

  onEditStudent(student: Student) {
    this.formMode = 'edit';
    this.editingId = student.id ?? null;
    this.formData = {
      name: student.name,
      email: student.email
    };
    this.formVisible = true;
  }

  onDeleteStudent(student: Student) {
    if (!student.id) return;
    const confirmDelete = confirm(`Supprimer l étudiant « ${student.name} » ?`);
    if (!confirmDelete) return;
    this.data.deleteStudent(student.id);
  }

  submitForm(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
    if (this.formMode === 'create') {
      this.data.createStudent(this.formData);
    } else if (this.editingId != null) {
      this.data.updateStudent(this.editingId, this.formData);
    }
    this.formVisible = false;
    this.submitted = false;
  }

  closeForm() {
    this.formVisible = false;
    this.submitted = false;
  }

  private filteredStudents(): Student[] {
    const term = this.searchTerm.trim().toLowerCase();
    const list = this.data.students();
    if (!term) return list;
    return list.filter(s =>
      (s.name ?? '').toLowerCase().includes(term) ||
      (s.email ?? '').toLowerCase().includes(term)
    );
  }

  get totalPages(): number {
    const total = this.filteredStudents().length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  pagedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents().slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}

