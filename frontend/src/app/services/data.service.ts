import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// ─── Interfaces (identiques template) ────────────────────────────────────────

export interface Training {
  id: number | string; title: string; description: string; type: string;
  level: string; price: number; image: string; slug: string; action: string;
  instructor?: string; category?: string; chapters?: number; duration?: string;
  banner?: string;
  chaptersData?: { name: string; number: number; sections: { name: string; completed: boolean }[] }[];
}
export interface Club {
  id: number | string; name: string; icon: string; description: string;
  image: string; slug: string; members?: number; images?: string[];
}
export interface PlatformEvent {
  id: number | string; title: string; description: string; date: string;
  location: string; time: string; image: string; badge: string; slug: string;
  type?: 'past' | 'next'; overview?: string; expectations?: string[]; album?: string[];
}
export interface Participant {
  id: number | string; name: string; email: string; registeredAt: string;
  score?: number; status: 'registered' | 'disqualified' | 'winner';
  submissionUrl?: string; submissionNotes?: string; submittedAt?: string;
}
export interface CompetitionRound {
  name: string; startDate: string; endDate: string;
  status: 'pending' | 'active' | 'done';
}
export interface Competition {
  id: number | string; title: string; description: string; image: string;
  slug: string; status: 'upcoming' | 'ongoing' | 'completed';
  startDate?: string; deadline: string; prize: string; category: string; tags?: string[];
  maxParticipants?: number; participants?: Participant[];
  rounds?: CompetitionRound[]; rules?: string; resultsPublished?: boolean;
}
export interface VoteStats {
  likes: number;
  dislikes: number;
  score: number;
  userVote: 'LIKE' | 'DISLIKE' | null;
}

export interface Announcement {
  id: number;
  competitionId: number;
  title: string;
  content: string;
  type: 'INFO' | 'REMINDER' | 'RESULT' | 'ALERT';
  createdAt: string;
}

export interface CompetitionRanking {
  competitionId: number;
  title: string;
  category: string;
  prize: string;
  image: string;
  slug: string;
  status: string;
  likes: number;
  dislikes: number;
  score: number;
  participantCount: number;
  rank: number;
}

export interface AttendanceRecord {
  date: string; attendees: (number | string)[];
}
export interface EnrolledStudent {
  id: number | string; name: string; email: string; enrolledAt: string;
}
export interface ClassMaterial {
  title: string; url: string; type: 'pdf' | 'video' | 'link' | 'slide';
}
export interface PlatformClass {
  id: number | string; title: string; instructor: string; day: string;
  time: string; duration: string; level: string; type: string; link?: string;
  status: 'active' | 'cancelled' | 'full'; maxCapacity?: number;
  enrolled?: EnrolledStudent[]; attendance?: AttendanceRecord[];
  materials?: ClassMaterial[]; recurring?: boolean; notes?: string;
}

// ─── Mapping back → front ────────────────────────────────────────────────────
// Adapte les noms de champs selon ton entité Java exacte

function toClass(b: any): PlatformClass {
  return {
    id:          b.id,
    title:       b.title       ?? b.titre       ?? '',
    instructor:  b.instructor  ?? b.instructeur  ?? '',
    day:         b.day         ?? b.jour         ?? 'Monday',
    time:        b.time        ?? b.heure        ?? '',
    duration:    b.duration    ?? b.duree        ?? '',
    level:       b.level       ?? b.niveau       ?? '',
    type:        b.type        ?? 'Live Class',
    link:        b.link        ?? b.lien         ?? '',
    status:      (b.status     ?? b.statut       ?? 'active').toLowerCase(),
    maxCapacity: b.maxCapacity ?? b.capaciteMax  ?? 20,
    recurring:   b.recurring   ?? b.recurrent    ?? true,
    notes:       b.notes       ?? '',
    enrolled: (b.enrolled ?? b.inscrits ?? []).map((s: any) => ({
      id: s.id, name: s.name ?? s.nom ?? '',
      email: s.email ?? '', enrolledAt: s.enrolledAt ?? s.dateInscription ?? ''
    })),
    attendance: (b.attendance ?? b.presences ?? []).map((r: any) => ({
      date: r.date, attendees: r.attendees ?? r.presents ?? []
    })),
    materials: (b.materials ?? b.materiaux ?? []).map((m: any) => ({
      title: m.title ?? m.titre ?? '', url: m.url ?? '', type: m.type ?? 'link'
    })),
  };
}

