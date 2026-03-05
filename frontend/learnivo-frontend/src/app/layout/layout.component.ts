import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgFor,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidenav -->
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="brand">
          <mat-icon>school</mat-icon>
          <span>Learnivo</span>
        </div>
        <mat-nav-list>
          <a mat-list-item *ngFor="let n of nav"
             [routerLink]="n.route"
             routerLinkActive="active-link">
            <mat-icon matListItemIcon>{{ n.icon }}</mat-icon>
            <span matListItemTitle>{{ n.label }}</span>
          </a>
        </mat-nav-list>
        <div class="sidenav-footer">
          <a mat-list-item routerLink="/verify">
            <mat-icon matListItemIcon>verified</mat-icon>
            <span matListItemTitle>Verify Certificate</span>
          </a>
        </div>
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content class="main-content">
        <mat-toolbar color="primary">
          <span class="toolbar-title">Learnivo – English School Management</span>
        </mat-toolbar>
        <div class="page-wrapper">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    .sidenav {
      width: 240px;
      background: #311b92;
      color: white;
      display: flex; flex-direction: column;
    }
    .brand {
      display: flex; align-items: center; gap: 12px;
      padding: 20px 16px;
      font-size: 1.3rem; font-weight: 700;
      border-bottom: 1px solid rgba(255,255,255,.15);
      mat-icon { font-size: 2rem; width: 2rem; height: 2rem; }
    }
    mat-nav-list { padding-top: 8px; }
    a[mat-list-item] { color: rgba(255,255,255,.8) !important; border-radius: 8px; margin: 2px 8px; }
    a[mat-list-item]:hover { background: rgba(255,255,255,.1) !important; }
    ::ng-deep .active-link { background: rgba(255,255,255,.2) !important; color: white !important; }
    .sidenav-footer { margin-top: auto; border-top: 1px solid rgba(255,255,255,.15); padding: 8px 0; }
    .main-content { display: flex; flex-direction: column; }
    .toolbar-title { font-size: 1rem; }
    .page-wrapper { padding: 24px; flex: 1; overflow: auto; }
  `]
})
export class LayoutComponent {
  nav: NavItem[] = [
    { label: 'Dashboard',    icon: 'dashboard',   route: '/dashboard' },
    { label: 'Internships',  icon: 'work',         route: '/internships' },
    { label: 'Applications', icon: 'description',  route: '/applications' },
    { label: 'Certificates', icon: 'card_membership', route: '/certificates' },
    { label: 'Events',       icon: 'event',        route: '/events' },
  ];
}
