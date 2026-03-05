import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Internship, InternshipRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class InternshipService {
  constructor(private http: HttpClient) {}

  list(): Observable<Internship[]> {
    return this.http.get<Internship[]>('/api/internships');
  }

  get(id: number): Observable<Internship> {
    return this.http.get<Internship>(`/api/internships/${id}`);
  }

  create(dto: InternshipRequest): Observable<Internship> {
    return this.http.post<Internship>('/api/internships', dto);
  }

  update(id: number, dto: InternshipRequest): Observable<Internship> {
    return this.http.put<Internship>(`/api/internships/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/internships/${id}`);
  }

  validate(id: number): Observable<Internship> {
    return this.http.put<Internship>(`/api/internships/${id}/validate`, {});
  }
}
