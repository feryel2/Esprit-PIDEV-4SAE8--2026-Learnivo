import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  isPublicPage = false;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const publicPages = ['/login', '/register', '/verify'];
      this.isPublicPage = publicPages.some(page => event.url.startsWith(page)) || event.url === '/';
    });
  }

  get showSidebar(): boolean {
    return this.authService.isAuthenticated() && !this.isPublicPage;
  }
}
