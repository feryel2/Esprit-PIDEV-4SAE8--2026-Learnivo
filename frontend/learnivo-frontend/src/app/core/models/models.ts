// ── Internship ──────────────────────────────────────────
export interface Internship {
  id: number;
  title: string;
  companyName: string;
  studentName: string;
  startDate: string;
  endDate: string;
  description?: string;
  validated?: boolean;
}

export interface InternshipRequest {
  title: string;
  companyName: string;
  studentName: string;
  startDate: string;
  endDate: string;
  description?: string;
}

// ── Application ─────────────────────────────────────────
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InternshipApplication {
  id: number;
  internshipId: number;
  studentName: string;
  studentEmail: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  internship?: Internship;
}

export interface ApplicationRequest {
  internshipId: number;
  studentName: string;
  studentEmail: string;
  coverLetter?: string;
}

// ── Certificate ─────────────────────────────────────────
export type CertificateType   = 'INTERNSHIP' | 'TRAINING' | 'COMPLETION' | 'LEVEL' | 'PARTICIPATION';
export type CertificateStatus = 'ISSUED' | 'REVOKED' | 'EXPIRED';

export interface Certificate {
  id: number;
  studentName: string;
  certificateNumber: string;
  verificationCode?: string;
  type: CertificateType;
  status: CertificateStatus;
  issuedAt: string;
  pdfUrl?: string;
  qrCodeUrl?: string;
  internshipId?: number;
}

export interface CertificateRequest {
  studentName: string;
  certificateNumber: string;
  type: CertificateType;
  issuedAt: string;
  internshipId?: number;
}

export interface CertificateVerificationResponse {
  studentName: string;
  certificateTitle: string;
  certificateNumber: string;
  verificationCode: string;
  issueDate: string;
  type: CertificateType;
  valid: boolean;
}

// ── Event ────────────────────────────────────────────────
export interface AppEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  date: string;
  location?: string;
}

// ── Dashboard stats ──────────────────────────────────────
export interface DashboardStats {
  certificates: number;
  internships: number;
  applications: number;
  events: number;
}
