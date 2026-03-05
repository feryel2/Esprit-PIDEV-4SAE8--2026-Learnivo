import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Certificate, CertificateRequest, CertificateVerificationResponse,
  Internship, InternshipRequest,
  InternshipApplication, ApplicationRequest,
  AppEvent, EventRequest,
  DashboardStats
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ── Internships ────────────────────────────────────────
  listInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.base}/internships`);
  }
  createInternship(data: InternshipRequest): Observable<Internship> {
    return this.http.post<Internship>(`${this.base}/internships`, data);
  }
  updateInternship(id: number, data: InternshipRequest): Observable<Internship> {
    return this.http.put<Internship>(`${this.base}/internships/${id}`, data);
  }
  validateInternship(id: number): Observable<Internship> {
    return this.http.put<Internship>(`${this.base}/internships/${id}/validate`, {});
  }
  deleteInternship(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/internships/${id}`);
  }

  // ── Applications ───────────────────────────────────────
  listApplications(): Observable<InternshipApplication[]> {
    return this.http.get<InternshipApplication[]>(`${this.base}/applications`);
  }
  createApplication(data: ApplicationRequest): Observable<InternshipApplication> {
    return this.http.post<InternshipApplication>(`${this.base}/applications`, data);
  }
  updateApplication(id: number, data: Partial<ApplicationRequest> & { status?: string }): Observable<InternshipApplication> {
    return this.http.put<InternshipApplication>(`${this.base}/applications/${id}`, data);
  }
  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/applications/${id}`);
  }

  // ── Certificates ───────────────────────────────────────
  listCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.base}/certificates`);
  }
  createCertificate(data: CertificateRequest): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.base}/certificates`, data);
  }
  updateCertificate(id: number, data: CertificateRequest): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.base}/certificates/${id}`, data);
  }
  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/certificates/${id}`);
  }
  verifyCertificate(code: string): Observable<CertificateVerificationResponse> {
    return this.http.get<CertificateVerificationResponse>(`${this.base}/certificates/verify/${code}`);
  }
  downloadCertificateUrl(id: number): string {
    return `${this.base}/certificates/${id}/download`;
  }
  qrCodeUrl(verificationCode: string): string {
    return `${this.base}/certificates/qrcode/${verificationCode}.png`;
  }

  // ── Events ─────────────────────────────────────────────
  listEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.base}/events`);
  }
  createEvent(data: EventRequest): Observable<AppEvent> {
    return this.http.post<AppEvent>(`${this.base}/events`, data);
  }
  updateEvent(id: number, data: EventRequest): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.base}/events/${id}`, data);
  }
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/events/${id}`);
  }

  // ── Dashboard ──────────────────────────────────────────
  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      certificates : this.listCertificates(),
      internships  : this.listInternships(),
      applications : this.listApplications(),
      events       : this.listEvents()
    }).pipe(map(r => ({
      certificates : r.certificates.length,
      internships  : r.internships.length,
      applications : r.applications.length,
      events       : r.events.length
    })));
  }
}
