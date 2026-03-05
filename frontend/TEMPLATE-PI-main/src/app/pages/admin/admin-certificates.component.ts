import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateService } from '../../api/services/certificate.service';
import { Certificate, CertificateRequest, CertificateType, CertificateStatus } from '../../api/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plus, Edit2, Trash2, Download, QrCode, Copy } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-certificates',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items.Center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Certificates</span></h1>
          <p class="text-muted-foreground">Issue and manage certificates.</p>
        </div>
        <button (click)="startNew()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Add New Certificate
        </button>
      </div>

      <div *ngIf="editing()" class="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Student Name *</label>
              <input formControlName="studentName" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('studentName')" class="text-rose-600 text-sm mt-1">{{ getError('studentName') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Certificate Number *</label>
              <input formControlName="certificateNumber" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('certificateNumber')" class="text-rose-600 text-sm mt-1">{{ getError('certificateNumber') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Type *</label>
              <select formControlName="type" class="mt-1 block w-full rounded-lg border border-border px-3 py-2">
                <option [value]="'LEVEL'">LEVEL</option>
                <option [value]="'PARTICIPATION'">PARTICIPATION</option>
                <option [value]="'INTERNSHIP'">INTERNSHIP</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Status *</label>
              <select formControlName="status" class="mt-1 block w-full rounded-lg border border-border px-3 py-2">
                <option [value]="'ISSUED'">ISSUED</option>
                <option [value]="'REVOKED'">REVOKED</option>
                <option [value]="'EXPIRED'">EXPIRED</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Issued At *</label>
              <input type="date" formControlName="issuedAt" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('issuedAt')" class="text-rose-600 text-sm mt-1">This field is required</div>
            </div>
            <div>
              <label class="block text-sm font-medium">PDF URL</label>
              <input formControlName="pdfUrl" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('pdfUrl')" class="text-rose-600 text-sm mt-1">{{ getError('pdfUrl') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">QR Code URL</label>
              <input formControlName="qrCodeUrl" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('qrCodeUrl')" class="text-rose-600 text-sm mt-1">{{ getError('qrCodeUrl') }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium">Internship ID</label>
              <input type="number" formControlName="internshipId" class="mt-1 block w-full rounded-lg border border-border px-3 py-2" />
              <div *ngIf="isInvalid('internshipId')" class="text-rose-600 text-sm mt-1">{{ getError('internshipId') }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="submit" [disabled]="form.invalid" class="bg-teal-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Save</button>
            <button type="button" (click)="cancel()" class="px-4 py-2 rounded-lg border border-border">Cancel</button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div *ngIf="loading" class="p-8 text-center text-muted-foreground">Loading certificates…</div>
        <div *ngIf="errorMsg" class="p-6 text-rose-600 font-medium bg-rose-50 rounded-3xl">⚠ {{ errorMsg }}</div>
        <div class="overflow-x-auto" *ngIf="!loading && !errorMsg">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th class="px-6 py-4">Student</th>
                <th class="px-6 py-4">Number</th>
                <th class="px-6 py-4">Verification Code</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Issued At</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr *ngFor="let c of certificates" class="hover:bg-muted/20 transition-colors group">
                <td class="px-6 py-5 font-medium">{{ c.studentName }}</td>
                <td class="px-6 py-5"><code class="bg-gray-100 px-2 py-0.5 rounded text-xs">{{ c.certificateNumber }}</code></td>
                <td class="px-6 py-5">
                  <span *ngIf="c.verificationCode" class="inline-flex items-center gap-1">
                    <code class="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-xs font-mono tracking-wide">{{ c.verificationCode }}</code>
                    <button (click)="copyCode(c.verificationCode!)" class="p-1 hover:bg-violet-50 rounded transition-all" title="Copy">
                      <lucide-icon [name]="Copy" [size]="13"></lucide-icon>
                    </button>
                  </span>
                  <span *ngIf="!c.verificationCode" class="text-gray-300 text-sm">—</span>
                </td>
                <td class="px-6 py-5">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    [class.bg-violet-100]="c.type==='INTERNSHIP'" [class.text-violet-700]="c.type==='INTERNSHIP'"
                    [class.bg-blue-100]="c.type==='LEVEL'"      [class.text-blue-700]="c.type==='LEVEL'"
                    [class.bg-sky-100]="c.type==='PARTICIPATION'" [class.text-sky-700]="c.type==='PARTICIPATION'">
                    {{ c.type }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                    [class.bg-emerald-100]="c.status==='ISSUED'"  [class.text-emerald-700]="c.status==='ISSUED'"
                    [class.bg-rose-100]="c.status==='REVOKED'"    [class.text-rose-700]="c.status==='REVOKED'"
                    [class.bg-gray-100]="c.status==='EXPIRED'"    [class.text-gray-500]="c.status==='EXPIRED'">
                    {{ c.status }}
                  </span>
                </td>
                <td class="px-6 py-5 text-sm text-muted-foreground">{{ c.issuedAt | date:'mediumDate' }}</td>
                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="edit(c)" class="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-all" title="Edit">
                      <lucide-icon [name]="Edit2" [size]="15"></lucide-icon>
                    </button>
                    <button (click)="downloadPdf(c)" class="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all" title="Download PDF">
                      <lucide-icon [name]="Download" [size]="15"></lucide-icon>
                    </button>
                    <button (click)="openQr(c)" [disabled]="!c.verificationCode" class="p-2 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition-all disabled:opacity-30" title="View QR Code">
                      <lucide-icon [name]="QrCode" [size]="15"></lucide-icon>
                    </button>
                    <button (click)="remove(c)" class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all" title="Delete">
                      <lucide-icon [name]="Trash2" [size]="15"></lucide-icon>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="certificates.length===0" class="text-center py-16 text-muted-foreground">No certificates found.</div>
        </div>
      </div>
    </div>

    <!-- QR Modal -->
    <div *ngIf="qrVisible()" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="qrVisible.set(false)">
      <div class="bg-white rounded-2xl overflow-hidden w-72 shadow-2xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-border">
          <span class="font-semibold text-sm">QR Code – {{ qrCert()?.certificateNumber }}</span>
          <button (click)="qrVisible.set(false)" class="p-1 hover:bg-gray-200 rounded-lg">✕</button>
        </div>
        <div class="flex flex-col items-center gap-3 p-6">
          <img *ngIf="!qrLoadError" [src]="service.qrCodeUrl(qrCert()!.verificationCode!)" alt="QR" class="w-48 h-48 object-contain border border-border rounded-lg" (error)="qrLoadError=true" />
          <p *ngIf="qrLoadError" class="text-rose-500 text-sm">QR image could not be loaded.</p>
          <code class="text-xs text-gray-400 font-mono">{{ qrCert()?.verificationCode }}</code>
        </div>
      </div>
    </div>

    <!-- Copy toast -->
    <div *ngIf="copied()" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2 rounded-full shadow-lg z-50 pointer-events-none">Copied!</div>
  `
})
export class AdminCertificatesComponent {
  service = inject(CertificateService);
  private fb = inject(FormBuilder);

  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Download = Download;
  readonly QrCode = QrCode;
  readonly Copy = Copy;

  // QR modal
  qrVisible  = signal(false);
  qrCert     = signal<Certificate | null>(null);
  qrLoadError = false;

  // Copy toast
  copied = signal(false);

  certificates: Certificate[] = [];
  editing = signal(false);
  editingItem?: Certificate;
  form = this.fb.group({
    studentName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    certificateNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    type: ['LEVEL' as CertificateType, Validators.required],
    status: ['ISSUED' as CertificateStatus, Validators.required],
    issuedAt: ['', Validators.required],
    pdfUrl: [''],
    qrCodeUrl: [''],
    internshipId: [null as number | null, Validators.min(1)]
  });

  loading = false;
  errorMsg = '';

  constructor() { this.load(); }
  load() {
    this.loading = true;
    this.errorMsg = '';
    this.service.list().subscribe({
      next: (d: any) => {
        this.certificates = Array.isArray(d) ? d : (d?.content ?? []);
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMsg = `Failed to load certificates (${err.status}). Check that the backend is running.`;
        this.loading = false;
      }
    });
  }
  startNew() { this.editingItem = undefined; this.form.reset({ type: 'LEVEL', status: 'ISSUED' }); this.editing.set(true); }
  edit(c: Certificate) { this.editingItem = c; this.form.patchValue(c as any); this.editing.set(true); }
  cancel() { this.editing.set(false); this.editingItem = undefined; }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: CertificateRequest = this.form.value as unknown as CertificateRequest;
    const obs = this.editingItem ? this.service.update(this.editingItem.id, dto) : this.service.create(dto);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }
  remove(c: Certificate) { if(!confirm('Delete certificate?')) return; this.service.delete(c.id).subscribe(() => this.load()); }

  downloadPdf(c: Certificate) {
    window.open(this.service.downloadUrl(c.id), '_blank');
  }

  openQr(c: Certificate) {
    this.qrCert.set(c);
    this.qrLoadError = false;
    this.qrVisible.set(true);
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    });
  }

  isInvalid(controlName: string): boolean {
    return !!(this.form.get(controlName)?.invalid && (this.form.get(controlName)?.dirty || this.form.get(controlName)?.touched));
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['min']) return `Value must be greater than ${control.errors['min'].min}`;
    return 'Invalid value';
  }
}
