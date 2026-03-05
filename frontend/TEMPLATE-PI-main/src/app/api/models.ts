// Generated from OpenAPI spec (subset used by frontend)

export type InternshipOfferStatus = 'OPEN' | 'CLOSED';
export interface InternshipOfferRequest {
  title: string;
  company: string;
  location?: string;
  deadline: string; // date
  status?: InternshipOfferStatus;
}
export interface InternshipOffer {
  id: number;
  title: string;
  company: string;
  location?: string;
  deadline: string; // date
  status: InternshipOfferStatus;
  createdAt?: string; // date-time
}

export type InternshipStatus = 'IN_PROGRESS' | 'FINISHED' | 'VALIDATED';
export interface InternshipRequest {
  startDate: string; // date
  endDate: string; // date
  objectives?: string;
  status?: InternshipStatus;
  tutorName?: string;
}
export interface Internship {
  id: number;
  startDate: string;
  endDate: string;
  objectives?: string;
  status: InternshipStatus;
  tutorName?: string;
  application?: InternshipApplication;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export interface InternshipApplicationRequest {
  offerId: number;
  studentName: string;
  cvUrl?: string;
  motivation?: string;
}
export interface InternshipApplication {
  id: number;
  studentName: string;
  cvUrl?: string;
  motivation?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  offer?: InternshipOffer;
}

export interface InternshipEvaluationRequest {
  score?: number;
  feedback?: string;
  internshipId: number;
}
export interface InternshipEvaluation {
  id: number;
  score: number;
  feedback?: string;
  evaluatedAt: string;
  internship: Internship;
}

export type InternshipDocumentType = 'CONVENTION' | 'REPORT' | 'PRESENTATION';
export interface InternshipDocumentRequest {
  type: InternshipDocumentType;
  url: string;
  comment?: string;
  internshipId: number;
}
export interface InternshipDocument {
  id: number;
  type: InternshipDocumentType;
  url: string;
  uploadedAt?: string;
  comment?: string;
  validated?: boolean;
  internship: Internship;
}

export interface EventRequest {
  title: string;
  description?: string;
  startTime: string; // date-time
  endTime: string;   // date-time
  location?: string;
  status: string;
}
export interface Event {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: string;
  createdAt?: string;
}

export type CertificateType = 'LEVEL' | 'PARTICIPATION' | 'INTERNSHIP';
export type CertificateStatus = 'ISSUED' | 'REVOKED' | 'EXPIRED';
export interface CertificationRuleRequest {
  name: string;
  certificateType: CertificateType;
  minScore?: number;
  minAttendanceRate?: number;
  minHours?: number;
  active?: boolean;
}
export interface CertificationRule {
  id: number;
  name: string;
  certificateType: CertificateType;
  minScore: number;
  minAttendanceRate: number;
  minHours: number;
  active: boolean;
}

export interface CertificateRequest {
  studentName: string;
  certificateNumber: string;
  type: CertificateType;
  status: CertificateStatus;
  issuedAt: string; // date
  pdfUrl?: string;
  qrCodeUrl?: string;
  internshipId?: number;
}
export interface Certificate {
  id: number;
  studentName: string;
  certificateNumber: string;
  type: CertificateType;
  status: CertificateStatus;
  issuedAt: string;
  pdfUrl?: string;
  verificationCode?: string;
  qrCodeUrl?: string;
  internshipId?: number;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export interface CertificateVerificationRequest {
  certificateId: number;
  verifierIp?: string;
  verifierUserAgent?: string;
}
export interface CertificateVerification {
  id: number;
  verifiedAt: string;
  verifierIp?: string;
  verifierUserAgent?: string;
  result: boolean;
  certificate: Certificate;
}
