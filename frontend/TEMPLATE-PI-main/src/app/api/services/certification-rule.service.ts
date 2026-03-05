import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertificationRule, CertificationRuleRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CertificationRuleService {
  constructor(private http: HttpClient) {}

  list(): Observable<CertificationRule[]> {
    return this.http.get<CertificationRule[]>('/api/certification-rules');
  }

  get(id: number): Observable<CertificationRule> {
    return this.http.get<CertificationRule>(`/api/certification-rules/${id}`);
  }

  create(dto: CertificationRuleRequest): Observable<CertificationRule> {
    return this.http.post<CertificationRule>('/api/certification-rules', dto);
  }

  update(id: number, dto: CertificationRuleRequest): Observable<CertificationRule> {
    return this.http.put<CertificationRule>(`/api/certification-rules/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/certification-rules/${id}`);
  }
}
