import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Menu, X, User, Phone, Globe, LogOut } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { NextEventCountdownComponent } from '../ui/next-event-countdown.component';
import { HeaderCalendarComponent } from '../ui/header-calendar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NextEventCountdownComponent, HeaderCalendarComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileOpen = false;

  private readonly data = inject(DataService);
  private readonly notifications = inject(NotificationService);
  private pollId: ReturnType<typeof setInterval> | null = null;

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly UserIcon = User;
  readonly PhoneIcon = Phone;
  readonly GlobeIcon = Globe;
  readonly LogOutIcon = LogOut;

  navLinks = [
    { href: '/', label: 'About' },
    { href: '/trainings', label: 'Training' },
    { href: '/clubs', label: 'Clubs' },
    { href: '/events', label: 'Events' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/competitions', label: 'Competitions' },
    { href: '/classes', label: 'Classes' },
    { href: '/english-bingo', label: 'English bingo' },
    { href: '/crossword', label: 'Crossword' },
    { href: '/admin', label: 'Admin' },
  ];

  constructor(public router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.pollId = setInterval(() => this.syncLivePresenceNotifications(), 15_000);
    this.syncLivePresenceNotifications();
  }

  ngOnDestroy(): void {
    if (this.pollId != null) {
      clearInterval(this.pollId);
      this.pollId = null;
    }
  }

  private syncLivePresenceNotifications(): void {
    const u = this.authService.getCurrentUser();
    if (!u || u.type !== 'STUDENT') {
      return;
    }
    const sid = Number(u.id);
    if (!Number.isFinite(sid)) {
      return;
    }
    this.data.getPendingLiveCheckIns(sid).subscribe({
      next: rows => {
        for (const row of rows) {
          this.notifications.addLiveCheckInIfMissing({
            id: row.id,
            eventTitle: row.eventTitle,
            message: row.message,
          });
        }
      },
      error: () => {},
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  isCurrentRoute(href: string): boolean {
    return this.router.url === href;
  }
}
