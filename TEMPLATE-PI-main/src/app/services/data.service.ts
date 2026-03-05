import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Observable, map, of, catchError } from 'rxjs';

export interface Training {
    id: number | string;
    title: string;
    description: string;
    type: string;
    level: string;
    price: number;
    image: string;
    slug: string;
    action: string;
    instructor?: string;
    category?: string;
    chapters?: number;
    duration?: string;
    banner?: string;
    chaptersData?: {
        name: string;
        number: number;
        sections: { name: string; completed: boolean }[];
    }[];
}

export interface Club {
    id: number | string;
    name: string;
    icon: string;
    description: string;
    image: string;
    slug: string;
    members?: number;
    images?: string[];
}

export interface PlatformEvent {
    id: number | string;
    title: string;
    description: string;
    date: string;
    location: string;
    time: string;
    image: string;
    badge: string;
    slug: string;
    type?: 'past' | 'next';
    overview?: string;
    expectations?: string[];
    album?: string[];
    price?: number;
    maxParticipants?: number;
    registeredParticipants?: number;
    clubId?: number;
    clubName?: string;
    isPublic?: boolean;
    status?: string;
    startTime?: string;
    endTime?: string;
    publishAt?: string | null;
}

export interface Participant {
    id: number | string;
    name: string;
    email: string;
    registeredAt: string;
    score?: number;
    status: 'registered' | 'disqualified' | 'winner';
}

export interface CompetitionRound {
    name: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'active' | 'done';
}

export interface Competition {
    id: number | string;
    title: string;
    description: string;
    image: string;
    slug: string;
    status: 'upcoming' | 'ongoing' | 'completed';
    deadline: string;
    prize: string;
    category: string;
    tags?: string[];
    maxParticipants?: number;
    participants?: Participant[];
    rounds?: CompetitionRound[];
    rules?: string;
    resultsPublished?: boolean;
}

export interface AttendanceRecord {
    date: string;          // ISO date string e.g. "2025-03-03"
    attendees: (number | string)[];  // list of enrolled student ids who attended
}

export interface EnrolledStudent {
    id: number | string;
    name: string;
    email: string;
    enrolledAt: string;
}

export interface ClassMaterial {
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'slide';
}

export interface PlatformClass {
    id: number | string;
    title: string;
    instructor: string;
    day: string;
    time: string;
    duration: string;
    level: string;
    type: string;
    link?: string;
    status: 'active' | 'cancelled' | 'full';
    maxCapacity?: number;
    enrolled?: EnrolledStudent[];
    attendance?: AttendanceRecord[];
    materials?: ClassMaterial[];
    recurring?: boolean;
    notes?: string;
}

export interface Student {
    id: number | string;
    name: string;
    email: string;
}

export interface Professor {
    id: number | string;
    name: string;
    email: string;
}

export interface ClubMembership {
    id: number | string;
    joinedAt: string;
    status: string;
    clubId: number | string | null;
    studentId: number | string | null;
}

export interface EventRegistration {
    id: number | string;
    registeredAt: string;
    status: string;
    eventId: number | string | null | undefined;
    studentId: number | string | null | undefined;
    studentName?: string;
    eventTitle?: string;
    eventStartTime?: string;
}

export interface NextEventInfo {
    eventId: number;
    title: string;
    startTime: string; // ISO
}

interface BackendEventResponse {
    id?: number | string;
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    status?: string;
    clubId?: number;
    clubName?: string;
    price?: number;
    maxParticipants?: number;
    registeredParticipants?: number;
    createdAt?: string;
    publishAt?: string | null;
}

interface BackendClubResponse {
    id?: number | string;
    name?: string;
    description?: string;
    status?: string;
}

interface BackendEventRegistrationResponse {
    id?: number | string;
    registeredAt?: string;
    status?: string;
    eventId?: number | null;
    studentId?: number | null;
    studentName?: string;
    eventTitle?: string;
    eventStartTime?: string;
}

export interface AdminEventFormData {
    title: string;
    description: string;
    location: string;
    status: string;
    start: string; // ISO-like string from datetime-local
    end: string;
    maxParticipants?: number;
    clubName?: string | null;
    /** Si défini, l'événement reste en attente jusqu'à cette date/heure avant d'être affiché. */
    publishAt?: string | null;
}

export interface AdminClubFormData {
    name: string;
    description: string;
    status: string;
    professorId?: number | null;
}

