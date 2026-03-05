import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../api/services/event.service';
import { Event, EventRequest } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { timeRangeValidator } from '../../shared/validators/custom-validators';
import { Plus, Edit2, Trash2, Calendar, MapPin, Clock } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-events',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Events</span></h1>
          <p class="text-muted-foreground">Create, edit, or remove events.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add New Event
        </button>
      </div>

      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Title *</label>
              <input formControlName="title" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('title')" class="text-rose-600 text-sm mt-1">{{ getError('title') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Description</label>
              <textarea formControlName="description" class="mt-1 block w-full rounded-lg border border-border px-3 py-2"></textarea>
              <div *ngIf="isInvalid('description')" class="text-rose-600 text-sm mt-1">{{ getError('description') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Start Time *</label>
              <input type="datetime-local" formControlName="startTime" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('startTime')" class="text-rose-600 text-sm mt-1">This field is required</div>
            </div>
            <div>
              <label class="block text-sm font-medium">End Time *</label>
              <input type="datetime-local" formControlName="endTime" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('endTime')" class="text-rose-600 text-sm mt-1">This field is required</div>
            </div>
            <div *ngIf="form.errors?.['timeRangeInvalid'] && form.get('startTime')?.touched && form.get('endTime')?.touched" class="md:col-span-2 text-rose-600 text-sm p-2 bg-rose-50 rounded-lg">
              Start time must be before end time
            </div>
            <div>
              <label class="block text-sm font-medium">Location</label>
              <input formControlName="location" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('location')" class="text-rose-600 text-sm mt-1">{{ getError('location') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Status</label>
              <input formControlName="status" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('status')" class="text-rose-600 text-sm mt-1">{{ getError('status') }}</div>
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
                <th class="px-6 py-4">Title</th>
                <th class="px-6 py-4">Start</th>
                <th class="px-6 py-4">End</th>
                <th class="px-6 py-4">Location</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let e of events" class="hover:bg-muted/20 transition-colors group">
                <td class="px-6 py-5">{{ e.title }}</td>
                <td class="px-6 py-5">{{ e.startTime }}</td>
                <td class="px-6 py-5">{{ e.endTime }}</td>
                <td class="px-6 py-5">{{ e.location }}</td>
                <td class="px-6 py-5 text-right">
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
      </div>
    </div>
  `
})
export class AdminEventsComponent {
    private service = inject(EventService);
    private fb = inject(FormBuilder);

    readonly Plus = Plus;
    readonly Edit2 = Edit2;
    readonly Trash2 = Trash2;

    events: Event[] = [];
    editing = signal(false);
    editingItem?: Event;
    form = this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
        description: ['', Validators.maxLength(500)],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        location: ['', Validators.maxLength(100)],
        status: ['', Validators.maxLength(50)]
      },
      { validators: timeRangeValidator }
    );

    constructor() { this.load(); }
    load() { this.service.list().subscribe(d => this.events = d); }
    startNew() { this.editingItem = undefined; this.form.reset(); this.editing.set(true); }
    edit(e: Event) { this.editingItem = e; this.form.patchValue(e as any); this.editing.set(true); }
    cancel() { this.editing.set(false); this.editingItem = undefined; }
    save() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const dto: EventRequest = this.form.value as unknown as EventRequest;
      const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
      obs.subscribe(() => { this.load(); this.cancel(); });
    }
    remove(e: Event) { if(!confirm('Delete event?')) return; this.service.delete(e.id).subscribe(() => this.load()); }

    isInvalid(controlName: string): boolean {
      return !!(this.form.get(controlName)?.invalid && (this.form.get(controlName)?.dirty || this.form.get(controlName)?.touched));
    }

    getError(controlName: string): string {
      const control = this.form.get(controlName);
      if (!control?.errors) return '';
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
      return 'Invalid value';
    }
}
