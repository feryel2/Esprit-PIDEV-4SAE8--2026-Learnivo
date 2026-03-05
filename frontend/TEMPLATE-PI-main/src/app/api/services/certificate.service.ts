import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificate, CertificateRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  constructor(private http: HttpClient) {}

  list(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>('/api/certificates', { params: { page: '0', size: '1000' } });
  }

  get(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`/api/certificates/${id}`);
  }

  create(dto: CertificateRequest): Observable<Certificate> {
    return this.http.post<Certificate>('/api/certificates', dto);
  }

  update(id: number, dto: CertificateRequest): Observable<Certificate> {
    return this.http.put<Certificate>(`/api/certificates/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/certificates/${id}`);
  }

  verify(code: string): Observable<any> {
    return this.http.get<any>(`/api/certificates/verify/${code}`);
  }

  downloadUrl(id: number): string {
    return `/api/certificates/${id}/download`;
  }

  qrCodeUrl(verificationCode: string): string {
    return `/api/certificates/qrcode/${verificationCode}.png`;
  }
}