export interface AdminStudentFormData {
    name: string;
    email: string;
}

export interface AdminProfessorFormData {
    name: string;
    email: string;
}

export interface AdminClubMembershipFormData {
    status: string;
    clubId: number | null;
    studentId: number | null;
    joinedAt?: string;
}

export interface AdminEventRegistrationFormData {
    status: string;
    eventId: number | null;
    studentId: number | null;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly apiBaseUrl = 'http://localhost:8085/api';

    constructor(
        private http: HttpClient,
        private notification: NotificationService
    ) {
        this.loadEventsFromBackend(false);
        this.loadClubsFromBackend();
        this.loadStudentsFromBackend();
        this.loadProfessorsFromBackend();
        this.loadClubMembershipsFromBackend();
        this.loadEventRegistrationsFromBackend();
    }
    // Loading states
    isLoading = signal<boolean>(false);

    trainings = signal<Training[]>([
        {
            id: 1,
            title: "Speak Fluent English in 30 Days - No Boring Grammar Rules!",
            description: "Struggling to speak confidently? This course ditches complex grammar drills and focuses on real-world conversations. Learn the phrases, pronunciation hacks, and confidence tricks that native speak...",
            type: "Blended training",
            level: "Beginner",
            price: 350,
            image: "/images/training-1.jpg",
            banner: "/images/course-banner.jpg",
            slug: "speak-fluent-english",
            action: "Purchase",
            instructor: "Dr. Sarah Wilson",
            category: "Speaking",
            chapters: 12,
            duration: "4 weeks",
            chaptersData: [
                {
                    name: "Introduction to Fluency",
                    number: 1,
                    sections: [
                        { name: "Overcoming Fear of Speaking", completed: false },
                        { name: "Common Mistakes inhibited Fluency", completed: false },
                        { name: "Building Consistency", completed: true },
                        { name: "Chapter Summary", completed: false },
                        { name: "Quiz 1", completed: false },
                    ],
                },
                { name: "Real-world Conversations", number: 2, sections: [] },
                { name: "Pronunciation Hacks", number: 3, sections: [] },
            ]
        },
        {
            id: 2,
            title: "The Ultimate English Writing Masterclass: From Beginner to Pro!",
            description: "Want to write like a pro? Whether it's emails, essays, or creative stories, this course teaches you the secrets of powerful writing - structure, vocabulary, and style - so your words stand out every time.",
            type: "Live classes",
            level: "Mid-level",
            price: 369,
            image: "/images/training-2.jpg",
            banner: "/images/course-banner.jpg",
            slug: "english-writing-masterclass",
            action: "Book your place",
            instructor: "Mark Thompson",
            category: "Writing",
            chapters: 15,
            duration: "6 weeks"
        },
        {
            id: 3,
            title: "Accent Makeover: Sound Like a Native in Just Weeks!",
            description: "Tired of being misunderstood? Learn pronunciation hacks, rhythm, and intonation that will instantly improve your accent. Whether it's American, British, or neutral English, this course will help you speak...",
            type: "Live classes",
            level: "Advanced",
            price: 1400,
            image: "/images/training-3.jpg",
            banner: "/images/course-banner.jpg",
            slug: "accent-makeover",
            action: "Purchase",
            instructor: "Emma Watson",
            category: "Pronunciation",
            chapters: 10,
            duration: "3 weeks"
        },
        {
            id: 4,
            title: "Master English for Work: Speak, Write & Impress Like a Pro!",
            description: "Want to ace interviews, meetings, and emails in English? This course gives you business communication skills to sound professional and confident - so you can land jobs, close deals, and sta...",
            type: "Blended training",
            level: "Beginner",
            price: 450,
            image: "/images/event-1.jpg",
            banner: "/images/course-banner.jpg",
            slug: "master-english-for-work",
            action: "Purchase",
            instructor: "James Bond",
            category: "Business",
            chapters: 20,
            duration: "8 weeks"
        }
    ]);

    clubs = signal<Club[]>([]);

    events = signal<PlatformEvent[]>([]);

    students = signal<Student[]>([]);

    professors = signal<Professor[]>([]);

    clubMemberships = signal<ClubMembership[]>([]);

    eventRegistrations = signal<EventRegistration[]>([]);

