import { Injectable, signal } from '@angular/core';

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

@Injectable({
    providedIn: 'root'
})
export class DataService {
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
            description: "Tired of boring lectures? Get ready to roll up your sleeves and dive into action! This event is all about hands-on training.",
            date: 'Friday, 16 August 2025',
            location: 'Technopole, Sousse, Tunisia',
            time: 'from 11:00 am to 18:30 pm',
            image: '/images/event-1.jpg',
            badge: 'Past event',
            slug: 'freelancer-networking-night',
            type: 'past',
            overview: "Say goodbye to passive learning and hello to real, hands-on experience! This networking night is designed to bridge the gap between theory and practice.",
            expectations: [
                "Hands-on Workshops - No fluff, just practical training you can use immediately.",
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
