import { Component } from '@angular/core';
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
  mobileOpen = false;

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly UserIcon = User;
  readonly PhoneIcon = Phone;
  readonly GlobeIcon = Globe;
  readonly LogOutIcon = LogOut;
  readonly DashboardIcon = LayoutDashboard;

  readonly publicLinks = [
    { href: '/', label: 'About' },
    { href: '/trainings', label: 'Training' },
    { href: '/clubs', label: 'Clubs' },
    { href: '/events', label: 'Events' },
    { href: '/competitions', label: 'Competitions' },
    { href: '/classes', label: 'Classes' },
  ];

  constructor(public router: Router, public auth: AuthService) {}

  get isLoggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.auth.getCurrentUser()?.role === 'ADMIN';
  }

  get currentUser(): any {
    return this.auth.getCurrentUser();
  }

  get dashboardRoute(): string {
    const role = this.currentUser?.role;
    if (role === 'ADMIN')     return '/admin';
    if (role === 'PROFESSOR') return '/professor';
    if (role === 'STUDENT')   return '/courses';
    return '/dashboard';
  }

  get userInitial(): string {
    const email: string = this.currentUser?.email ?? '';
    return email.charAt(0).toUpperCase() || 'U';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.mobileOpen = false;
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  isCurrentRoute(href: string): boolean {
    return this.router.url === href;
  }
}