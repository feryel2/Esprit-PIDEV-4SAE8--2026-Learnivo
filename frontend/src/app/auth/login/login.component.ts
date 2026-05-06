import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Learnivo Login</h1>
        <p>Entrez votre email pour vous connecter (Étudiant ou Professeur)</p>
        
        <div class="form-group">
          <input type="email" [(ngModel)]="email" placeholder="Email" class="form-control">
        </div>
        
        <button (click)="login()" class="btn-login" [disabled]="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
        
        <div *ngIf="error" class="error-msg">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    h1 { margin-bottom: 0.5rem; color: #333; }
    p { color: #666; margin-bottom: 2rem; font-size: 0.9rem; }
    .form-control {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }
    .btn-login {
      width: 100%;
      padding: 0.8rem;
      background: #764ba2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
    }
    .btn-login:hover { background: #5a3a7a; }
    .btn-login:disabled { background: #ccc; }
    .error-msg { color: #e53e3e; margin-top: 1rem; font-size: 0.9rem; }
  `]
})
export class LoginComponent {
  email = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email) return;
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.email).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Email non trouvé ou erreur serveur.';
      }
    });
  }
}