    competitions = signal<Competition[]>([
        {
            id: 1,
            title: "Global English Speech Contest 2025",
            description: "Showcase your speaking skills on a global stage. Compete with learners from around the world and win amazing prizes.",
            image: "/images/event-1.jpg",
            slug: "global-english-speech-contest",
            status: 'upcoming',
            deadline: "Oct 15, 2025",
            prize: "$5,000 + Scholarship",
            category: "Speaking",
            tags: ["public speaking", "fluency", "confidence"],
            maxParticipants: 100,
            rules: "1. Participants must submit a 3-minute video.\n2. Topic must be related to global communication.\n3. Only one submission per participant.",
            resultsPublished: false,
            rounds: [
                { name: "Submission Phase", startDate: "Sep 1, 2025", endDate: "Oct 15, 2025", status: 'active' },
                { name: "Semi-Finals", startDate: "Oct 20, 2025", endDate: "Oct 25, 2025", status: 'pending' },
                { name: "Grand Finals", startDate: "Nov 1, 2025", endDate: "Nov 1, 2025", status: 'pending' }
            ],
            participants: [
                { id: 201, name: "Sarah Al-Amin", email: "sarah@example.com", registeredAt: "2025-09-02", score: 88, status: 'registered' },
                { id: 202, name: "James Okafor", email: "james@example.com", registeredAt: "2025-09-04", score: 94, status: 'winner' },
                { id: 203, name: "Mei Lin", email: "mei@example.com", registeredAt: "2025-09-05", score: 72, status: 'registered' }
            ]
        },
        {
            id: 2,
            title: "The Creative Writing Challenge",
            description: "Unleash your imagination. Write an original short story and get featured in our annual anthology.",
            image: "/images/training-2.jpg",
            slug: "creative-writing-challenge",
            status: 'ongoing',
            deadline: "Aug 30, 2025",
            prize: "MacBook Pro + Publishing Deal",
            category: "Writing",
            tags: ["creative writing", "storytelling", "fiction"],
            maxParticipants: 50,
            rules: "1. Stories must be 500–1500 words.\n2. Original work only.\n3. Must be submitted in English.",
            resultsPublished: false,
            rounds: [
                { name: "Open Submissions", startDate: "Jul 1, 2025", endDate: "Aug 30, 2025", status: 'active' },
                { name: "Judging", startDate: "Sep 1, 2025", endDate: "Sep 15, 2025", status: 'pending' }
            ],
            participants: [
                { id: 301, name: "Carlos Rivera", email: "carlos@example.com", registeredAt: "2025-07-10", status: 'registered' },
                { id: 302, name: "Amina Nour", email: "amina@example.com", registeredAt: "2025-07-15", score: 81, status: 'registered' }
            ]
        }
    ]);

    classes = signal<PlatformClass[]>([
        {
            id: 1,
            title: "Advanced Business English",
            instructor: "Dr. Sarah Wilson",
            day: "Monday",
            time: "10:00 AM - 12:00 PM",
            duration: "2 hours",
            level: "C1",
            type: "Live Class",
            link: "https://zoom.us/j/123456789",
            status: 'active',
            maxCapacity: 20,
            recurring: true,
            notes: "Focus on email writing and presentation skills this month.",
            enrolled: [
                { id: 101, name: "Alice Martin", email: "alice@example.com", enrolledAt: "2025-09-01" },
                { id: 102, name: "Bob Chen", email: "bob@example.com", enrolledAt: "2025-09-02" }
            ],
            attendance: [
                { date: "2025-09-08", attendees: [101, 102] },
                { date: "2025-09-15", attendees: [101] }
            ],
            materials: [
                { title: "Business Email Guide", url: "/materials/email-guide.pdf", type: "pdf" },
                { title: "Week 1 Slides", url: "/materials/week1-slides.pdf", type: "slide" }
            ]
        },
        {
            id: 2,
            title: "Essential Grammar Workshop",
            instructor: "Mark Thompson",
            day: "Wednesday",
            time: "02:30 PM - 04:00 PM",
            duration: "1.5 hours",
            level: "A2/B1",
            type: "Workshop",
            link: "https://zoom.us/j/987654321",
            status: 'active',
            maxCapacity: 15,
            recurring: true,
            enrolled: [
                { id: 103, name: "Fatima Zahra", email: "fatima@example.com", enrolledAt: "2025-09-03" }
            ],
            attendance: [],
            materials: [
                { title: "Grammar Handbook", url: "/materials/grammar.pdf", type: "pdf" }
            ]
        },
        {
            id: 3,
            title: "Pronunciation Masterclass",
            instructor: "Emma Watson",
            day: "Friday",
            time: "05:00 PM - 06:30 PM",
            duration: "1.5 hours",
            level: "All Levels",
            type: "Masterclass",
            link: "https://zoom.us/j/555666777",
            status: 'full',
            maxCapacity: 10,
            recurring: false,
            enrolled: [],
            attendance: [],
            materials: []
        }
    ]);

