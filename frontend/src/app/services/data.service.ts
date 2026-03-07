import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type TrainingType = 'Blended course' | 'Live classes';
export type TrainingStatus = 'Published' | 'Draft';

export interface TrainingSection {
    name: string;
    completed: boolean;
}

export interface TrainingChapter {
    name: string;
    number: number;
    pdfUrl?: string;
    sections: TrainingSection[];
}

export interface Training {
    id: number | string;
    title: string;
    description: string;
    type: TrainingType;
    status: TrainingStatus;
    level: string;
    image: string;
    slug: string;
    action: string;
    instructor?: string;
    category?: string;
    chapters?: number;
    duration?: string;
    banner?: string;
    chaptersData?: TrainingChapter[];
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

export interface Quiz {
    id: number | string;
    title: string;
    course: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    questions: number;
    duration: string;
    passScore: number;
    status: 'Draft' | 'Published' | 'Archived';
    items: QuizQuestion[];
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface AdminNotification {
    id: number;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    href?: string;
}

interface CourseApiSection {
    id?: number;
    name: string;
    completed: boolean;
}

interface CourseApiChapter {
    id?: number;
    name: string;
    number: number;
    pdfUrl?: string;
    sections: CourseApiSection[];
}

interface CourseApiResponse {
    id: number | string;
    title: string;
    description: string;
    type: string;
    status: string;
    level: string;
    image: string;
    banner?: string;
    slug: string;
    action?: string;
    instructor?: string;
    category?: string;
    chapters?: number;
    duration?: string;
    chaptersData?: CourseApiChapter[];
}

interface QuizApiResponse {
    id: number | string;
    title: string;
    course: string;
    category: string;
    difficulty: string;
    questions: number;
    duration: string;
    passScore: number;
    status: string;
    items: QuizQuestion[];
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private readonly http = inject(HttpClient);
    private readonly courseApiUrl = 'http://localhost:8081/api/courses';
    private readonly quizApiUrl = 'http://localhost:8082/api/quizzes';
    notifications = signal<AdminNotification[]>([
        {
            id: 1,
            title: 'Admin panel ready',
            message: 'Your latest admin activity will appear here.',
            createdAt: 'Just now',
            read: false,
            href: '/admin/courses'
        }
    ]);
    unreadNotifications = computed(() => this.notifications().filter(item => !item.read));

    trainings = signal<Training[]>([]);

    clubs = signal<Club[]>([
        {
            id: 1,
            name: "English Conversation Club",
            icon: "💬",
            description: "Practice speaking with peers in a fun and supportive environment through interactive discussions.",
            image: "/images/club-1.jpg",
            slug: "english-conversation-club",
            members: 156,
            images: ["/images/club-1.jpg", "/images/training-1.jpg", "/images/training-2.jpg", "/images/training-3.jpg", "/images/event-1.jpg"]
        },
        {
            id: 2,
            name: "Book & Storytelling Club",
            icon: "📚",
            description: "Improve reading skills and vocabulary by exploring books, short stories, and creative storytelling.",
            image: "/images/training-1.jpg",
            slug: "book-storytelling-club",
            members: 89,
            images: ["/images/training-1.jpg", "/images/club-1.jpg", "/images/training-3.jpg"]
        },
        {
            id: 3,
            name: "Drama & Roleplay Club",
            icon: "🎭",
            description: "Boost confidence and pronunciation by acting out real-life scenarios and fun roleplays.",
            image: "/images/training-2.jpg",
            slug: "drama-roleplay-club",
            members: 45,
            images: ["/images/training-2.jpg", "/images/event-1.jpg", "/images/club-1.jpg"]
        },
        {
            id: 4,
            name: "Writing & Grammar Club",
            icon: "✍️",
            description: "Enhance your writing skills with engaging exercises, feedback, and grammar tips.",
            image: "/images/training-3.jpg",
            slug: "writing-grammar-club",
            members: 72,
            images: ["/images/training-3.jpg", "/images/training-1.jpg", "/images/training-2.jpg"]
        }
    ]);

