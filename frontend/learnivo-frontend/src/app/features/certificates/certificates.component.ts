import { Component, OnInit, inject, signal } from '@angular/core';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Certificate } from '../../core/models/models';
import { CertificateDialogComponent } from './certificate-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatTableModule, MatButtonModule,
            MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule,
            MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Certificates</h1>
      <div class="header-actions">
        <button mat-stroked-button color="accent" routerLink="/verify"><mat-icon>verified</mat-icon> Verify</button>
        <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> Issue Certificate</button>
      </div>
    </div>

    <mat-card>
      <mat-card-content>
        <!-- Filters -->
        <div class="toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="search" placeholder="student or certificate number…"/>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Type</mat-label>
            <select matNativeControl [(ngModel)]="filterType">
              <option value="">All</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="TRAINING">Training</option>
              <option value="COMPLETION">Completion</option>
              <option value="LEVEL">Level</option>
              <option value="PARTICIPATION">Participation</option>
            </select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status</mat-label>
            <select matNativeControl [(ngModel)]="filterStatus">
              <option value="">All</option>
              <option value="ISSUED">Issued</option>
              <option value="REVOKED">Revoked</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </mat-form-field>
        </div>

        <div *ngIf="loading" class="spinner-center"><mat-spinner diameter="40"/></div>

        <div class="table-wrap" *ngIf="!loading">
          <table mat-table [dataSource]="paged" class="full-table">

            <!-- Student -->
            <ng-container matColumnDef="student">
              <th mat-header-cell *matHeaderCellDef>Student</th>
              <td mat-cell *matCellDef="let r">{{ r.studentName }}</td>
            </ng-container>

            <!-- Certificate # -->
            <ng-container matColumnDef="number">
              <th mat-header-cell *matHeaderCellDef>Certificate #</th>
              <td mat-cell *matCellDef="let r"><code class="cert-code">{{ r.certificateNumber }}</code></td>
            </ng-container>

            <!-- Verification Code -->
            <ng-container matColumnDef="verificationCode">
              <th mat-header-cell *matHeaderCellDef>Verification Code</th>
              <td mat-cell *matCellDef="let r">
                <span *ngIf="r.verificationCode" class="verify-code-wrap">
                  <code class="verify-code">{{ r.verificationCode }}</code>
                  <button mat-icon-button class="copy-btn"
                          matTooltip="Copy code"
                          (click)="copyCode(r.verificationCode)">
                    <mat-icon style="font-size:14px;width:14px;height:14px">content_copy</mat-icon>
                  </button>
                </span>
                <span *ngIf="!r.verificationCode" class="text-muted">—</span>
              </td>
            </ng-container>

            <!-- Type -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let r"><span [class]="typeClass(r.type)">{{ r.type }}</span></td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let r"><span [class]="statusClass(r.status)">{{ r.status }}</span></td>
            </ng-container>

            <!-- Issued At -->
            <ng-container matColumnDef="issuedAt">
              <th mat-header-cell *matHeaderCellDef>Issued At</th>
              <td mat-cell *matCellDef="let r">{{ r.issuedAt | date:'shortDate' }}</td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let r">
                <!-- Edit -->
                <button mat-icon-button matTooltip="Edit" (click)="openDialog(r)">
                  <mat-icon>edit</mat-icon>
                </button>
                <!-- Download PDF -->
                <button mat-icon-button color="primary" matTooltip="Download PDF"
                        (click)="downloadPdf(r)">
                  <mat-icon>download</mat-icon>
                </button>
                <!-- QR Code -->
                <button mat-icon-button color="accent" matTooltip="View QR Code"
                        [disabled]="!r.verificationCode"
                        (click)="showQr(r)">
                  <mat-icon>qr_code</mat-icon>
                </button>
                <!-- Delete -->
                <button mat-icon-button color="warn" matTooltip="Delete" (click)="delete(r)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>

        <div *ngIf="!loading && paged.length===0" class="empty-state">
          <mat-icon>card_membership</mat-icon><p>No certificates found.</p>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages>1">
          <button mat-icon-button [disabled]="page===0" (click)="page=page-1"><mat-icon>chevron_left</mat-icon></button>
          <span>{{ page+1 }} / {{ totalPages }}</span>
          <button mat-icon-button [disabled]="page>=totalPages-1" (click)="page=page+1"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </mat-card-content>
    </mat-card>

    <!-- QR Code Modal -->
    <div *ngIf="qrVisible()" class="qr-overlay" (click)="qrVisible.set(false)">
      <div class="qr-modal" (click)="$event.stopPropagation()">
        <div class="qr-modal-header">
          <span>QR Code – {{ qrCert()?.certificateNumber }}</span>
          <button mat-icon-button (click)="qrVisible.set(false)"><mat-icon>close</mat-icon></button>
        </div>
        <div class="qr-modal-body">
          <img [src]="qrImageUrl()" alt="QR Code" class="qr-image"
               (error)="qrLoadError = true" *ngIf="!qrLoadError"/>
          <p *ngIf="qrLoadError" class="qr-error">QR image could not be loaded.</p>
          <p class="qr-code-text">{{ qrCert()?.verificationCode }}</p>
        </div>
      </div>
    </div>

    <!-- Copy toast -->
    <div *ngIf="copied()" class="copy-toast">Copied!</div>
  `,
  styles: [`
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .header-actions { display:flex; gap:12px; }
    .page-title { font-size:1.6rem; font-weight:600; color:#311b92; margin:0; }
    .toolbar { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:12px; }
    .search-field { flex:1; min-width:200px; } .filter-field { width:155px; }
    .table-wrap { overflow-x:auto; }
    .full-table { width:100%; min-width:760px; }
    .spinner-center { display:flex; justify-content:center; padding:40px; }
    .empty-state { text-align:center; padding:40px; color:#999; }
    .pagination { display:flex; align-items:center; justify-content:flex-end; gap:8px; margin-top:12px; }
    .text-muted { color:#bbb; font-size:.85rem; }
    /* Chips */
    .chip { padding:3px 10px; border-radius:12px; font-size:.78rem; font-weight:600; }
    .chip-issued { background:#d1fae5; color:#065f46; }
    .chip-revoked { background:#fee2e2; color:#991b1b; }
    .chip-expired { background:#f3f4f6; color:#6b7280; }
    .chip-internship { background:#ede9fe; color:#5b21b6; }
    .chip-training { background:#dbeafe; color:#1e40af; }
    .chip-completion { background:#fef3c7; color:#92400e; }
    .chip-level { background:#d1fae5; color:#065f46; }
    .chip-participation { background:#e0f2fe; color:#0369a1; }
    /* Codes */
    .cert-code { background:#f3f4f6; padding:2px 6px; border-radius:4px; font-size:.8rem; }
    .verify-code-wrap { display:inline-flex; align-items:center; gap:2px; }
    .verify-code { background:#ede9fe; color:#5b21b6; padding:2px 8px; border-radius:6px; font-size:.75rem; letter-spacing:.03em; }
    .copy-btn { width:22px !important; height:22px !important; line-height:22px !important; }
    /* QR Modal */
    .qr-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .qr-modal { background:#fff; border-radius:16px; overflow:hidden; width:300px; box-shadow:0 25px 50px rgba(0,0,0,.25); }
    .qr-modal-header { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:#f8f9fa; font-weight:600; font-size:.9rem; }
    .qr-modal-body { display:flex; flex-direction:column; align-items:center; padding:24px; gap:12px; }
    .qr-image { width:200px; height:200px; object-fit:contain; border:1px solid #e5e7eb; border-radius:8px; }
    .qr-error { color:#ef4444; font-size:.85rem; }
    .qr-code-text { font-family:monospace; font-size:.75rem; color:#6b7280; }
    /* Copy toast */
    .copy-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#1e1b4b; color:#fff; padding:8px 20px; border-radius:999px; font-size:.85rem; z-index:9999; pointer-events:none; animation: fadeOut 1.8s forwards; }
    @keyframes fadeOut { 0%{opacity:1} 70%{opacity:1} 100%{opacity:0} }
  `]
})
export class CertificatesComponent implements OnInit {
  private api    = inject(ApiService);
  private dialog = inject(MatDialog);

  certificates: Certificate[] = [];
  loading = true;
  search = ''; filterType = ''; filterStatus = '';
  page = 0; pageSize = 8; totalPages = 1;
  cols = ['student','number','verificationCode','type','status','issuedAt','actions'];

  // QR modal
  qrVisible  = signal(false);
  qrCert     = signal<Certificate | null>(null);
  qrLoadError = false;

  // Copy toast
  copied = signal(false);

  get paged() {
    const q = this.search.toLowerCase();
    let list = this.certificates.filter(c =>
      (!q || c.studentName.toLowerCase().includes(q) || c.certificateNumber.toLowerCase().includes(q)) &&
      (!this.filterType   || c.type   === this.filterType) &&
      (!this.filterStatus || c.status === this.filterStatus)
    );
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page >= this.totalPages) this.page = 0;
    return list.slice(this.page * this.pageSize, (this.page+1) * this.pageSize);
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.listCertificates().subscribe({
      next: (d: any) => { this.certificates = Array.isArray(d) ? d : (d?.content ?? []); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  typeClass  (t: string) { return `chip chip-${t.toLowerCase()}`; }
  statusClass(s: string) { return `chip chip-${s.toLowerCase()}`; }

  downloadPdf(cert: Certificate) {
    window.open(this.api.downloadCertificateUrl(cert.id), '_blank');
  }

  showQr(cert: Certificate) {
    this.qrCert.set(cert);
    this.qrLoadError = false;
    this.qrVisible.set(true);
  }

  qrImageUrl(): string {
    const code = this.qrCert()?.verificationCode;
    return code ? this.api.qrCodeUrl(code) : '';
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    });
  }

  openDialog(item?: Certificate) {
    this.dialog.open(CertificateDialogComponent, { data: item ?? null, width: '500px' })
      .afterClosed().subscribe(v => {
        if (!v) return;
        const obs = item ? this.api.updateCertificate(item.id, v) : this.api.createCertificate(v);
        obs.subscribe(() => this.load());
      });
  }

  delete(item: Certificate) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Certificate', message: `Delete certificate "${item.certificateNumber}"?` }
    }).afterClosed().subscribe(ok => {
      if (ok) this.api.deleteCertificate(item.id).subscribe(() => this.load());
    });
  }
}
