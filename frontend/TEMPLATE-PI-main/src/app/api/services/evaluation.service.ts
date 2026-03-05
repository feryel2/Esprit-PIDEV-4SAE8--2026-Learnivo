import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipEvaluation, InternshipEvaluationRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  constructor(private http: HttpClient) {}

  list(): Observable<InternshipEvaluation[]> {
    return this.http.get<InternshipEvaluation[]>('/api/internship-evaluations');
  }

  get(id: number): Observable<InternshipEvaluation> {
    return this.http.get<InternshipEvaluation>(`/api/internship-evaluations/${id}`);
  }

  create(dto: InternshipEvaluationRequest): Observable<InternshipEvaluation> {
    return this.http.post<InternshipEvaluation>('/api/internship-evaluations', dto);
  }

  update(id: number, dto: InternshipEvaluationRequest): Observable<InternshipEvaluation> {
    return this.http.put<InternshipEvaluation>(`/api/internship-evaluations/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/internship-evaluations/${id}`);
  }
}
