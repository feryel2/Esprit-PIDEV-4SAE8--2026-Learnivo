import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Internship } from '../../core/models/models';

@Component({
  selector: 'app-internship-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'New' }} Internship</h2>
    <mat-dialog-content [formGroup]="form" class="dialog-form">
      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Company Name</mat-label>
        <input matInput formControlName="companyName" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Student Name</mat-label>
        <input matInput formControlName="studentName" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <div class="row-2">
        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput type="date" formControlName="startDate" />
          <mat-error>Required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput type="date" formControlName="endDate" />
          <mat-error>Required</mat-error>
        </mat-form-field>
      </div>
      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display:flex; flex-direction:column; gap:4px; min-width:420px; padding-top:12px; }
    .row-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    mat-form-field { width:100%; }
  `]
})
export class InternshipDialogComponent {
  form: FormGroup;
  constructor(public ref: MatDialogRef<InternshipDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Internship | null,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      title      : [data?.title       ?? '', Validators.required],
      companyName: [data?.companyName ?? '', Validators.required],
      studentName: [data?.studentName ?? '', Validators.required],
      startDate  : [data?.startDate   ?? '', Validators.required],
      endDate    : [data?.endDate     ?? '', Validators.required],
      description: [data?.description ?? '']
    });
  }
  save() { if (this.form.valid) this.ref.close(this.form.value); }
}
