import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AdminHeaderComponent } from './admin-header.component';
import { NotificationToastComponent } from './notification-toast.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, AdminHeaderComponent, NotificationToastComponent],
    template: `
    <div class="min-h-screen bg-admin-mesh flex">
      <app-sidebar></app-sidebar>
      <div class="flex-1 pl-64 flex flex-col min-h-screen relative z-0">
        <!-- Floating Header -->
        <app-admin-header class="sticky top-0 z-40"></app-admin-header>
        
        <main class="flex-1 p-10">
            <div class="max-w-[1400px] mx-auto">
                <router-outlet></router-outlet>
            </div>
        </main>
      </div>
      <app-notification-toast></app-notification-toast>
    </div>
  `
})
export class AdminLayoutComponent { }