    events = signal<PlatformEvent[]>([
        {
            id: 1,
            title: 'Freelancer & Entrepreneur Networking Night',
            description: "Tired of boring lectures? Get ready to roll up your sleeves and dive into action! This event is all about hands-on courses.",
            date: 'Friday, 16 August 2025',
            location: 'Technopole, Sousse, Tunisia',
            time: 'from 11:00 am to 18:30 pm',
            image: '/images/event-1.jpg',
            badge: 'Past event',
            slug: 'freelancer-networking-night',
            type: 'past',
            overview: "Say goodbye to passive learning and hello to real, hands-on experience! This networking night is designed to bridge the gap between theory and practice.",
            expectations: [
                "Hands-on Workshops - No fluff, just practical course work you can use immediately.",
                "Expert-Led Sessions - Learn from top professionals in your field.",
                "Networking & Collaboration - Connect with like-minded learners and mentors.",
            ],
            album: ["/images/album-1.jpg", "/images/album-2.jpg", "/images/album-3.jpg", "/images/album-4.jpg"]
        },
        {
            id: 2,
            title: 'Mastering Contracts Workshop',
            description: "Stay connected and inspired with our latest gatherings, workshops, and networking opportunities.",
            date: 'Saturday, 2 December 2025',
            location: 'Ambassadeurs Hotel, Tunis',
            time: 'from 11:00 am to 14:45 pm',
            image: '/images/training-1.jpg',
            badge: 'Past event',
            slug: 'mastering-contracts-workshop',
            type: 'past',
            overview: "A specialized workshop for professional communication and contract management in English.",
            expectations: [
                "Interactive Workshops - Engage in hands-on activities led by industry experts.",
                "Live Demonstrations - Witness real-time applications of key concepts.",
                "Certification & Takeaways - Gain valuable credentials.",
            ],
            album: ["/images/album-1.jpg", "/images/album-2.jpg", "/images/album-3.jpg", "/images/album-4.jpg"]
        },
        {
            id: 3,
            title: 'Skill Up: Online Workshop Series',
            description: "Stay connected and inspired with our latest gatherings, workshops, and networking opportunities.",
            date: '12 Jan, 2025',
            location: 'Technopole, Sousse, Tunisia',
            time: 'from 11:00 am to 18:30 pm',
            image: '/images/event-3.jpg',
            badge: 'Next event',
            slug: 'skill-up-online-workshop',
            type: 'next'
        }
    ]);

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

    quizzes = signal<Quiz[]>([]);

    constructor() {
        void this.refreshTrainings();
        void this.refreshQuizzes();
    }

    async refreshTrainings() {
        const trainings = await firstValueFrom(this.http.get<CourseApiResponse[]>(this.courseApiUrl));
        this.trainings.set(trainings.map((item) => this.fromCourseApi(item)));
    }

    async refreshQuizzes() {
        const quizzes = await firstValueFrom(this.http.get<QuizApiResponse[]>(this.quizApiUrl));
        this.quizzes.set(quizzes.map((item) => this.fromQuizApi(item)));
    }

    async addTraining(training: Training) {
        const created = await firstValueFrom(
            this.http.post<CourseApiResponse>(this.courseApiUrl, this.toCoursePayload(training))
        );
        const normalized = this.fromCourseApi(created);
        this.trainings.update((list) => [...list, normalized]);
        return normalized;
    }

    async updateTraining(training: Training) {
        const updated = await firstValueFrom(
            this.http.put<CourseApiResponse>(`${this.courseApiUrl}/${training.id}`, this.toCoursePayload(training))
        );
        const normalized = this.fromCourseApi(updated);
        this.trainings.update((list) => list.map((item) => item.id === training.id ? normalized : item));
        return normalized;
    }

    async deleteTraining(id: number | string) {
        await firstValueFrom(this.http.delete<void>(`${this.courseApiUrl}/${id}`));
        this.trainings.update((list) => list.filter((item) => item.id !== id));
    }

