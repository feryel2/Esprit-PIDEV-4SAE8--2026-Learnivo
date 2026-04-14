import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: response.userId,
              email: response.email,
              role: response.role,
            }),
          );
        }
      }),
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: response.userId,
              email: response.email,
              role: response.role,
            }),
          );
        }
      }),
    );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }

  verifyEmail(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/verify?token=${token}`, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear per-competition registration state so the next user starts clean
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('reg_comp_') || key === 'learnivo_voter_email')) {
        toRemove.push(key);
      }
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
