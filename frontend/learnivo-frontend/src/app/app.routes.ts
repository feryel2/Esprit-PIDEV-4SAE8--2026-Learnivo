import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard',    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'internships',  loadComponent: () => import('./features/internships/internships.component').then(m => m.InternshipsComponent) },
      { path: 'applications', loadComponent: () => import('./features/applications/applications.component').then(m => m.ApplicationsComponent) },
      { path: 'certificates', loadComponent: () => import('./features/certificates/certificates.component').then(m => m.CertificatesComponent) },
      { path: 'events',       loadComponent: () => import('./features/events/events.component').then(m => m.EventsComponent) },
    ]
  },
  { path: 'verify', loadComponent: () => import('./features/verify/verify.component').then(m => m.VerifyComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