    async setTrainingStatus(id: number | string, status: TrainingStatus) {
        const updated = await firstValueFrom(
            this.http.patch<CourseApiResponse>(`${this.courseApiUrl}/${id}/status?status=${this.toCourseStatusApi(status)}`, {})
        );
        const normalized = this.fromCourseApi(updated);
        this.trainings.update((list) => list.map((item) => item.id === id ? normalized : item));
        return normalized;
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

    async addQuiz(quiz: Quiz) {
        const created = await firstValueFrom(
            this.http.post<QuizApiResponse>(this.quizApiUrl, this.toQuizPayload(quiz))
        );
        const normalized = this.fromQuizApi(created);
        this.quizzes.update((list) => [...list, normalized]);
        return normalized;
    }

    async updateQuiz(quiz: Quiz) {
        const updated = await firstValueFrom(
            this.http.put<QuizApiResponse>(`${this.quizApiUrl}/${quiz.id}`, this.toQuizPayload(quiz))
        );
        const normalized = this.fromQuizApi(updated);
        this.quizzes.update((list) => list.map((item) => item.id === quiz.id ? normalized : item));
        return normalized;
    }

    async deleteQuiz(id: number | string) {
        await firstValueFrom(this.http.delete<void>(`${this.quizApiUrl}/${id}`));
        this.quizzes.update((list) => list.filter((item) => item.id !== id));
    }

    addNotification(notification: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) {
        const item: AdminNotification = {
            id: Date.now(),
            title: notification.title,
            message: notification.message,
            href: notification.href,
            createdAt: new Date().toLocaleString(),
            read: false
        };

        this.notifications.update(list => [item, ...list]);
    }

    markNotificationAsRead(id: number) {
        this.notifications.update(list =>
            list.map(item => item.id === id ? { ...item, read: true } : item)
        );
    }

    markAllNotificationsAsRead() {
        this.notifications.update(list => list.map(item => ({ ...item, read: true })));
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

    private normalizeQuiz(
        quiz: Partial<Quiz>,
        fallbackId: number | string = Date.now()
    ): Quiz {
        const normalized: Quiz = {
            id: quiz.id ?? fallbackId,
            title: (quiz.title ?? '').trim(),
            course: (quiz.course ?? '').trim(),
            category: (quiz.category ?? '').trim() || 'General',
            difficulty: quiz.difficulty === 'Advanced'
                ? 'Advanced'
                : quiz.difficulty === 'Intermediate'
                    ? 'Intermediate'
                    : 'Beginner',
            questions: Math.min(5, Math.max(1, Number(quiz.questions ?? 1) || 1)),
            duration: (quiz.duration ?? '').trim() || '10 min',
            passScore: Math.min(100, Math.max(70, Number(quiz.passScore ?? 70) || 70)),
            status: quiz.status === 'Archived'
                ? 'Archived'
                : quiz.status === 'Published'
                    ? 'Published'
                    : 'Draft',
            items: []
        };

        normalized.items = this.normalizeQuizItems(
            Array.isArray(quiz.items) ? quiz.items : [],
            normalized
        );
        normalized.questions = normalized.items.length;

        return normalized;
    }

    async getTrainingBySlug(slug: string) {
        const training = await firstValueFrom(
            this.http.get<CourseApiResponse>(`${this.courseApiUrl}/slug/${slug}`)
        );
        const normalized = this.fromCourseApi(training);
        this.upsertTraining(normalized);
        return normalized;
    }

    async getTrainingById(id: number | string) {
        const training = await firstValueFrom(
            this.http.get<CourseApiResponse>(`${this.courseApiUrl}/${id}`)
        );
        const normalized = this.fromCourseApi(training);
        this.upsertTraining(normalized);
        return normalized;
    }

    async getQuizById(id: number | string) {
        const quiz = await firstValueFrom(
            this.http.get<QuizApiResponse>(`${this.quizApiUrl}/${id}`)
        );
        const normalized = this.fromQuizApi(quiz);
        this.upsertQuiz(normalized);
        return normalized;
    }

    async getQuizByCourseTitle(courseTitle: string) {
        try {
            const quiz = await firstValueFrom(
                this.http.get<QuizApiResponse>(`${this.quizApiUrl}/by-course`, {
                    params: { courseTitle }
                })
            );
            const normalized = this.fromQuizApi(quiz);
            this.upsertQuiz(normalized);
            return normalized;
        } catch (error) {
            if (error instanceof HttpErrorResponse && error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    getQuizQuestions(quiz: Quiz): QuizQuestion[] {
        return quiz.items.map((item, index) => ({
            id: item.id || `${quiz.id}-${index + 1}`,
            text: item.text,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation
        }));
    }

    private normalizeQuizItems(items: QuizQuestion[], quiz: Omit<Quiz, 'items'>): QuizQuestion[] {
        const normalizedItems = items
            .slice(0, 5)
            .map((item, index) => ({
                id: item.id?.trim() || `${quiz.id}-${index + 1}`,
                text: (item.text ?? '').trim(),
                options: Array.isArray(item.options)
                    ? item.options.slice(0, 4).map((option) => (option ?? '').trim())
                    : [],
                correctAnswer: Math.min(3, Math.max(0, Number(item.correctAnswer ?? 0) || 0)),
                explanation: (item.explanation ?? '').trim()
            }))
            .filter((item) => item.text && item.options.length === 4 && item.options.every((option) => option));

        if (normalizedItems.length > 0) {
            return normalizedItems;
        }

        return this.buildDefaultQuizQuestions(quiz).slice(0, quiz.questions);
    }

    private buildDefaultQuizQuestions(quiz: Omit<Quiz, 'items'>): QuizQuestion[] {
        const templates = [
            {
                text: `What is the main focus of "${quiz.title}"?`,
                options: [
                    `${quiz.category} practice in realistic situations`,
                    'Memorizing isolated word lists only',
                    'Studying unrelated technical topics',
                    'Avoiding interaction and feedback'
                ],
                correctAnswer: 0,
                explanation: `This quiz is tied to ${quiz.category.toLowerCase()} skills and checks practical understanding.`
            },
            {
                text: `Which learner level is this quiz designed for?`,
                options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'],
                correctAnswer: quiz.difficulty === 'Beginner' ? 0 : quiz.difficulty === 'Intermediate' ? 1 : 2,
                explanation: `The quiz difficulty is set to ${quiz.difficulty}.`
            },
            {
                text: `To pass this quiz, what score do you need at minimum?`,
                options: ['50%', '60%', `${quiz.passScore}%`, '100%'],
                correctAnswer: 2,
                explanation: `The configured passing score for this quiz is ${quiz.passScore}%.`
            },
            {
                text: `What is the best next step after finishing the lessons in "${quiz.course}"?`,
                options: [
                    'Take the quiz to validate what you learned',
                    'Restart the whole course immediately',
                    'Skip directly to the certificate',
                    'Ignore the remaining activities'
                ],
                correctAnswer: 0,
                explanation: 'The quiz is the validation step after the chapter learning content.'
            },
            {
                text: `What does a published quiz allow learners to do?`,
                options: [
                    'Attempt the assessment in the learning flow',
                    'Edit admin settings',
                    'Delete course chapters',
                    'Bypass progress tracking'
                ],
                correctAnswer: 0,
                explanation: 'Published quizzes are available to learners inside the course flow.'
            }
        ];

        return templates.slice(0, quiz.questions).map((item, index) => ({
            id: `${quiz.id}-${index + 1}`,
            text: item.text,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation
        }));
    }

    private normalizeChapters(chapters: TrainingChapter[], requestedCount: number) {
        if (chapters.length > 0) {
            return chapters.map((chapter, index) => ({
                name: chapter.name?.trim() || `Chapter ${index + 1}`,
                number: Number(chapter.number ?? index + 1) || index + 1,
                pdfUrl: chapter.pdfUrl?.trim() || '',
                sections: this.normalizeSections(chapter.sections, chapter.name || `Chapter ${index + 1}`)
            }));
        }

        const count = Math.max(1, Math.min(requestedCount || 1, 6));
        return Array.from({ length: count }, (_, index) => ({
            name: `Chapter ${index + 1}`,
            number: index + 1,
            pdfUrl: '',
            sections: this.normalizeSections([], `Chapter ${index + 1}`)
        }));
    }

    private normalizeSections(sections: TrainingSection[] | undefined, chapterName: string) {
        if (Array.isArray(sections) && sections.length > 0) {
            return sections.map((section, index) => ({
                name: section.name?.trim() || `${chapterName} - Lesson ${index + 1}`,
                completed: Boolean(section.completed)
            }));
        }

        return [
            { name: `${chapterName} overview`, completed: false },
            { name: `${chapterName} practice`, completed: false }
        ];
    }

    private fromCourseApi(course: CourseApiResponse): Training {
        return {
            id: course.id,
            title: course.title,
            description: course.description,
            type: course.type === 'Live classes' ? 'Live classes' : 'Blended course',
            status: course.status === 'Draft' ? 'Draft' : 'Published',
            level: course.level,
            image: course.image,
            banner: course.banner || course.image,
            slug: course.slug,
            action: course.action || 'Enroll now',
            instructor: course.instructor,
            category: course.category,
            chapters: Number(course.chapters ?? course.chaptersData?.length ?? 0),
            duration: course.duration,
            chaptersData: this.normalizeChapters(course.chaptersData ?? [], Number(course.chapters ?? course.chaptersData?.length ?? 0))
        };
    }

    private fromQuizApi(quiz: QuizApiResponse): Quiz {
        return this.normalizeQuiz({
            id: quiz.id,
            title: quiz.title,
            course: quiz.course,
            category: quiz.category,
            difficulty: quiz.difficulty as Quiz['difficulty'],
            questions: quiz.questions,
            duration: quiz.duration,
            passScore: quiz.passScore,
            status: quiz.status as Quiz['status'],
            items: quiz.items
        }, quiz.id);
    }

    private toCoursePayload(training: Training) {
        return {
            title: training.title.trim(),
            description: training.description.trim(),
            type: this.toCourseTypeApi(training.type),
            status: this.toCourseStatusApi(training.status),
            level: training.level.trim(),
            image: training.image.trim(),
            banner: (training.banner ?? training.image).trim(),
            instructor: (training.instructor ?? '').trim(),
            category: (training.category ?? '').trim(),
            chapters: Number(training.chapters ?? training.chaptersData?.length ?? 0),
            duration: (training.duration ?? '').trim(),
            chaptersData: (training.chaptersData ?? []).map((chapter, index) => ({
                name: chapter.name.trim(),
                number: Number(chapter.number ?? index + 1),
                pdfUrl: (chapter.pdfUrl ?? '').trim(),
                sections: (chapter.sections ?? []).map((section) => ({
                    name: section.name.trim(),
                    completed: Boolean(section.completed)
                }))
            }))
        };
    }

    private toQuizPayload(quiz: Quiz) {
        const items = this.normalizeQuizItems(quiz.items, quiz);

        return {
            title: quiz.title.trim(),
            course: quiz.course.trim(),
            category: quiz.category.trim(),
            difficulty: this.toQuizDifficultyApi(quiz.difficulty),
            questions: items.length,
            duration: quiz.duration.trim(),
            passScore: Number(quiz.passScore),
            status: this.toQuizStatusApi(quiz.status),
            items
        };
    }

    private toCourseTypeApi(type: TrainingType) {
        return type === 'Live classes' ? 'LIVE_CLASSES' : 'BLENDED_COURSE';
    }

    private toCourseStatusApi(status: TrainingStatus) {
        return status === 'Draft' ? 'DRAFT' : 'PUBLISHED';
    }

    private toQuizDifficultyApi(difficulty: Quiz['difficulty']) {
        switch (difficulty) {
            case 'Advanced':
                return 'ADVANCED';
            case 'Intermediate':
                return 'INTERMEDIATE';
            default:
                return 'BEGINNER';
        }
    }

    private toQuizStatusApi(status: Quiz['status']) {
        switch (status) {
            case 'Archived':
                return 'ARCHIVED';
            case 'Published':
                return 'PUBLISHED';
            default:
                return 'DRAFT';
        }
    }

    private upsertTraining(training: Training) {
        this.trainings.update((list) => {
            const index = list.findIndex((item) => item.id === training.id);
            if (index === -1) {
                return [...list, training];
            }

            const updated = [...list];
            updated[index] = training;
            return updated;
        });
    }

    private upsertQuiz(quiz: Quiz) {
        this.quizzes.update((list) => {
            const index = list.findIndex((item) => item.id === quiz.id);
            if (index === -1) {
                return [...list, quiz];
            }

            const updated = [...list];
            updated[index] = quiz;
            return updated;
        });
    }
}
