import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Search, Bell, User, Menu } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <header class="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-muted rounded-lg lg:hidden">
          <lucide-icon [name]="Menu" [size]="20"></lucide-icon>
        </button>
        <div class="relative hidden md:block">
          <lucide-icon [name]="Search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
          <input type="text" placeholder="Search for anything..." 
                 class="pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-600 transition-all w-64">
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
        <button (click)="toggleNotifications()" class="relative p-2 hover:bg-muted rounded-lg transition-all group">
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
        
        <div class="h-8 w-px bg-border mx-2"></div>
        
        <button class="flex items-center gap-3 p-1.5 hover:bg-muted rounded-xl transition-all group">
          <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold group-hover:bg-teal-600 group-hover:text-white transition-all">
            <lucide-icon [name]="User" [size]="18"></lucide-icon>
          </div>
          <div class="text-left hidden sm:block">
            <p class="text-xs font-bold leading-tight">Admin User</p>
            <p class="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  `
})
export class AdminHeaderComponent {
    data = inject(DataService);
    private router = inject(Router);
    notificationsOpen = signal(false);

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
