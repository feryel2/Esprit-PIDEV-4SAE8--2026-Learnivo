import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationRuleService } from '../../api/services/certification-rule.service';
import { CertificationRule, CertificationRuleRequest, CertificateType } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plus, Edit2, Trash2 } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-certification-rules',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Certification Rules</span></h1>
          <p class="text-muted-foreground">Rules for issuing certificates.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add New Rule
        </button>
      </div>

      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Name *</label>
              <input formControlName="name" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('name')" class="text-rose-600 text-sm mt-1">{{ getError('name') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Certificate Type *</label>
              <select formControlName="certificateType" class="mt-1 block w-full rounded-lg border border-border px-3 py-2">
                <option [value]="'LEVEL'">LEVEL</option>
                <option [value]="'PARTICIPATION'">PARTICIPATION</option>
                <option [value]="'INTERNSHIP'">INTERNSHIP</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Min Score</label>
              <input type="number" formControlName="minScore" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('minScore')" class="text-rose-600 text-sm mt-1">{{ getError('minScore') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Min Attendance Rate (%)</label>
              <input type="number" formControlName="minAttendanceRate" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('minAttendanceRate')" class="text-rose-600 text-sm mt-1">{{ getError('minAttendanceRate') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Min Hours</label>
              <input type="number" formControlName="minHours" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('minHours')" class="text-rose-600 text-sm mt-1">{{ getError('minHours') }}</div>
            </div>
            <div class="flex items-center">
              <label class="mr-2">Active</label>
              <input type="checkbox" formControlName="active" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="submit" [disabled]="form.invalid" class="bg-teal-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            <button type="button" (click)="cancel()" class="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th class="px-6 py-4">Name</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Active</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let r of rules" class="hover:bg-muted/20 transition-colors group">
                <td class="px-6 py-5">{{ r.name }}</td>
                <td class="px-6 py-5">{{ r.certificateType }}</td>
                <td class="px-6 py-5">{{ r.active ? 'Yes' : 'No' }}</td>
                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="edit(r)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                      <lucide-icon [name]="Edit2" [size]="16"></lucide-icon>
                    </button>
                    <button (click)="remove(r)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
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
export class AdminCertificationRulesComponent {
  private service = inject(CertificationRuleService);
  private fb = inject(FormBuilder);

  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;

  rules: CertificationRule[] = [];
  editing = signal(false);
  editingItem?: CertificationRule;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    certificateType: ['LEVEL' as CertificateType, Validators.required],
    minScore: [0, [Validators.min(0), Validators.max(20)]],
    minAttendanceRate: [0, [Validators.min(0), Validators.max(100)]],
    minHours: [0, Validators.min(0)],
    active: [false]
  });

  constructor() { this.load(); }
  load() { this.service.list().subscribe(d => this.rules = d); }
  startNew() { this.editingItem = undefined; this.form.reset({ certificateType: 'LEVEL', active: false }); this.editing.set(true); }
  edit(r: CertificationRule) { this.editingItem = r; this.form.patchValue(r as any); this.editing.set(true); }
  cancel() { this.editing.set(false); this.editingItem = undefined; }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: CertificationRuleRequest = this.form.value as unknown as CertificationRuleRequest;
    const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }
  remove(r: CertificationRule) { if(!confirm('Delete rule?')) return; this.service.delete(r.id).subscribe(() => this.load()); }

  isInvalid(controlName: string): boolean {
    return !!(this.form.get(controlName)?.invalid && (this.form.get(controlName)?.dirty || this.form.get(controlName)?.touched));
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['min']) return `Value must be at least ${control.errors['min'].min}`;
    if (control.errors['max']) return `Value must not exceed ${control.errors['max'].max}`;
    return 'Invalid value';
  }
}