function fromClass(c: Omit<PlatformClass, 'id'>): any {
  return {
    title: c.title, instructor: c.instructor, day: c.day, time: c.time,
    duration: c.duration, level: c.level, type: c.type, link: c.link,
    status: c.status?.toUpperCase(), maxCapacity: c.maxCapacity,
    recurring: c.recurring, notes: c.notes,
  };
}

function toComp(b: any): Competition {
  return {
    id:               b.id,
    title:            b.title          ?? b.titre      ?? b.nom ?? '',
    description:      b.description    ?? '',
    image:            b.image          ?? '/images/event-1.jpg',
    slug:             b.slug           ?? String(b.id),
    status:           (b.status        ?? b.statut     ?? 'upcoming').toLowerCase(),
    deadline:         b.deadline       ?? b.dateFin    ?? '',
    prize:            b.prize          ?? b.recompense ?? '',
    category:         b.category       ?? b.categorie  ?? '',
    tags:             b.tags           ?? [],
    startDate:        b.startDate      ?? '',
    maxParticipants:  b.maxParticipants ?? 0,
    resultsPublished: b.resultsPublished ?? b.resultatsPublies ?? false,
    rules:            b.rules          ?? b.regles     ?? '',
    rounds: (b.rounds ?? []).map((r: any) => ({
      name: r.name ?? r.nom ?? '',
      startDate: r.startDate ?? r.dateDebut ?? '',
      endDate: r.endDate ?? r.dateFin ?? '',
      status: (r.status ?? 'pending').toLowerCase()
    })),
    participants: (b.participants ?? []).map((p: any) => ({
      id: p.id, name: p.name ?? p.nom ?? '', email: p.email ?? '',
      registeredAt: p.registeredAt ?? p.dateInscription ?? '',
      score: p.score,
      status: (p.status ?? p.statut ?? 'registered').toLowerCase(),
      submissionUrl: p.submissionUrl ?? null,
      submissionNotes: p.submissionNotes ?? null,
      submittedAt: p.submittedAt ?? null,
    })),
  };
}

function fromComp(c: Omit<Competition, 'id'>): any {
  return {
    title: c.title, description: c.description, image: c.image, slug: c.slug,
    status: c.status?.toUpperCase(), startDate: c.startDate, deadline: c.deadline,
    prize: c.prize, category: c.category, tags: c.tags, maxParticipants: c.maxParticipants,
    rules: c.rules, resultsPublished: c.resultsPublished, rounds: c.rounds,
    participants: c.participants,
  };
}

// ─── API URLs ─────────────────────────────────────────────────────────────────
const CLASS_API = 'http://localhost:8081/api';
const COMP_API  = 'http://localhost:8082/api';

