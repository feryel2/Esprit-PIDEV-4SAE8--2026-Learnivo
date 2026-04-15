import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Search, Bell, User, Menu } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white px-8">
      <div class="flex items-center gap-4">
        <button class="rounded-lg p-2 hover:bg-muted lg:hidden">
          <lucide-icon [name]="Menu" [size]="20"></lucide-icon>
        </button>
        <div class="relative hidden md:block">
          <lucide-icon [name]="Search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
          <input type="text" placeholder="Search for anything..." 
                 class="w-64 rounded-xl border-none bg-muted/50 py-2 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-teal-600">
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
        <button (click)="toggleNotifications()" class="group relative rounded-lg p-2 transition-all hover:bg-muted">
          <lucide-icon [name]="Bell" [size]="20"></lucide-icon>
          @if (data.unreadNotifications().length > 0) {
          <span class="absolute -right-1 -top-1 min-w-5 rounded-full bg-teal-600 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
            {{ data.unreadNotifications().length }}
          </span>
          }
        </button>
        @if (notificationsOpen()) {
        <div class="absolute right-0 top-12 z-20 w-96 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div class="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p class="text-sm font-bold text-foreground">Notifications</p>
              <p class="text-xs text-muted-foreground">{{ data.unreadNotifications().length }} unread</p>
            </div>
            <button (click)="markAllAsRead()" class="text-xs font-semibold text-teal-600 hover:underline">
              Mark all as read
            </button>
          </div>

          <div class="max-h-96 overflow-y-auto">
            @if (data.notifications().length === 0) {
            <div class="px-4 py-6 text-sm text-muted-foreground">
              No notifications yet.
            </div>
            } @else {
            @for (notification of data.notifications(); track notification.id) {
            <button
              (click)="openNotification(notification.id, notification.href)"
              class="flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition hover:bg-muted/40"
              [class.bg-teal-50/70]="!notification.read">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-foreground">{{ notification.title }}</p>
                @if (!notification.read) {
                <span class="h-2 w-2 rounded-full bg-teal-600"></span>
                }
              </div>
              <p class="text-xs text-muted-foreground">{{ notification.message }}</p>
              <p class="text-[11px] text-muted-foreground">{{ notification.createdAt }}</p>
            </button>
            }
            }
          </div>
        </div>
        }
        </div>
        
        <div class="mx-2 h-8 w-px bg-border"></div>
        
        <button class="group flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-muted">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 font-bold text-teal-600 transition-all group-hover:bg-teal-600 group-hover:text-white">
            <lucide-icon [name]="User" [size]="18"></lucide-icon>
          </div>
          <div class="hidden text-left sm:block">
            <p class="text-xs font-bold leading-tight">{{ displayName() }}</p>
            <p class="text-[10px] text-muted-foreground">Teacher</p>
          </div>
        </button>
      </div>
    </header>
  `
})
export class AdminHeaderComponent {
    data = inject(DataService);
    auth = inject(AuthService);
    private router = inject(Router);
    notificationsOpen = signal(false);
    displayName = computed(() => this.auth.currentUser()?.fullName ?? 'Teacher User');

    readonly Search = Search;
    readonly Bell = Bell;
    readonly User = User;
    readonly Menu = Menu;

    toggleNotifications() {
        this.notificationsOpen.update(value => !value);
    }

    markAllAsRead() {
        this.data.markAllNotificationsAsRead();
    }

    openNotification(id: number, href?: string) {
        this.data.markNotificationAsRead(id);
        this.notificationsOpen.set(false);

        if (href) {
            this.router.navigateByUrl(href);
        }
    }
}
