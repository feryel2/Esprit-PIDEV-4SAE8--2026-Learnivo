import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipApplication, InternshipApplicationRequest, UpdateApplicationStatusRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private http: HttpClient) {}

  list(): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>('/api/applications');
  }

  get(id: number): Observable<InternshipApplication> {
    return this.http.get<InternshipApplication>(`/api/applications/${id}`);
  }

  create(dto: InternshipApplicationRequest): Observable<InternshipApplication> {
    return this.http.post<InternshipApplication>('/api/applications', dto);
  }

  update(id: number, dto: InternshipApplicationRequest): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`/api/applications/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/applications/${id}`);
  }

  updateStatus(id: number, dto: UpdateApplicationStatusRequest): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`/api/applications/${id}/status`, dto);
  }
}
