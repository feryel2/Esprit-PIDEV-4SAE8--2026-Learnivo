import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  currentUser: any;
  Role = Role;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [Role.ADMIN, Role.STUDENT, Role.PROFESSOR] },
    { label: 'Users', icon: 'users', route: '/admin/users', roles: [Role.ADMIN] },
    { label: 'Classes', icon: 'book', route: '/courses', roles: [Role.ADMIN, Role.STUDENT, Role.PROFESSOR] },
    { label: 'Professors', icon: 'academic-cap', route: '/professor', roles: [Role.ADMIN, Role.STUDENT, Role.PROFESSOR] },
    { label: 'School Needs', icon: 'clipboard-list', route: '/needs', roles: [Role.ADMIN, Role.STUDENT, Role.PROFESSOR] },
    { label: 'Profile', icon: 'user-circle', route: '/profile', roles: [Role.ADMIN, Role.STUDENT, Role.PROFESSOR] },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  hasRole(roles: Role[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
