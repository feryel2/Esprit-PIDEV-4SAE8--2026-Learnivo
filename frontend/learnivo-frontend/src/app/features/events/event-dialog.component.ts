import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppEvent } from '../../core/models/models';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'New' }} Event</h2>
    <mat-dialog-content [formGroup]="form" class="dialog-form">
      <mat-form-field appearance="outline"><mat-label>Title</mat-label>
        <input matInput formControlName="title"/><mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Date</mat-label>
        <input matInput type="datetime-local" formControlName="date"/><mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Location</mat-label>
        <input matInput formControlName="location"/>
      </mat-form-field>
      <mat-form-field appearance="outline"><mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form{display:flex;flex-direction:column;gap:4px;min-width:400px;padding-top:12px;}mat-form-field{width:100%;}`]
})
export class EventDialogComponent {
  form: FormGroup;
  constructor(
    public ref: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppEvent | null,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title      : [data?.title       ?? '', Validators.required],
      date       : [data?.date        ?? '', Validators.required],
      location   : [data?.location    ?? ''],
      description: [data?.description ?? '']
    });
  }
  save() { if (this.form.valid) this.ref.close(this.form.value); }
}
