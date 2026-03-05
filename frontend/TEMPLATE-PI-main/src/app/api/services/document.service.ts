import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipDocument, InternshipDocumentRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private http: HttpClient) {}

  list(): Observable<InternshipDocument[]> {
    return this.http.get<InternshipDocument[]>('/api/internship-documents');
  }

  get(id: number): Observable<InternshipDocument> {
    return this.http.get<InternshipDocument>(`/api/internship-documents/${id}`);
  }

  create(dto: InternshipDocumentRequest): Observable<InternshipDocument> {
    return this.http.post<InternshipDocument>('/api/internship-documents', dto);
  }

  update(id: number, dto: InternshipDocumentRequest): Observable<InternshipDocument> {
    return this.http.put<InternshipDocument>(`/api/internship-documents/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/internship-documents/${id}`);
  }

  validate(id: number, value: boolean): Observable<InternshipDocument> {
    return this.http.put<InternshipDocument>(`/api/internship-documents/${id}/validate?value=${value}`, {});
  }
}
