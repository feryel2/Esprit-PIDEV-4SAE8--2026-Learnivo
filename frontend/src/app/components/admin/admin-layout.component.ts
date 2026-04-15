import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { AdminHeaderComponent } from './admin-header.component';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SidebarComponent, AdminHeaderComponent],
    template: `
    <div class="min-h-screen bg-[#f8fafc]">
      <app-sidebar></app-sidebar>
      <div class="pl-64 flex flex-col min-h-screen">
        <app-admin-header></app-admin-header>
        <main class="flex-1 p-8">
            <div class="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <router-outlet></router-outlet>
            </div>
        </main>
      </div>

      <div class="pointer-events-none fixed right-6 top-20 z-50 flex w-full max-w-sm flex-col gap-3">
        @for (notification of data.toastNotifications(); track notification.id) {
          <div class="pointer-events-auto overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-xl shadow-slate-900/10">
            <div class="flex items-start gap-3 px-4 py-4">
              <div class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500"></div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-foreground">{{ notification.title }}</p>
                <p class="mt-1 text-xs leading-5 text-muted-foreground">{{ notification.message }}</p>
                <p class="mt-2 text-[11px] text-muted-foreground">{{ notification.createdAt }}</p>
              </div>
              <button
                type="button"
                (click)="data.dismissToast(notification.id)"
                class="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Dismiss notification">
                x
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
    data = inject(DataService);
}
