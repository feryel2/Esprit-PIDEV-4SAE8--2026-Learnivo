import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserCreate {
  email: string;
  password: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  societyName?: string;
  societyEmail?: string;
  societyPhone?: string;
  societyAddress?: string;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  role?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  societyName?: string;
  societyEmail?: string;
  societyPhone?: string;
  societyAddress?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 0, size: number = 20): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<User>>(this.apiUrl, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserCreate): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