// ─── Service ──────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {
    this.loadClasses();
    this.loadCompetitions();
  }

  classes      = signal<PlatformClass[]>([]);
  competitions = signal<Competition[]>([]);

  // Données locales (hors scope phase 1 — inchangées)
  trainings = signal<Training[]>([
    { id: 1, title: 'Speak Fluent English in 30 Days', description: 'Real-world conversations.', type: 'Blended training', level: 'Beginner', price: 350, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'speak-fluent-english', action: 'Purchase', instructor: 'Dr. Sarah Wilson', category: 'Speaking', chapters: 12, duration: '4 weeks' },
    { id: 2, title: 'The Ultimate English Writing Masterclass', description: 'From Beginner to Pro!', type: 'Live classes', level: 'Mid-level', price: 369, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'english-writing-masterclass', action: 'Book your place', instructor: 'Mark Thompson', category: 'Writing', chapters: 15, duration: '6 weeks' },
    { id: 3, title: 'Accent Makeover', description: 'Sound Like a Native in Just Weeks!', type: 'Live classes', level: 'Advanced', price: 1400, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'accent-makeover', action: 'Purchase', instructor: 'Emma Watson', category: 'Pronunciation', chapters: 10, duration: '3 weeks' },
    { id: 4, title: 'Master English for Work', description: 'Speak, Write & Impress Like a Pro!', type: 'Blended training', level: 'Beginner', price: 450, image: '/images/event-1.jpg', banner: '/images/course-banner.jpg', slug: 'master-english-for-work', action: 'Purchase', instructor: 'James Bond', category: 'Business', chapters: 20, duration: '8 weeks' },
  ]);
  clubs = signal<Club[]>([
    { id: 1, name: 'English Conversation Club', icon: '💬', description: 'Practice speaking with peers.', image: '/images/club-1.jpg', slug: 'english-conversation-club', members: 156, images: ['/images/club-1.jpg', '/images/training-1.jpg'] },
    { id: 2, name: 'Book & Storytelling Club', icon: '📚', description: 'Improve reading skills.', image: '/images/training-1.jpg', slug: 'book-storytelling-club', members: 89 },
    { id: 3, name: 'Drama & Roleplay Club', icon: '🎭', description: 'Boost confidence.', image: '/images/training-2.jpg', slug: 'drama-roleplay-club', members: 45 },
    { id: 4, name: 'Writing & Grammar Club', icon: '✍️', description: 'Enhance your writing skills.', image: '/images/training-3.jpg', slug: 'writing-grammar-club', members: 72 },
  ]);
  events = signal<PlatformEvent[]>([
    { id: 1, title: 'Freelancer & Entrepreneur Networking Night', description: 'Hands-on training.', date: 'Friday, 16 August 2025', location: 'Technopole, Sousse, Tunisia', time: 'from 11:00 am to 18:30 pm', image: '/images/event-1.jpg', badge: 'Past event', slug: 'freelancer-networking-night', type: 'past', overview: 'Real hands-on experience!', expectations: ['Hands-on Workshops', 'Expert-Led Sessions', 'Networking & Collaboration'], album: ['/images/album-1.jpg', '/images/album-2.jpg'] },
    { id: 2, title: 'Mastering Contracts Workshop', description: 'Professional communication.', date: 'Saturday, 2 December 2025', location: 'Ambassadeurs Hotel, Tunis', time: 'from 11:00 am to 14:45 pm', image: '/images/training-1.jpg', badge: 'Past event', slug: 'mastering-contracts-workshop', type: 'past' },
    { id: 3, title: 'Skill Up: Online Workshop Series', description: 'Latest gatherings.', date: '12 Jan, 2025', location: 'Technopole, Sousse, Tunisia', time: 'from 11:00 am to 18:30 pm', image: '/images/event-3.jpg', badge: 'Next event', slug: 'skill-up-online-workshop', type: 'next' },
  ]);

  // ── CLASSES HTTP ───────────────────────────────────────────────────────────

  loadClasses(): void {
    this.http.get<any[]>(`${CLASS_API}/classes`).pipe(
      catchError(() => of([]))
    ).subscribe(data => this.classes.set(data.map(toClass)));
  }

  addClass(pc: PlatformClass): void {
    this.http.post<any>(`${CLASS_API}/classes`, fromClass(pc)).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.classes.update(list => [...list, toClass(res)]);
    });
  }

  updateClass(pc: PlatformClass): void {
    // Optimistic update
    this.classes.update(list => list.map(c => c.id === pc.id ? pc : c));
    this.http.put<any>(`${CLASS_API}/classes/${pc.id}`, fromClass(pc)).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.classes.update(list => list.map(c => c.id === pc.id ? toClass(res) : c));
    });
  }

  deleteClass(id: number | string): void {
    this.classes.update(list => list.filter(c => c.id !== id));
    this.http.delete(`${CLASS_API}/classes/${id}`).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  /** User public — inscription à une classe */
  joinClass(classId: number | string, name: string, email: string): string | null {
    const cls = this.classes().find(c => c.id === classId);
    if (!cls) return 'Class not found.';
    if (cls.status === 'cancelled') return 'This class has been cancelled.';
    if ((cls.enrolled ?? []).some(s => s.email.toLowerCase() === email.toLowerCase()))
      return 'You are already enrolled in this class.';
    if ((cls.enrolled ?? []).length >= (cls.maxCapacity ?? Infinity))
      return 'Sorry, this class is full.';

    const student: EnrolledStudent = {
      id: Date.now(), name, email, enrolledAt: new Date().toISOString().slice(0, 10)
    };
    const newStatus: PlatformClass['status'] =
      (cls.enrolled ?? []).length + 1 >= (cls.maxCapacity ?? Infinity) ? 'full' : cls.status;
    const updated = { ...cls, enrolled: [...(cls.enrolled ?? []), student], status: newStatus };
    this.classes.update(list => list.map(c => c.id === classId ? updated : c));

    // Appel REST arrière-plan
    this.http.post(`${CLASS_API}/classes/${classId}/enroll`, { name, email }).pipe(
      catchError(() => of(null))
    ).subscribe();
    return null;
  }

  // ── COMPETITIONS HTTP ──────────────────────────────────────────────────────

  loadCompetitions(): void {
    this.http.get<any[]>(`${COMP_API}/competitions`).pipe(
      catchError(() => of([]))
    ).subscribe(data => this.competitions.set(data.map(toComp)));
  }

  addCompetition(comp: Competition): void {
    this.http.post<any>(`${COMP_API}/competitions`, fromComp(comp)).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.competitions.update(list => [...list, toComp(res)]);
      else this.competitions.update(list => [...list, { ...comp, id: Date.now() }]);
    });
  }

  updateCompetition(comp: Competition): void {
    this.competitions.update(list => list.map(c => c.id === comp.id ? comp : c));
    this.http.put<any>(`${COMP_API}/competitions/${comp.id}`, fromComp(comp)).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.competitions.update(list => list.map(c => c.id === comp.id ? toComp(res) : c));
    });
  }

  deleteCompetition(id: number | string): void {
    this.competitions.update(list => list.filter(c => c.id !== id));
    this.http.delete(`${COMP_API}/competitions/${id}`).pipe(
      catchError(() => of(null))
    ).subscribe();
  }

  /** User public — inscription à une compétition */
  registerForCompetition(competitionId: number | string, name: string, email: string): string | null {
    const comp = this.competitions().find(c => c.id === competitionId);
    if (!comp) return 'Competition not found.';
    if (comp.status === 'completed') return 'This competition has already ended.';
    if ((comp.participants ?? []).some(p => p.email.toLowerCase() === email.toLowerCase()))
      return 'This email is already registered for this competition.';
    if ((comp.participants ?? []).length >= (comp.maxParticipants ?? Infinity))
      return 'Sorry, registrations are closed — maximum capacity reached.';

    const newP: Participant = {
      id: Date.now(), name, email,
      registeredAt: new Date().toISOString().slice(0, 10), status: 'registered'
    };
    const updated = { ...comp, participants: [...(comp.participants ?? []), newP] };
    this.competitions.update(list => list.map(c => c.id === competitionId ? updated : c));

    this.http.post(`${COMP_API}/competitions/${competitionId}/register`, { name, email }).pipe(
      catchError(() => of(null))
    ).subscribe();
    return null;
  }

  // ── VOTES & CLASSEMENT ─────────────────────────────────────────────────────

  /** Vote LIKE ou DISLIKE sur une compétition (toggle si même vote) */
  voteCompetition(competitionId: number | string, email: string, voteType: 'LIKE' | 'DISLIKE') {
    return this.http.post<VoteStats>(
      `${COMP_API}/competitions/${competitionId}/vote`,
      { email, voteType }
    ).pipe(catchError(() => of(null)));
  }

  /** Récupère les stats de votes pour une compétition */
  getVoteStats(competitionId: number | string, email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.http.get<VoteStats>(
      `${COMP_API}/competitions/${competitionId}/votes${params}`
    ).pipe(catchError(() => of({ likes: 0, dislikes: 0, score: 0, userVote: null } as VoteStats)));
  }

  /** Soumission de projet d'un participant */
  submitProject(competitionId: number | string, email: string, submissionUrl: string, submissionNotes: string) {
    return this.http.post<Participant>(
      `${COMP_API}/competitions/${competitionId}/submit`,
      { email, submissionUrl, submissionNotes }
    ).pipe(catchError(() => of(null)));
  }

  /** Classement global des compétitions par popularité */
  getCompetitionRanking() {
    return this.http.get<CompetitionRanking[]>(`${COMP_API}/competitions/ranking`)
      .pipe(catchError(() => of([])));
  }

  // ── ANNONCES (news feed) ───────────────────────────────────────────────────

  /** Récupère les annonces d'une compétition (ordre antéchronologique) */
  getAnnouncements(competitionId: number | string) {
    return this.http.get<Announcement[]>(
      `${COMP_API}/competitions/${competitionId}/announcements`
    ).pipe(catchError(() => of([] as Announcement[])));
  }

  /** Poste une nouvelle annonce (admin) */
  postAnnouncement(competitionId: number | string, title: string, content: string, type: string) {
    return this.http.post<Announcement>(
      `${COMP_API}/competitions/${competitionId}/announcements`,
      { title, content, type }
    ).pipe(catchError(() => of(null)));
  }

  /** Supprime une annonce (admin) */
  deleteAnnouncement(announcementId: number) {
    return this.http.delete(
      `${COMP_API}/competitions/announcements/${announcementId}`
    ).pipe(catchError(() => of(null)));
  }

  // ── CRUD local trainings/clubs/events (inchangé) ───────────────────────────
  addTraining(t: Training)            { this.trainings.update(x => [...x, { ...t, id: Date.now() }]); }
  updateTraining(t: Training)         { this.trainings.update(x => x.map(i => i.id === t.id ? t : i)); }
  deleteTraining(id: number | string) { this.trainings.update(x => x.filter(i => i.id !== id)); }
}