    loadEventsFromBackend(includeScheduled = false) {
        this.isLoading.set(true);
        const url = includeScheduled ? `${this.apiBaseUrl}/events?includeScheduled=true` : `${this.apiBaseUrl}/events`;
        this.http.get<BackendEventResponse[]>(url).subscribe({
            next: (backendEvents) => {
                const list = Array.isArray(backendEvents) ? backendEvents : [];
                const mapped = list.map(e => this.mapBackendEvent(e));
                this.events.set(mapped);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load events from backend', err);
                this.events.set([]);
                this.isLoading.set(false);
                this.notification.error('Failed to load events', 'Please check your connection and try again');
            }
        });
    }

    getNextEvent(includeScheduled = false): Observable<NextEventInfo | null> {
        const url = includeScheduled
            ? `${this.apiBaseUrl}/events/next?includeScheduled=true`
            : `${this.apiBaseUrl}/events/next`;
        return this.http.get<NextEventInfo & { startTime?: string | number[] }>(url, { observe: 'response' }).pipe(
            map(res => {
                const body = res.body ?? null;
                if (!body || body.eventId == null) return null;
                const startTime: string | number[] | undefined = body.startTime;
                let startTimeStr: string;
                if (typeof startTime === 'string') {
                    startTimeStr = startTime;
                } else if (Array.isArray(startTime) && startTime.length >= 6) {
                    const [y, mo, d, h, mi, s] = startTime.map(Number);
                    const date = new Date(y, mo - 1, d, h, mi, s ?? 0);
                    startTimeStr = Number.isNaN(date.getTime()) ? '' : date.toISOString();
                } else {
                    startTimeStr = '';
                }
                if (!startTimeStr) return null;
                return { eventId: Number(body.eventId), title: body.title ?? '', startTime: startTimeStr };
            }),
            catchError(() => of(null))
        );
    }

