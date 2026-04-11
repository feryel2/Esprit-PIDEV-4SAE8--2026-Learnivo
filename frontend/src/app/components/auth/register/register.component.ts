import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  roles = [Role.STUDENT, Role.SOCIETY_AGENT];
  recaptchaSiteKey = environment.recaptchaSiteKey;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [Role.STUDENT, [Validators.required]],
      societyName: [''],
      societyEmail: [''],
      societyPhone: [''],
      societyAddress: [''],
      recaptchaToken: ['', Validators.required],
    });

    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === Role.SOCIETY_AGENT) {
        this.registerForm
          .get('societyName')
          ?.setValidators([Validators.required]);
        this.registerForm
          .get('societyEmail')
          ?.setValidators([Validators.required, Validators.email]);
      } else {
        this.registerForm.get('societyName')?.clearValidators();
        this.registerForm.get('societyEmail')?.clearValidators();
      }
      this.registerForm.get('societyName')?.updateValueAndValidity();
      this.registerForm.get('societyEmail')?.updateValueAndValidity();
    });
  }

  get isSocietyAgent(): boolean {
    return this.registerForm.get('role')?.value === Role.SOCIETY_AGENT;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.error = '';
      const formValue = this.registerForm.value;
      const request: any = {
        email: formValue.email,
        password: formValue.password,
        role: formValue.role,
        recaptchaToken: formValue.recaptchaToken,
      };

      if (formValue.role === Role.SOCIETY_AGENT) {
        request.societyName = formValue.societyName;
        request.societyEmail = formValue.societyEmail;
        request.societyPhone = formValue.societyPhone;
        request.societyAddress = formValue.societyAddress;
      }

      this.authService.register(request).subscribe({
        next: () => {
          alert('Registration successful! Please check your email to verify your account.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.error || 'Registration failed';
        },
      });
    }
  }
}

