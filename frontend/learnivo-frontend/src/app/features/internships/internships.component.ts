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
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { Internship } from '../../core/models/models';
import { InternshipDialogComponent } from './internship-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule,
            MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule,
            MatChipsModule, MatProgressSpinnerModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Internships</h1>
      <button mat-raised-button color="primary" (click)="openDialog()">
        <mat-icon>add</mat-icon> New Internship
      </button>
    </div>

    <mat-card>
      <mat-card-content>
        <!-- Toolbar -->
        <div class="toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="search" placeholder="title, company or student…" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status</mat-label>
            <select matNativeControl [(ngModel)]="filterValidated">
              <option value="">All</option>
              <option value="true">Validated</option>
              <option value="false">Pending</option>
            </select>
          </mat-form-field>
        </div>

        <div *ngIf="loading" class="spinner-center"><mat-spinner diameter="40"/></div>

        <table mat-table [dataSource]="filtered" class="full-table" *ngIf="!loading">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let r">{{ r.title }}</td>
          </ng-container>
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let r">{{ r.companyName }}</td>
          </ng-container>
          <ng-container matColumnDef="student">
            <th mat-header-cell *matHeaderCellDef>Student</th>
            <td mat-cell *matCellDef="let r">{{ r.studentName }}</td>
          </ng-container>
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Period</th>
            <td mat-cell *matCellDef="let r">{{ r.startDate | date:'shortDate' }} – {{ r.endDate | date:'shortDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let r">
              <span [class]="r.validated ? 'chip chip-approved' : 'chip chip-pending'">
                {{ r.validated ? 'Validated' : 'Pending' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button color="primary"   matTooltip="Edit"     (click)="openDialog(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="accent"    matTooltip="Validate" (click)="validate(r)"  [disabled]="r.validated"><mat-icon>check_circle</mat-icon></button>
              <button mat-icon-button color="warn"      matTooltip="Delete"   (click)="delete(r)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>

        <div *ngIf="!loading && filtered.length === 0" class="empty-state">
          <mat-icon>work_off</mat-icon>
          <p>No internships found.</p>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button mat-icon-button [disabled]="page===0" (click)="page=page-1"><mat-icon>chevron_left</mat-icon></button>
          <span>{{ page+1 }} / {{ totalPages }}</span>
          <button mat-icon-button [disabled]="page>=totalPages-1" (click)="page=page+1"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .page-title { font-size:1.6rem; font-weight:600; color:#311b92; margin:0; }
    .toolbar { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px; }
    .search-field { flex:1; min-width:200px; }
    .filter-field { width:160px; }
    .full-table { width:100%; }
    .spinner-center { display:flex; justify-content:center; padding:40px; }
    .empty-state { text-align:center; padding:40px; color:#999; mat-icon { font-size:3rem; width:3rem; height:3rem; } }
    .pagination { display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-top:12px; }
    .chip { padding:3px 10px; border-radius:12px; font-size:.78rem; font-weight:600; }
    .chip-approved { background:#d1fae5; color:#065f46; }
    .chip-pending  { background:#fef3c7; color:#92400e; }
  `]
})
export class InternshipsComponent implements OnInit {
  private api    = inject(ApiService);
  private dialog = inject(MatDialog);

  internships: Internship[] = [];
  loading = true;
  search = '';
  filterValidated = '';
  page = 0;
  pageSize = 8;
  cols = ['title','company','student','dates','status','actions'];

  get filtered() {
    const q = this.search.toLowerCase();
    let list = this.internships.filter(i =>
      (!q || i.title.toLowerCase().includes(q) ||
             i.companyName.toLowerCase().includes(q) ||
             i.studentName.toLowerCase().includes(q)) &&
      (this.filterValidated === '' || String(i.validated) === this.filterValidated)
    );
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page >= this.totalPages) this.page = 0;
    return list.slice(this.page * this.pageSize, (this.page+1) * this.pageSize);
  }

  totalPages = 1;

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.listInternships().subscribe({ next: d => { this.internships = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openDialog(item?: Internship) {
    this.dialog.open(InternshipDialogComponent, { data: item ?? null, width: '500px' })
      .afterClosed().subscribe(v => {
        if (!v) return;
        const obs = item ? this.api.updateInternship(item.id, v) : this.api.createInternship(v);
        obs.subscribe(() => this.load());
      });
  }

  validate(item: Internship) {
    this.api.validateInternship(item.id).subscribe(() => this.load());
  }

  delete(item: Internship) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Internship', message: `Delete "${item.title}"?` } })
      .afterClosed().subscribe(ok => { if (ok) this.api.deleteInternship(item.id).subscribe(() => this.load()); });
  }
}
