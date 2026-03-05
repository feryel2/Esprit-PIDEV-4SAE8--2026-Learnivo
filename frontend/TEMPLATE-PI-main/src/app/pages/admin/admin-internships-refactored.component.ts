import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternshipService } from '../../api/services/internship.service';
import { Internship, InternshipRequest, InternshipStatus } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateRangeValidator } from '../../shared/validators/custom-validators';
import { ValidationService } from '../../shared/services/validation.service';
import { FormErrorComponent } from '../../shared/components/form-error.component';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Filter,
    Download,
    ExternalLink
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Refactored admin-internships component demonstrating enterprise validation pattern
 * 
 * Key changes from original:
 * 1. Injected ValidationService for centralized error handling
 * 2. Removed local isInvalid() and getError() methods (replaced by ValidationService)
 * 3. Imported FormErrorComponent as standalone component
 * 4. Replaced inline error <div> blocks with <app-form-error> components
 * 5. Used validationService.getFieldClasses() for dynamic input styling
 * 6. Updated save() to use validationService.markAllAsTouched()
 * 7. Added scrollToFirstInvalid() for UX enhancement
 */
@Component({
    selector: 'app-admin-internships',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        ReactiveFormsModule,
        FormErrorComponent  // New: standalone error component
    ],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

      <!-- Form Section -->
      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Date Field -->
            <div>
              <label class="block text-sm font-medium">Start Date *</label>
              <input 
                type="date" 
                formControlName="startDate" 
                [ngClass]="validationService.getFieldClasses(form.get('startDate')!)"
                class="mt-1 block w-full rounded-lg px-3 py-2"
              />
              <!-- Centralized error rendering via FormErrorComponent -->
              <app-form-error 
                [control]="form.get('startDate')!" 
                [fieldName]="'Start date'"
              ></app-form-error>
            </div>

            <!-- End Date Field -->
            <div>
              <label class="block text-sm font-medium">End Date *</label>
              <input 
                type="date" 
                formControlName="endDate" 
                [ngClass]="validationService.getFieldClasses(form.get('endDate')!)"
                class="mt-1 block w-full rounded-lg px-3 py-2"
              />
              <!-- Centralized error rendering via FormErrorComponent -->
              <app-form-error 
                [control]="form.get('endDate')!" 
                [fieldName]="'End date'"
              ></app-form-error>
            </div>

            <!-- Cross-field error (dateRangeValidator) -->
            <div *ngIf="validationService.shouldShowError(form) && form.errors?.['dateRangeInvalid']" 
              class="md:col-span-2 text-rose-600 text-sm p-2 bg-rose-50 rounded-lg border border-rose-200"
            >
              Start date must be before end date
            </div>

            <!-- Objectives Field -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium">Objectives</label>
              <textarea 
                formControlName="objectives" 
                [ngClass]="validationService.getFieldClasses(form.get('objectives')!)"
                class="mt-1 block w-full rounded-lg px-3 py-2"
              ></textarea>
              <app-form-error 
                [control]="form.get('objectives')!" 
                [fieldName]="'Objectives'"
              ></app-form-error>
            </div>

            <!-- Tutor Name Field -->
            <div>
              <label class="block text-sm font-medium">Tutor Name</label>
              <input 
                formControlName="tutorName" 
                [ngClass]="validationService.getFieldClasses(form.get('tutorName')!)"
                class="mt-1 block w-full rounded-lg px-3 py-2"
              />
              <app-form-error 
                [control]="form.get('tutorName')!" 
                [fieldName]="'Tutor name'"
              ></app-form-error>
            </div>

            <!-- Status Field -->
            <div>
              <label class="block text-sm font-medium">Status *</label>
              <select 
                formControlName="status" 
                [ngClass]="validationService.getFieldClasses(form.get('status')!)"
                class="mt-1 block w-full rounded-lg px-3 py-2"
              >
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="FINISHED">FINISHED</option>
                <option value="VALIDATED">VALIDATED</option>
              </select>
              <app-form-error 
                [control]="form.get('status')!" 
                [fieldName]="'Status'"
              ></app-form-error>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-border">
            <button 
              type="submit" 
              [disabled]="form.invalid" 
              class="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg disabled:cursor-not-allowed transition-colors font-medium"
            >
              Save
            </button>
            <button 
              type="button" 
              (click)="cancel()" 
              class="px-4 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th class="px-6 py-4">Start</th>
                <th class="px-6 py-4">End</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Tutor</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let i of internships" class="hover:bg-muted/20 transition-colors group">
                <td class="px-6 py-5">{{ i.startDate }}</td>
                <td class="px-6 py-5">{{ i.endDate }}</td>
                <td class="px-6 py-5">{{ i.status }}</td>
                <td class="px-6 py-5">{{ i.tutorName }}</td>
                <td class="px-6 py-5 text-right">
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
      </div>
    </div>
  `
})
export class AdminInternshipsComponent {
    private service = inject(InternshipService);
    private fb = inject(FormBuilder);
    
    // New: Inject centralized validation service
    readonly validationService = inject(ValidationService);

    readonly Plus = Plus;
    readonly Edit2 = Edit2;
    readonly Trash2 = Trash2;

    internships: Internship[] = [];
    editing = signal(false);
    editingItem?: Internship;
    
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

    constructor() {
        this.load();
    }

    /**
     * Load internships from service
     */
    load() {
        this.service.list().subscribe(data => this.internships = data);
    }

    /**
     * Start creating a new internship
     */
    startNew() {
        this.editingItem = undefined;
        this.form.reset({ status: 'IN_PROGRESS' });
        this.editing.set(true);
    }

    /**
     * Edit existing internship
     */
    edit(i: Internship) {
        this.editingItem = i;
        this.form.patchValue(i as any);
        this.editing.set(true);
    }

    /**
     * Cancel editing
     */
    cancel() {
        this.editing.set(false);
        this.editingItem = undefined;
        // REFACTOR: Use centralized resetForm instead of manual reset
        this.validationService.resetForm(this.form);
    }

    /**
     * Save internship (create or update)
     * REFACTORED: Uses ValidationService.markAllAsTouched() for centralized validation
     */
    save() {
        // REFACTOR: Use centralized validation service instead of form.markAllAsTouched()
        if (this.form.invalid) {
            this.validationService.markAllAsTouched(this.form);
            // NEW: Auto-scroll to first invalid field with animation
            this.validationService.scrollToFirstInvalid(this.form);
            return;
        }

        const raw = this.form.getRawValue();
        const dto: InternshipRequest = {
            startDate: raw.startDate ?? '',
            endDate: raw.endDate ?? '',
            objectives: raw.objectives ?? undefined,
            status: (raw.status as InternshipStatus) ?? 'IN_PROGRESS',
            tutorName: raw.tutorName ?? undefined
        };

        const obs = this.editingItem
            ? this.service.update(this.editingItem.id, dto)
            : this.service.create(dto);

        obs.subscribe(() => {
            this.load();
            this.cancel();
        });
    }

    /**
     * Remove internship with confirmation
     */
    remove(i: Internship) {
        if (!confirm('Delete this internship?')) return;
        this.service.delete(i.id).subscribe(() => this.load());
    }

    /**
     * REMOVED: Local isInvalid() method (replaced by validationService.shouldShowError())
     * Benefits:
     * - Single source of truth for error display logic
     * - Consistent behavior across all forms
     * - Easier to update error display rules globally
     */

    /**
     * REMOVED: Local getError() method (replaced by FormErrorComponent)
     * Benefits:
     * - Error messages defined by ValidationService.getControlError()
     * - Animated error display via FormErrorComponent
     * - 14 error types supported (required, minlength, maxlength, email, pattern, min, max, etc.)
     * - Reusable across all forms without duplication
     */
}
