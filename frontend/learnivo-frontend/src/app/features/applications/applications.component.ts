import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { InternshipApplication } from '../../core/models/models';
import { ApplicationDialogComponent } from './application-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule,
            MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatProgressSpinnerModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Applications</h1>
      <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> New Application</button>
    </div>
    <mat-card>
      <mat-card-content>
        <div class="toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="search" placeholder="student name or email…" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status</mat-label>
            <select matNativeControl [(ngModel)]="filterStatus">
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </mat-form-field>
        </div>
        <div *ngIf="loading" class="spinner-center"><mat-spinner diameter="40"/></div>
        <table mat-table [dataSource]="paged" class="full-table" *ngIf="!loading">
          <ng-container matColumnDef="student">
            <th mat-header-cell *matHeaderCellDef>Student</th>
            <td mat-cell *matCellDef="let r">{{ r.studentName }}<br/><small>{{ r.studentEmail }}</small></td>
          </ng-container>
          <ng-container matColumnDef="internship">
            <th mat-header-cell *matHeaderCellDef>Internship</th>
            <td mat-cell *matCellDef="let r">{{ r.internship?.title ?? '#' + r.internshipId }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r"><span [class]="statusClass(r.status)">{{ r.status }}</span></td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Applied At</th>
            <td mat-cell *matCellDef="let r">{{ r.appliedAt | date:'shortDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button color="primary" matTooltip="Approve" (click)="setStatus(r,'APPROVED')" [disabled]="r.status==='APPROVED'"><mat-icon>check_circle</mat-icon></button>
              <button mat-icon-button color="warn"    matTooltip="Reject"  (click)="setStatus(r,'REJECTED')" [disabled]="r.status==='REJECTED'"><mat-icon>cancel</mat-icon></button>
              <button mat-icon-button matTooltip="Edit"   (click)="openDialog(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="delete(r)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && paged.length===0" class="empty-state"><mat-icon>inbox</mat-icon><p>No applications found.</p></div>
        <div class="pagination" *ngIf="totalPages>1">
          <button mat-icon-button [disabled]="page===0" (click)="page=page-1"><mat-icon>chevron_left</mat-icon></button>
          <span>{{ page+1 }} / {{ totalPages }}</span>
          <button mat-icon-button [disabled]="page>=totalPages-1" (click)="page=page+1"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
    .page-title{font-size:1.6rem;font-weight:600;color:#311b92;margin:0;}
    .toolbar{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px;}
    .search-field{flex:1;min-width:200px;}.filter-field{width:160px;}
    .full-table{width:100%;}.spinner-center{display:flex;justify-content:center;padding:40px;}
    .empty-state{text-align:center;padding:40px;color:#999;mat-icon{font-size:3rem;width:3rem;height:3rem;}}
    .pagination{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px;}
    .chip{padding:3px 10px;border-radius:12px;font-size:.78rem;font-weight:600;}
    .chip-approved{background:#d1fae5;color:#065f46;}.chip-pending{background:#fef3c7;color:#92400e;}.chip-rejected{background:#fee2e2;color:#991b1b;}
    small{color:#888;font-size:.75rem;}
  `]
})
export class ApplicationsComponent implements OnInit {
  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  applications: InternshipApplication[] = [];
  loading = true; search = ''; filterStatus = ''; page = 0; pageSize = 8; totalPages = 1;
  cols = ['student','internship','status','date','actions'];

  get paged() {
    const q = this.search.toLowerCase();
    let list = this.applications.filter(a =>
      (!q || a.studentName.toLowerCase().includes(q) || a.studentEmail.toLowerCase().includes(q)) &&
      (!this.filterStatus || a.status === this.filterStatus)
    );
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page >= this.totalPages) this.page = 0;
    return list.slice(this.page * this.pageSize, (this.page+1) * this.pageSize);
  }

  ngOnInit() { this.load(); }
  load() { this.loading=true; this.api.listApplications().subscribe({next:d=>{this.applications=d;this.loading=false;},error:()=>{this.loading=false;}}); }
  statusClass(s: string) { return `chip chip-${s.toLowerCase()}`; }
  setStatus(item: InternshipApplication, status: string) {
    this.api.updateApplication(item.id, { status }).subscribe(() => this.load());
  }
  openDialog(item?: InternshipApplication) {
    this.dialog.open(ApplicationDialogComponent, { data: item ?? null, width:'500px' })
      .afterClosed().subscribe(v => {
        if (!v) return;
        const obs = item ? this.api.updateApplication(item.id, v) : this.api.createApplication(v);
        obs.subscribe(() => this.load());
      });
  }
  delete(item: InternshipApplication) {
    this.dialog.open(ConfirmDialogComponent, { data: { title:'Delete Application', message:`Delete application from "${item.studentName}"?` } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteApplication(item.id).subscribe(() => this.load()); });
  }
}