    private mapBackendEvent(e: BackendEventResponse): PlatformEvent {
        const start = e.startTime ? new Date(e.startTime) : null;
        const end = e.endTime ? new Date(e.endTime) : null;

        const date = start ? start.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';

        const time = start && end
            ? `${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
            : '';

        const now = new Date();
        const isNext = !!start && start.getTime() >= now.getTime();
        const badge = isNext ? 'Next event' : 'Past event';

        return {
            id: e.id ?? '',
            title: this.fixEncoding(e.title ?? ''),
            description: this.fixEncoding(e.description ?? ''),
            date,
            location: this.fixEncoding(e.location ?? ''),
            time,
            image: '/images/event-1.jpg',
            badge,
            slug: `event-${e.id ?? ''}`,
            type: isNext ? 'next' : 'past',
            overview: this.fixEncoding(e.description ?? ''),
            expectations: [],
            album: [],
            price: e.price,
            maxParticipants: e.maxParticipants,
            registeredParticipants: e.registeredParticipants,
            clubId: e.clubId,
            clubName: this.fixEncoding(e.clubName ?? ''),
            isPublic: e.clubId === null,
            status: e.status,
            startTime: e.startTime,
            endTime: e.endTime,
            publishAt: e.publishAt ?? undefined
        };
    }

    private fixEncoding(text: string): string {
        return text.replace(/Ã©/g, 'é')
                   .replace(/Ã¨/g, 'è')
                   .replace(/Ã /g, 'à')
                   .replace(/Ã´/g, 'ô')
                   .replace(/Ã¹/g, 'ù')
                   .replace(/Ã§/g, 'ç')
                   .replace(/Ãª/g, 'ê')
                   .replace(/Ã«/g, 'ë')
                   .replace(/Ã®/g, 'î')
                   .replace(/Ã¯/g, 'ï')
                   .replace(/Ã¼/g, 'ü')
                   .replace(/Ã¥/g, 'å')
                   .replace(/Ã¤/g, 'ä')
                   .replace(/Ã¶/g, 'ö');
    }

    private loadClubsFromBackend() {
        this.isLoading.set(true);
        this.http.get<BackendClubResponse[]>(`${this.apiBaseUrl}/clubs`).subscribe({
            next: (backendClubs) => {
                if (!Array.isArray(backendClubs) || backendClubs.length === 0) {
                    this.isLoading.set(false);
                    return;
                }
                const mapped = backendClubs.map(c => this.mapBackendClub(c));
                this.clubs.set(mapped);
                this.isLoading.set(false);
            },
            error: () => {
                // No backend clubs: leave list empty
                this.isLoading.set(false);
            }
        });
    }

    private mapBackendClub(c: BackendClubResponse): Club {
        return {
            id: c.id ?? '',
            name: this.fixEncoding(c.name ?? ''),
            description: this.fixEncoding(c.description ?? ''),
            icon: '💬',
            image: '/images/club-1.jpg',
            slug: `club-${c.id ?? ''}`,
            members: 0,
            images: ['/images/club-1.jpg']
        };
    }

    private loadStudentsFromBackend() {
        this.isLoading.set(true);
        this.http.get<Student[]>(`${this.apiBaseUrl}/students`).subscribe({
            next: (students) => {
                this.students.set(Array.isArray(students) ? students : []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load students', err);
                this.students.set([]);
                this.notification.error('Failed to load students', 'Please check your connection');
                this.isLoading.set(false);
            }
        });
    }

    private loadProfessorsFromBackend() {
        this.isLoading.set(true);
        this.http.get<Professor[]>(`${this.apiBaseUrl}/professors`).subscribe({
            next: (list) => {
                this.professors.set(Array.isArray(list) ? list : []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load professors', err);
                this.professors.set([]);
                this.notification.error('Failed to load professors', 'Please check your connection');
                this.isLoading.set(false);
            }
        });
    }

    private loadClubMembershipsFromBackend() {
        this.isLoading.set(true);
        this.http.get<ClubMembership[]>(`${this.apiBaseUrl}/club-memberships`).subscribe({
            next: (list) => {
                this.clubMemberships.set(Array.isArray(list) ? list : []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load club memberships', err);
                this.clubMemberships.set([]);
                this.notification.error('Failed to load club memberships', 'Please check your connection');
                this.isLoading.set(false);
            }
        });
    }

    private loadEventRegistrationsFromBackend() {
        this.isLoading.set(true);
        this.http.get<BackendEventRegistrationResponse[]>(`${this.apiBaseUrl}/event-registrations`).subscribe({
            next: (list) => {
                const mapped = Array.isArray(list) ? list.map(r => this.mapBackendEventRegistration(r)) : [];
                this.eventRegistrations.set(mapped);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load event registrations', err);
                this.eventRegistrations.set([]);
                this.notification.error('Failed to load event registrations', 'Please check your connection');
                this.isLoading.set(false);
            }
        });
    }

    private mapBackendEventRegistration(r: BackendEventRegistrationResponse): EventRegistration {
        return {
            id: r.id ?? '',
            registeredAt: r.registeredAt ?? new Date().toISOString(),
            status: r.status ?? 'pending',
            eventId: r.eventId,
            studentId: r.studentId,
            studentName: r.studentName,
            eventTitle: r.eventTitle,
            eventStartTime: r.eventStartTime
        };
    }

    downloadCertificate(eventId: number | string, studentId: number | string): void {
        this.isLoading.set(true);
        this.http.get(`${this.apiBaseUrl}/events/${eventId}/certificates/${studentId}`, { 
            responseType: 'blob' 
        }).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificate-participation-${eventId}-${studentId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                this.notification.success('Certificate downloaded successfully');
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to download certificate', err);
                const errorMsg = err?.error?.message || 'Failed to download certificate. Please try again.';
                this.notification.error('Error downloading certificate', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createClub(payload: AdminClubFormData) {
        this.isLoading.set(true);
        const body = this.toClubRequestBody(payload);
        this.http.post<BackendClubResponse>(`${this.apiBaseUrl}/clubs`, body).subscribe({
            next: () => {
                this.notification.success('Club created successfully');
                this.loadClubsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create club', err);
                const errorMsg = err?.error?.message || 'Failed to create club. Please try again.';
                this.notification.error('Error creating club', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateClub(id: number | string, payload: AdminClubFormData) {
        this.isLoading.set(true);
        const body = this.toClubRequestBody(payload);
        this.http.put<BackendClubResponse>(`${this.apiBaseUrl}/clubs/${id}`, body).subscribe({
            next: () => {
                this.notification.success('Club updated successfully');
                this.loadClubsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update club', err);
                const errorMsg = err?.error?.message || 'Failed to update club. Please try again.';
                this.notification.error('Error updating club', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createStudent(payload: AdminStudentFormData) {
        this.isLoading.set(true);
        this.http.post<Student>(`${this.apiBaseUrl}/students`, payload).subscribe({
            next: () => {
                this.notification.success('Student created successfully');
                this.loadStudentsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create student', err);
                const errorMsg = err?.error?.message || 'Failed to create student. Please try again.';
                this.notification.error('Error creating student', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateStudent(id: number | string, payload: AdminStudentFormData) {
        this.isLoading.set(true);
        this.http.put<Student>(`${this.apiBaseUrl}/students/${id}`, payload).subscribe({
            next: () => {
                this.notification.success('Student updated successfully');
                this.loadStudentsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update student', err);
                const errorMsg = err?.error?.message || 'Failed to update student. Please try again.';
                this.notification.error('Error updating student', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createEvent(payload: AdminEventFormData) {
        this.isLoading.set(true);
        const body = this.toEventRequestBody(payload);
        this.http.post<BackendEventResponse>(`${this.apiBaseUrl}/events`, body).subscribe({
            next: () => {
                this.notification.success('Event created successfully');
                this.loadEventsFromBackend(true);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create event', err);
                const errorMsg = err?.error?.message || 'Failed to create event. Please try again.';
                this.notification.error('Error creating event', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateEvent(id: number | string, payload: AdminEventFormData) {
        this.isLoading.set(true);
        const body = this.toEventRequestBody(payload);
        this.http.put<BackendEventResponse>(`${this.apiBaseUrl}/events/${id}`, body).subscribe({
            next: () => {
                this.notification.success('Event updated successfully');
                this.loadEventsFromBackend(true);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update event', err);
                const errorMsg = err?.error?.message || 'Failed to update event. Please try again.';
                this.notification.error('Error updating event', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteEvent(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/events/${id}`).subscribe({
            next: () => {
                this.notification.success('Event deleted successfully');
                this.loadEventsFromBackend(true);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete event', err);
                const errorMsg = err?.error?.message || 'Failed to delete event. Please try again.';
                this.notification.error('Error deleting event', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteClub(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/clubs/${id}`).subscribe({
            next: () => {
                this.notification.success('Club deleted successfully');
                this.loadClubsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete club', err);
                const errorMsg = err?.error?.message || 'Failed to delete club. Please try again.';
                this.notification.error('Error deleting club', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteStudent(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/students/${id}`).subscribe({
            next: () => {
                this.notification.success('Student deleted successfully');
                this.loadStudentsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete student', err);
                const errorMsg = err?.error?.message || 'Failed to delete student. Please try again.';
                this.notification.error('Error deleting student', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createProfessor(payload: AdminProfessorFormData) {
        this.isLoading.set(true);
        this.http.post<Professor>(`${this.apiBaseUrl}/professors`, payload).subscribe({
            next: () => {
                this.notification.success('Professor created successfully');
                this.loadProfessorsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create professor', err);
                const errorMsg = err?.error?.message || 'Failed to create professor. Please try again.';
                this.notification.error('Error creating professor', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateProfessor(id: number | string, payload: AdminProfessorFormData) {
        this.isLoading.set(true);
        this.http.put<Professor>(`${this.apiBaseUrl}/professors/${id}`, payload).subscribe({
            next: () => {
                this.notification.success('Professor updated successfully');
                this.loadProfessorsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update professor', err);
                const errorMsg = err?.error?.message || 'Failed to update professor. Please try again.';
                this.notification.error('Error updating professor', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteProfessor(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/professors/${id}`).subscribe({
            next: () => {
                this.notification.success('Professor deleted successfully');
                this.loadProfessorsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete professor', err);
                const errorMsg = err?.error?.message || 'Failed to delete professor. Please try again.';
                this.notification.error('Error deleting professor', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createClubMembership(payload: AdminClubMembershipFormData) {
        this.isLoading.set(true);
        const body = {
            joinedAt: payload.joinedAt ?? new Date().toISOString(),
            status: payload.status,
            clubId: payload.clubId,
            studentId: payload.studentId
        };
        this.http.post<ClubMembership>(`${this.apiBaseUrl}/club-memberships`, body).subscribe({
            next: () => {
                this.notification.success('Club membership created successfully');
                this.loadClubMembershipsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create club membership', err);
                const errorMsg = err?.error?.message || 'Failed to create club membership. Please try again.';
                this.notification.error('Error creating club membership', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateClubMembership(id: number | string, payload: AdminClubMembershipFormData) {
        this.isLoading.set(true);
        const body = {
            joinedAt: payload.joinedAt ?? new Date().toISOString(),
            status: payload.status,
            clubId: payload.clubId,
            studentId: payload.studentId
        };
        this.http.put<ClubMembership>(`${this.apiBaseUrl}/club-memberships/${id}`, body).subscribe({
            next: () => {
                this.notification.success('Club membership updated successfully');
                this.loadClubMembershipsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update club membership', err);
                const errorMsg = err?.error?.message || 'Failed to update club membership. Please try again.';
                this.notification.error('Error updating club membership', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteClubMembership(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/club-memberships/${id}`).subscribe({
            next: () => {
                this.notification.success('Club membership deleted successfully');
                this.loadClubMembershipsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete club membership', err);
                const errorMsg = err?.error?.message || 'Failed to delete club membership. Please try again.';
                this.notification.error('Error deleting club membership', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    createEventRegistration(payload: AdminEventRegistrationFormData) {
        this.isLoading.set(true);
        this.http.post<EventRegistration>(`${this.apiBaseUrl}/event-registrations`, payload).subscribe({
            next: () => {
                this.notification.success('Event registration created successfully');
                this.loadEventRegistrationsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to create event registration', err);
                const errorMsg = err?.error?.message || 'Failed to create event registration. Please try again.';
                this.notification.error('Error creating event registration', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    updateEventRegistration(id: number | string, payload: AdminEventRegistrationFormData) {
        this.isLoading.set(true);
        this.http.put<EventRegistration>(`${this.apiBaseUrl}/event-registrations/${id}`, payload).subscribe({
            next: () => {
                this.notification.success('Event registration updated successfully');
                this.loadEventRegistrationsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to update event registration', err);
                const errorMsg = err?.error?.message || 'Failed to update event registration. Please try again.';
                this.notification.error('Error updating event registration', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    deleteEventRegistration(id: number | string) {
        this.isLoading.set(true);
        this.http.delete(`${this.apiBaseUrl}/event-registrations/${id}`).subscribe({
            next: () => {
                this.notification.success('Event registration deleted successfully');
                this.loadEventRegistrationsFromBackend();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to delete event registration', err);
                const errorMsg = err?.error?.message || 'Failed to delete event registration. Please try again.';
                this.notification.error('Error deleting event registration', errorMsg);
                this.isLoading.set(false);
            }
        });
    }

    // New event management endpoints
    checkEventAccessibility(eventId: number, studentId: number) {
        return this.http.get<boolean>(`${this.apiBaseUrl}/events/${eventId}/accessible/${studentId}`);
    }

    getEventPriceForStudent(eventId: number, studentId: number) {
        return this.http.get<number>(`${this.apiBaseUrl}/events/${eventId}/price/${studentId}`);
    }

    getAvailablePlaces(eventId: number) {
        return this.http.get<number>(`${this.apiBaseUrl}/event-registrations/available-places/${eventId}`);
    }

    checkRegistrationEligibility(eventId: number, studentId: number) {
        return this.http.get<boolean>(`${this.apiBaseUrl}/event-registrations/can-register/${eventId}/${studentId}`);
    }

    // Club event management endpoints
    createClubEvent(clubId: number, payload: AdminEventFormData) {
        const body = this.toEventRequestBody(payload);
        return this.http.post<PlatformEvent>(`${this.apiBaseUrl}/clubs/${clubId}/events`, body);
    }

    getClubEvents(clubId: number) {
        return this.http.get<PlatformEvent[]>(`${this.apiBaseUrl}/clubs/${clubId}/events`);
    }

    autoRegisterClubMembers(clubId: number, eventId: number) {
        return this.http.post<number>(`${this.apiBaseUrl}/clubs/${clubId}/events/${eventId}/auto-register`, {});
    }

    getClubEventStatistics(clubId: number) {
        return this.http.get<any>(`${this.apiBaseUrl}/clubs/${clubId}/events/statistics`);
    }

    cancelClubEvent(clubId: number, eventId: number) {
        return this.http.delete(`${this.apiBaseUrl}/clubs/${clubId}/events/${eventId}/cancel`);
    }

    getAvailableClubEvents(clubId: number, studentId: number) {
        return this.http.get<PlatformEvent[]>(`${this.apiBaseUrl}/clubs/${clubId}/events/available/${studentId}`);
    }

    private toEventRequestBody(payload: AdminEventFormData) {
        return {
            title: payload.title,
            description: payload.description,
            startTime: payload.start,
            endTime: payload.end,
            location: payload.location,
            status: payload.status,
            maxParticipants: payload.maxParticipants,
            clubName: payload.clubName && payload.clubName.trim() !== '' ? payload.clubName.trim() : null,
            publishAt: payload.publishAt && payload.publishAt.trim() !== '' ? payload.publishAt.trim() : null
        };
    }

    private toClubRequestBody(payload: AdminClubFormData) {
        return {
            name: payload.name,
            description: payload.description,
            status: payload.status,
            professorId: payload.professorId ?? null
        };
    }

    addTraining(training: Training) {
        this.trainings.update(t => [...t, { ...training, id: Date.now() }]);
    }

    updateTraining(training: Training) {
        this.trainings.update(t => t.map(item => item.id === training.id ? training : item));
    }

    deleteTraining(id: number | string) {
        this.trainings.update(t => t.filter(item => item.id !== id));
    }

    addCompetition(comp: Competition) {
        this.competitions.update(c => [...c, { ...comp, id: Date.now() }]);
    }

    updateCompetition(comp: Competition) {
        this.competitions.update(c => c.map(item => item.id === comp.id ? comp : item));
    }

    deleteCompetition(id: number | string) {
        this.competitions.update(c => c.filter(item => item.id !== id));
    }

    addClass(pc: PlatformClass) {
        this.classes.update(c => [...c, { ...pc, id: Date.now() }]);
    }

    updateClass(pc: PlatformClass) {
        this.classes.update(c => c.map(item => item.id === pc.id ? pc : item));
    }

    deleteClass(id: number | string) {
        this.classes.update(c => c.filter(item => item.id !== id));
    }

    /** Public: register a user for a competition. Returns error string or null on success. */
    registerForCompetition(competitionId: number | string, name: string, email: string): string | null {
        const comp = this.competitions().find(c => c.id === competitionId);
        if (!comp) return 'Competition not found.';

        const already = (comp.participants ?? []).some(p => p.email.toLowerCase() === email.toLowerCase());
        if (already) return 'This email is already registered for this competition.';

        const max = comp.maxParticipants ?? Infinity;
        if ((comp.participants ?? []).length >= max) return 'Sorry, registrations are closed — maximum capacity reached.';

        if (comp.status === 'completed') return 'This competition has already ended.';

        const newP: Participant = {
            id: Date.now(), name, email,
            registeredAt: new Date().toISOString().slice(0, 10),
            status: 'registered'
        };
        const updated: Competition = { ...comp, participants: [...(comp.participants ?? []), newP] };
        this.competitions.update(list => list.map(c => c.id === competitionId ? updated : c));
        return null; // success
    }

    /** Public: enroll a user in a class. Returns error string or null on success. */
    joinClass(classId: number | string, name: string, email: string): string | null {
        const cls = this.classes().find(c => c.id === classId);
        if (!cls) return 'Class not found.';

        const already = (cls.enrolled ?? []).some(s => s.email.toLowerCase() === email.toLowerCase());
        if (already) return 'You are already enrolled in this class.';

        const max = cls.maxCapacity ?? Infinity;
        if ((cls.enrolled ?? []).length >= max) return 'Sorry, this class is full.';

        if (cls.status === 'cancelled') return 'This class has been cancelled.';

        const student: EnrolledStudent = {
            id: Date.now(), name, email,
            enrolledAt: new Date().toISOString().slice(0, 10)
        };
        const newStatus: PlatformClass['status'] =
            (cls.enrolled ?? []).length + 1 >= (cls.maxCapacity ?? Infinity) ? 'full' : cls.status;

        const updated: PlatformClass = { ...cls, enrolled: [...(cls.enrolled ?? []), student], status: newStatus };
        this.classes.update(list => list.map(c => c.id === classId ? updated : c));
        return null; // success
    }
}
