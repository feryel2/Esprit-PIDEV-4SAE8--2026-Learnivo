import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationItem, NotificationType } from '../../services/notification.service';
import { LucideAngularModule, CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-20 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <div class="pointer-events-auto flex flex-col gap-3">
        @for (n of notificationService.toasts(); track n.id) {
          @if (n.requiresAck && n.liveCheckInId != null) {
            <div
              class="rounded-xl border shadow-lg p-4 flex flex-col gap-3 animate-in slide-in-from-right-5 duration-300 bg-gradient-to-br from-teal-50 to-white border-teal-200"
            >
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 mt-0.5">
                  <lucide-icon [name]="Info" [size]="22" class="text-teal-600"></lucide-icon>
                </span>
                <div class="flex-1 min-w-0">
                  @if (n.title) {
                    <p class="font-semibold text-sm text-foreground">{{ n.title }}</p>
                  }
                  <p class="text-sm text-muted-foreground mt-0.5">{{ n.message }}</p>
                </div>
              </div>
              @if (canStudentAck()) {
                <label class="flex items-start gap-2 text-xs text-foreground cursor-pointer select-none">
                  <input type="checkbox" #ackCb class="mt-0.5 rounded border-border" />
                  <span>Je confirme être présent(e) à cet événement maintenant.</span>
                </label>
                <button
                  type="button"
                  (click)="confirmPresence(n, ackCb)"
                  [disabled]="ackBusy[n.id]"
                  class="w-full py-2 rounded-lg bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {{ ackBusy[n.id] ? 'Envoi…' : 'Valider ma présence' }}
                </button>
              } @else {
                <p class="text-xs text-muted-foreground">
                  Connectez-vous en tant qu’étudiant pour confirmer votre présence.
                </p>
              }
            </div>
          } @else {
            <div
              [class]="toastClasses(n.type)"
              class="rounded-xl border shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right-5 duration-300"
            >
              <span class="flex-shrink-0 mt-0.5">
                @switch (n.type) {
                  @case ('success') {
                    <lucide-icon [name]="CheckCircle" [size]="22" class="text-emerald-600"></lucide-icon>
                  }
                  @case ('error') {
                    <lucide-icon [name]="XCircle" [size]="22" class="text-rose-600"></lucide-icon>
                  }
                  @case ('warning') {
                    <lucide-icon [name]="AlertTriangle" [size]="22" class="text-amber-600"></lucide-icon>
                  }
                  @default {
                    <lucide-icon [name]="Info" [size]="22" class="text-sky-600"></lucide-icon>
                  }
                }
              </span>
              <div class="flex-1 min-w-0">
                @if (n.title) {
                  <p class="font-semibold text-sm text-foreground">{{ n.title }}</p>
                }
                <p class="text-sm text-muted-foreground">{{ n.message }}</p>
              </div>
              <button
                type="button"
                (click)="notificationService.remove(n.id)"
                class="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Fermer"
              >
                <lucide-icon [name]="X" [size]="16"></lucide-icon>
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class NotificationToastComponent {
  readonly notificationService = inject(NotificationService);
  private readonly auth = inject(AuthService);
  private readonly data = inject(DataService);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Info = Info;
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;

  ackBusy: Record<string, boolean> = {};

  canStudentAck(): boolean {
    const u = this.auth.getCurrentUser();
    return u?.type === 'STUDENT' && u?.id != null;
  }

  confirmPresence(n: NotificationItem, checkbox: HTMLInputElement): void {
    if (!checkbox.checked) {
      this.notificationService.warning(
        'Cochez la case pour confirmer que vous êtes présent(e) à l’événement.',
        'Confirmation requise'
      );
      return;
    }
    const user = this.auth.getCurrentUser();
    const sid = user?.type === 'STUDENT' ? Number(user.id) : NaN;
    if (!Number.isFinite(sid)) {
      this.notificationService.error(
        'Vous devez être connecté en tant qu’étudiant pour confirmer.',
        'Connexion'
      );
      return;
    }
    const cid = n.liveCheckInId;
    if (cid == null) {
      return;
    }
    this.ackBusy[n.id] = true;
    this.data.ackLiveEventCheckIn(cid, sid).subscribe({
      next: () => {
        delete this.ackBusy[n.id];
        this.notificationService.remove(n.id);
        this.notificationService.success('Votre présence a été enregistrée.', 'Merci');
      },
      error: (err: { error?: { error?: string } }) => {
        delete this.ackBusy[n.id];
        const msg = err?.error?.error ?? 'Impossible d’enregistrer la confirmation.';
        this.notificationService.error(msg, 'Erreur');
      },
    });
  }

  toastClasses(type: NotificationType): string {
    const base = 'bg-white';
    switch (type) {
      case 'success':
        return `${base} border-emerald-200`;
      case 'error':
        return `${base} border-rose-200`;
      case 'warning':
        return `${base} border-amber-200`;
      default:
        return `${base} border-sky-200`;
    }
  }
}
