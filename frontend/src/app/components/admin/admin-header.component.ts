import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search, Bell, User, Menu, CheckCircle, XCircle, Info, AlertTriangle, CheckCheck, Trash2 } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationService } from '../../services/notification.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NextEventCountdownComponent } from '../ui/next-event-countdown.component';
import { HeaderCalendarComponent } from '../ui/header-calendar.component';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ClickOutsideDirective, NextEventCountdownComponent, HeaderCalendarComponent],
    template: `
    <header class="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <div class="hidden lg:block min-w-0 max-w-md rounded-lg bg-muted/50 px-3 py-1.5 border border-border">
          <app-next-event-countdown [includeScheduled]="true"></app-next-event-countdown>
        </div>
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
        <app-header-calendar></app-header-calendar>
        <div class="relative" (appClickOutside)="notificationPanelOpen.set(false)">
          <button
            type="button"
            (click)="notificationPanelOpen.set(!notificationPanelOpen())"
            class="relative p-2 hover:bg-muted rounded-lg transition-all group"
            aria-label="Notifications"
          >
            <lucide-icon [name]="Bell" [size]="20"></lucide-icon>
            @if (notificationService.unreadCount() > 0) {
              <span class="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-teal-600 text-white rounded-full border-2 border-white">
                {{ notificationService.unreadCount() > 99 ? '99+' : notificationService.unreadCount() }}
              </span>
            }
          </button>

          @if (notificationPanelOpen()) {
            <div class="absolute right-0 top-full mt-2 w-96 max-h-[28rem] bg-white rounded-xl border border-border shadow-xl z-50 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <span class="font-semibold text-sm">Notifications</span>
                <div class="flex items-center gap-1">
                  @if (notificationService.recentList().length > 0) {
                    <button
                      type="button"
                      (click)="notificationService.markAllAsRead()"
                      class="p-2 rounded-lg hover:bg-muted transition-colors"
                      title="Tout marquer comme lu"
                    >
                      <lucide-icon [name]="CheckCheck" [size]="16"></lucide-icon>
                    </button>
                    <button
                      type="button"
                      (click)="notificationService.clearAll()"
                      class="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Tout effacer"
                    >
                      <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
                    </button>
                  }
                </div>
              </div>
              <div class="overflow-y-auto flex-1">
                @if (notificationService.recentList().length === 0) {
                  <p class="p-6 text-sm text-muted-foreground text-center">Aucune notification</p>
                } @else {
                  <ul class="divide-y divide-border">
                    @for (n of notificationService.recentList(); track n.id) {
                      <li
                        (click)="notificationService.markAsRead(n.id)"
                        [class.bg-teal-50/50]="!n.read"
                        class="px-4 py-3 flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <span class="flex-shrink-0 mt-0.5">
                          @switch (n.type) {
                            @case ('success') {
                              <lucide-icon [name]="CheckCircle" [size]="18" class="text-emerald-600"></lucide-icon>
                            }
                            @case ('error') {
                              <lucide-icon [name]="XCircle" [size]="18" class="text-rose-600"></lucide-icon>
                            }
                            @case ('warning') {
                              <lucide-icon [name]="AlertTriangle" [size]="18" class="text-amber-600"></lucide-icon>
                            }
                            @default {
                              <lucide-icon [name]="Info" [size]="18" class="text-sky-600"></lucide-icon>
                            }
                          }
                        </span>
                        <div class="flex-1 min-w-0">
                          @if (n.title) {
                            <p class="font-medium text-sm text-foreground">{{ n.title }}</p>
                          }
                          <p class="text-sm text-muted-foreground">{{ n.message }}</p>
                          <p class="text-[11px] text-muted-foreground mt-0.5">{{ n.date | date:'short' }}</p>
                        </div>
                      </li>
                    }
                  </ul>
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
    readonly Search = Search;
    readonly Bell = Bell;
    readonly User = User;
    readonly Menu = Menu;
    readonly CheckCircle = CheckCircle;
    readonly XCircle = XCircle;
    readonly Info = Info;
    readonly AlertTriangle = AlertTriangle;
    readonly CheckCheck = CheckCheck;
    readonly Trash2 = Trash2;

    readonly notificationService = inject(NotificationService);
    readonly notificationPanelOpen = signal(false);
}
