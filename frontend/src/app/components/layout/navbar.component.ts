import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Menu, X, User, Phone, Globe, LogOut, LayoutDashboard } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  mobileOpen = false;

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly UserIcon = User;
  readonly PhoneIcon = Phone;
  readonly GlobeIcon = Globe;
  readonly LogOutIcon = LogOut;
  readonly DashboardIcon = LayoutDashboard;

  navLinks = [
    { href: '/', label: 'About' },
    { href: '/courses', label: 'Course' },
    { href: '/clubs', label: 'Clubs' },
    { href: '/events', label: 'Events' },
    { href: '/competitions', label: 'Competitions' },
    { href: '/classes', label: 'Classes' },
  ];

  readonly dashboardLink = computed(() => this.authService.currentUser()?.redirectPath ?? '/login');
  readonly dashboardLabel = computed(() => this.authService.isTeacher() ? 'Teacher space' : 'Student space');
  readonly isLoggedIn = this.authService.isLoggedIn;

  constructor(public router: Router) { }

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }

  isCurrentRoute(href: string): boolean {
    return this.router.url === href;
  }

  logout() {
    this.authService.logout();
    this.mobileOpen = false;
    void this.router.navigateByUrl('/login');
  }
}
