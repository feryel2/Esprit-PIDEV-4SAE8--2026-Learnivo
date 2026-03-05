import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { InternshipApplication } from '../../core/models/models';

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'New' }} Application</h2>
    <mat-dialog-content [formGroup]="form" class="dialog-form">
      <mat-form-field appearance="outline">
        <mat-label>Internship ID</mat-label>
        <input matInput type="number" formControlName="internshipId" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Student Name</mat-label>
        <input matInput formControlName="studentName" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Student Email</mat-label>
        <input matInput type="email" formControlName="studentEmail" />
        <mat-error>Valid email required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" *ngIf="data">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option value="PENDING">Pending</mat-option>
          <mat-option value="APPROVED">Approved</mat-option>
          <mat-option value="REJECTED">Rejected</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Cover Letter</mat-label>
        <textarea matInput formControlName="coverLetter" rows="4"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form{display:flex;flex-direction:column;gap:4px;min-width:420px;padding-top:12px;}mat-form-field{width:100%;}`]
})
export class ApplicationDialogComponent {
  form: FormGroup;
  constructor(
    public ref: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InternshipApplication | null,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      internshipId : [data?.internshipId ?? '', Validators.required],
      studentName  : [data?.studentName  ?? '', Validators.required],
      studentEmail : [data?.studentEmail ?? '', [Validators.required, Validators.email]],
      status       : [data?.status       ?? 'PENDING'],
      coverLetter  : [data?.coverLetter  ?? '']
    });
  }
  save() { if (this.form.valid) this.ref.close(this.form.value); }
}
