import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Certificate } from '../../core/models/models';

@Component({
  selector: 'app-certificate-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,
            MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Issue' }} Certificate</h2>
    <mat-dialog-content [formGroup]="form" class="dialog-form">
      <mat-form-field appearance="outline">
        <mat-label>Student Name</mat-label>
        <input matInput formControlName="studentName" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Certificate Number</mat-label>
        <input matInput formControlName="certificateNumber" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Type</mat-label>
        <mat-select formControlName="type">
          <mat-option value="INTERNSHIP">Internship</mat-option>
          <mat-option value="TRAINING">Training</mat-option>
          <mat-option value="COMPLETION">Completion</mat-option>
        </mat-select>
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Issued At</mat-label>
        <input matInput type="date" formControlName="issuedAt" />
        <mat-error>Required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Internship ID (optional)</mat-label>
        <input matInput type="number" formControlName="internshipId" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="ref.close()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form{display:flex;flex-direction:column;gap:4px;min-width:420px;padding-top:12px;}mat-form-field{width:100%;}`]
})
export class CertificateDialogComponent {
  form: FormGroup;
  constructor(
    public ref: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Certificate | null,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      studentName      : [data?.studentName       ?? '', Validators.required],
      certificateNumber: [data?.certificateNumber ?? '', Validators.required],
      type             : [data?.type              ?? 'INTERNSHIP', Validators.required],
      issuedAt         : [data?.issuedAt          ?? '', Validators.required],
      internshipId     : [data?.internshipId      ?? null]
    });
  }
  save() { if (this.form.valid) this.ref.close(this.form.value); }
}
