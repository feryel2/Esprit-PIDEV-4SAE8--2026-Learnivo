import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipOffer, InternshipOfferRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class OfferService {
  constructor(private http: HttpClient) {}

  list(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>('/api/offers');
  }

  get(id: number): Observable<InternshipOffer> {
    return this.http.get<InternshipOffer>(`/api/offers/${id}`);
  }

  create(dto: InternshipOfferRequest): Observable<InternshipOffer> {
    return this.http.post<InternshipOffer>('/api/offers', dto);
  }

  update(id: number, dto: InternshipOfferRequest): Observable<InternshipOffer> {
    return this.http.put<InternshipOffer>(`/api/offers/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/offers/${id}`);
  }
}
