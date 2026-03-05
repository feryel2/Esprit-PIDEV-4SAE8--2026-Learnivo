import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CertificateVerificationResponse, CertificateType } from '../../core/models/models';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900 p-6">
      <div class="w-full max-w-lg">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Verify Certificate</h1>
          <p class="text-indigo-300 mt-2 text-sm">Enter the verification code printed on your certificate</p>
        </div>

        <!-- Search card -->
        <div class="bg-white rounded-2xl shadow-2xl p-6 mb-4">
          <div class="flex gap-3">
            <input [(ngModel)]="code"
                   (keyup.enter)="verify()"
                   type="text"
                   placeholder="e.g. CERT-2024-ABC123"
                   class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"/>
            <button (click)="verify()"
                    [disabled]="!code.trim() || loading()"
                    class="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap">
              <span *ngIf="loading()">Checking…</span>
              <span *ngIf="!loading()">Verify</span>
            </button>
          </div>
        </div>

        <!-- Valid result -->
        <div *ngIf="result() as r" class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 class="text-emerald-800 font-bold text-lg">Certificate Valid</h2>
          </div>
          <div class="p-6">
            <dl class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Student</dt>
                <dd class="font-semibold text-gray-800 mt-1">{{ r.studentName }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Certificate Title</dt>
                <dd class="font-semibold text-gray-800 mt-1">{{ r.certificateTitle }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Certificate #</dt>
                <dd class="font-mono text-sm text-violet-700 mt-1">{{ r.certificateNumber }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Type</dt>
                <dd class="mt-1"><span [class]="typeBadge(r.type)">{{ r.type }}</span></dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Issue Date</dt>
                <dd class="font-semibold text-gray-800 mt-1">{{ r.issueDate | date:'longDate' }}</dd>
              </div>
              <div>
                <dt class="text-xs text-gray-400 uppercase tracking-wider">Verification Code</dt>
                <dd class="font-mono text-xs bg-violet-50 text-violet-700 px-2 py-1 rounded mt-1 inline-block">{{ r.verificationCode }}</dd>
              </div>
            </dl>
            <!-- QR Code -->
            <div class="flex flex-col items-center gap-2 border-t pt-4" *ngIf="!qrError">
              <p class="text-xs text-gray-400">QR Code</p>
              <img [src]="qrUrl(r.verificationCode)"
                   alt="QR Code"
                   class="w-40 h-40 object-contain border border-gray-100 rounded-xl"
                   (error)="qrError = true"/>
            </div>
          </div>
        </div>

        <!-- Invalid / not found -->
        <div *ngIf="showError()" class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h2 class="text-red-800 font-bold text-lg">Certificate Not Found</h2>
          </div>
          <div class="p-6 text-center text-gray-600 text-sm">
            No certificate matches code <strong class="font-mono">{{ code }}</strong>.
            Please double-check and try again.
          </div>
        </div>

        <!-- Network error -->
        <div *ngIf="networkError()" class="bg-white rounded-2xl shadow-2xl p-6 text-center">
          <p class="text-red-600 text-sm">A network error occurred. Please try again later.</p>
        </div>

        <p class="text-center text-indigo-300/60 text-xs mt-6">
          Learnivo – English School Management Platform
        </p>
      </div>
    </div>
  `
})
export class VerifyComponent {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  code = '';
  qrError = false;

  loading      = signal(false);
  result       = signal<CertificateVerificationResponse | null>(null);
  showError    = signal(false);
  networkError = signal(false);

  verify() {
    const c = this.code.trim();
    if (!c) return;
    this.loading.set(true);
    this.result.set(null);
    this.showError.set(false);
    this.networkError.set(false);
    this.qrError = false;

    this.http.get<CertificateVerificationResponse>(`${this.base}/certificates/verify/${c}`)
      .subscribe({
        next: res => {
          this.loading.set(false);
          if (res.valid) {
            this.result.set(res);
          } else {
            this.showError.set(true);
          }
        },
        error: err => {
          this.loading.set(false);
          if (err.status === 404 || err.status === 400) {
            this.showError.set(true);
          } else {
            this.networkError.set(true);
          }
        }
      });
  }

  qrUrl(verificationCode: string): string {
    return `${this.base}/certificates/qrcode/${verificationCode}.png`;
  }

  typeBadge(type: CertificateType): string {
    const map: Record<string, string> = {
      INTERNSHIP   : 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700',
      TRAINING     : 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700',
      COMPLETION   : 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700',
      LEVEL        : 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700',
      PARTICIPATION: 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700',
    };
    return map[type] ?? 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700';
  }
}
