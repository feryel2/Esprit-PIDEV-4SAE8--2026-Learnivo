import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type UserRole = 'STUDENT' | 'TEACHER';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  redirectPath: string;
  token: string;
}

interface CurrentUserResponse {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  redirectPath: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'learnivo.auth-user';
  private readonly apiUrl = 'http://localhost:8080/api/auth/login';
  private readonly meUrl = 'http://localhost:8080/api/auth/me';
  private readonly currentUserSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly role = computed(() => this.currentUser()?.role ?? null);
  readonly isTeacher = computed(() => this.role() === 'TEACHER');
  readonly isStudent = computed(() => this.role() === 'STUDENT');
  readonly token = computed(() => this.currentUser()?.token ?? null);

  constructor() {
    if (this.currentUserSignal()) {
      void this.validateStoredSession();
    }
  }

  async login(payload: LoginPayload) {
    try {
      const user = await firstValueFrom(this.http.post<AuthUser>(this.apiUrl, payload));
      this.setCurrentUser(user);
      return user;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const message = typeof error.error?.message === 'string' && error.error.message.trim()
          ? error.error.message.trim()
          : 'Unable to sign in right now.';
        throw new Error(message);
      }

      throw error;
    }
  }

  logout() {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  hasRole(role: UserRole) {
    return this.currentUser()?.role === role;
  }

  getToken() {
    return this.currentUser()?.token ?? null;
  }

  async validateStoredSession() {
    const current = this.currentUser();
    if (!current) {
      return null;
    }

    try {
      const profile = await firstValueFrom(this.http.get<CurrentUserResponse>(this.meUrl));
      const refreshed: AuthUser = { ...profile, token: current.token };
      this.setCurrentUser(refreshed);
      return refreshed;
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        this.logout();
        return null;
      }

      throw error;
    }
  }

  private setCurrentUser(user: AuthUser) {
    this.currentUserSignal.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
