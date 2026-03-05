import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoadingService } from './core/interceptors/api.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule, NgIf, AsyncPipe],
  template: `
    <div class="loading-bar" *ngIf="loader.loading()">
      <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
    </div>
    <router-outlet />
  `,
  styles: [`
    .loading-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
    }
  `]
})
export class AppComponent {
  loader = inject(LoadingService);
}
