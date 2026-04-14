import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          const user = this.authService.getCurrentUser();
          const role = user?.role;
          if (role === Role.ADMIN) {
            this.router.navigate(['/admin']);
          } else if (role === Role.PROFESSOR) {
            this.router.navigate(['/professor']);
          } else if (role === Role.STUDENT) {
            this.router.navigate(['/courses']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          this.error = err.error?.error || 'Login failed';
        },
      });
    }
  }
}
