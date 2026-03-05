import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificateService } from '../api/services/certificate.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <div class="w-full max-w-lg">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-white">
            <div class="flex items-center gap-3">
              <span class="text-3xl">&#10003;</span>
              <div>
                <h1 class="text-xl font-bold">Certificate Verification</h1>
                <p class="text-teal-100 text-sm">Enter the code on your certificate to verify it</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="px-8 py-8 space-y-6">
            <div class="flex gap-3">
              <input [(ngModel)]="code" (keyup.enter)="verify()"
                placeholder="e.g. CERT-2024-ABC123"
                class="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <button (click)="verify()" [disabled]="!code.trim() || loading()"
                class="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all">
                {{ loading() ? 'Checking…' : 'Verify' }}
              </button>
            </div>

            <!-- Valid result -->
            <div *ngIf="result()" class="border border-emerald-200 bg-emerald-50 rounded-2xl p-6 space-y-3">
              <div class="flex items-center gap-2 text-emerald-700 font-bold text-base">
                <span class="text-xl">&#10003;</span> Certificate is Valid
              </div>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div><p class="text-gray-400 text-xs uppercase tracking-wide">Student</p><p class="font-semibold text-gray-800">{{ result()!.studentName }}</p></div>
                <div><p class="text-gray-400 text-xs uppercase tracking-wide">Number</p><p class="font-semibold text-gray-800 font-mono text-xs">{{ result()!.certificateNumber }}</p></div>
                <div><p class="text-gray-400 text-xs uppercase tracking-wide">Type</p><p class="font-semibold text-gray-800">{{ result()!.type }}</p></div>
                <div><p class="text-gray-400 text-xs uppercase tracking-wide">Issued</p><p class="font-semibold text-gray-800">{{ result()!.issuedAt | date:'mediumDate' }}</p></div>
              </div>
              <!-- QR code -->
              <div *ngIf="result()!.verificationCode" class="flex flex-col items-center pt-2 gap-2">
                <img [src]="service.qrCodeUrl(result()!.verificationCode!)" alt="QR"
                     class="w-32 h-32 object-contain border border-gray-200 rounded-xl"
                     (error)="qrErr=true" *ngIf="!qrErr" />
                <code class="text-xs text-gray-400 font-mono">{{ result()!.verificationCode }}</code>
              </div>
            </div>

            <!-- Invalid -->
            <div *ngIf="showError()" class="border border-rose-200 bg-rose-50 rounded-2xl p-6">
              <div class="flex items-center gap-2 text-rose-700 font-bold">
                <span>&#10007;</span> Certificate Not Found
              </div>
              <p class="text-rose-600 text-sm mt-1">No certificate matches <strong>{{ code }}</strong>. Please check and try again.</p>
            </div>

            <!-- Network error -->
            <div *ngIf="netError()" class="border border-orange-200 bg-orange-50 rounded-2xl p-4 text-orange-700 text-sm">
              Could not reach the server. Make sure the backend is running.
            </div>
          </div>
        </div>
        <p class="text-center text-white/40 text-xs mt-4">Learnivo – English School Management Platform</p>
      </div>
    </div>
  `
})
export class VerifyComponent {
  service = inject(CertificateService);

  code = '';
  qrErr = false;

  loading   = signal(false);
  result    = signal<any>(null);
  showError = signal(false);
  netError  = signal(false);

  verify() {
    const c = this.code.trim();
    if (!c) return;
    this.loading.set(true);
    this.result.set(null);
    this.showError.set(false);
    this.netError.set(false);
    this.qrErr = false;

    this.service.verify(c).subscribe({
      next: res => {
        this.loading.set(false);
        if (res?.valid !== false) { this.result.set(res); }
        else { this.showError.set(true); }
      },
      error: err => {
        this.loading.set(false);
        if (err.status === 404 || err.status === 400) { this.showError.set(true); }
        else { this.netError.set(true); }
      }
    });
  }
}
