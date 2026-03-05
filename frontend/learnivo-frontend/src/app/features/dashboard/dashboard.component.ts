import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';
import { DashboardStats } from '../../core/models/models';

interface StatCard { label: string; icon: string; color: string; key: keyof DashboardStats; route: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h1 class="page-title">Dashboard</h1>

    <div *ngIf="loading" class="spinner-center"><mat-spinner diameter="48"/></div>

    <div class="stat-grid" *ngIf="!loading && stats">
      <mat-card class="stat-card" *ngFor="let c of cards" [style.--accent]="c.color" [routerLink]="c.route">
        <mat-card-content>
          <div class="stat-icon-wrap">
            <mat-icon>{{ c.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats[c.key] }}</div>
            <div class="stat-label">{{ c.label }}</div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card class="info-card" *ngIf="!loading">
      <mat-card-header>
        <mat-card-title>Quick Actions</mat-card-title>
      </mat-card-header>
      <mat-card-content class="actions-row">
        <button mat-raised-button color="primary" routerLink="/internships">+ New Internship</button>
        <button mat-raised-button color="primary" routerLink="/applications">+ New Application</button>
        <button mat-raised-button color="primary" routerLink="/certificates">+ Issue Certificate</button>
        <button mat-raised-button color="primary" routerLink="/events">+ New Event</button>
        <button mat-stroked-button color="accent" routerLink="/verify">Verify Certificate</button>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-title { font-size: 1.6rem; font-weight: 600; margin-bottom: 24px; color: #311b92; }
    .spinner-center { display:flex; justify-content:center; padding:60px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 28px; }
    .stat-card { cursor: pointer; transition: transform .2s; border-top: 4px solid var(--accent); }
    .stat-card:hover { transform: translateY(-3px); }
    mat-card-content { display: flex; align-items: center; gap: 16px; padding: 20px !important; }
    .stat-icon-wrap { width: 52px; height: 52px; border-radius: 50%; background: var(--accent); display:flex; align-items:center; justify-content:center;
      mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; } }
    .stat-value { font-size: 2rem; font-weight: 700; color: #1a1a2e; }
    .stat-label { font-size: .85rem; color: #666; margin-top: 2px; }
    .info-card { margin-top: 8px; }
    .actions-row { display: flex; gap: 12px; flex-wrap: wrap; padding: 16px !important; }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats: DashboardStats | null = null;
  loading = true;

  cards: StatCard[] = [
    { label: 'Certificates',  icon: 'card_membership', color: '#7c3aed', key: 'certificates',  route: '/certificates' },
    { label: 'Internships',   icon: 'work',            color: '#2563eb', key: 'internships',   route: '/internships' },
    { label: 'Applications',  icon: 'description',     color: '#d97706', key: 'applications',  route: '/applications' },
    { label: 'Events',        icon: 'event',           color: '#059669', key: 'events',        route: '/events' },
  ];

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next : s => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
