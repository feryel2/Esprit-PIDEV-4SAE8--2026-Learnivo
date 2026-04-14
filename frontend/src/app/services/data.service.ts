import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Training {
  id: number | string; title: string; description: string; type: string;
  level: string; price: number; image: string; slug: string; action: string;
  instructor?: string; category?: string; chapters?: number; duration?: string;
  banner?: string; aiScore?: number;
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
  id: number | string; name: string; email: string;
  phone?: string; motivation?: string;
  registeredAt: string;
  score?: number; errorsCount?: number; status: 'registered' | 'disqualified' | 'winner';
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
  likes: number; dislikes: number; score: number; userVote: 'LIKE' | 'DISLIKE' | null;
}
export interface Announcement {
  id: number; competitionId: number; title: string; content: string;
  type: 'INFO' | 'REMINDER' | 'RESULT' | 'ALERT'; createdAt: string;
}
export interface CompetitionRanking {
  competitionId: number; title: string; category: string; prize: string;
  image: string; slug: string; status: string; likes: number; dislikes: number;
  score: number; participantCount: number; rank: number;
}
export interface ExerciseTask {
  question: string; options: string[]; correctIndex: number; explanation: string;
}
export interface Exercise {
  id: number; title: string; category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string; points: number; icon: string; estimatedMinutes: number;
  tasks: ExerciseTask[];
}
export interface RecommendationProfile {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  dominantCategory: string;
  historyCategories: string[];
  weakestCategory: string | null;
  strengths: string[];
  accuracy: number;
  totalScore: number;
  totalErrors: number;
  participatedCount: number;
  completedCount: number;
  recommendedCompetitions: Competition[];
  recommendedExercises: Exercise[];
  recommendedContent: (Training & { aiScore: number })[];
}
export interface AttendanceRecord { date: string; attendees: (string | number)[]; }
export interface EnrolledStudent { id: number | string; name: string; email: string; enrolledAt: string; }
export interface ClassMaterial { title: string; url: string; type: 'pdf' | 'video' | 'link' | 'slide'; }
export interface PlatformClass {
  id: number | string; title: string; instructor: string; day: string;
  time: string; duration: string; level: string; type: string; link?: string;
  status: 'active' | 'cancelled' | 'full'; maxCapacity?: number;
  enrolled?: EnrolledStudent[]; attendance?: AttendanceRecord[];
  materials?: ClassMaterial[]; recurring?: boolean; notes?: string;
}

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function toClass(b: any): PlatformClass {
  return {
    id: b.id,
    title:       b.title       ?? b.titre      ?? '',
    instructor:  b.instructor  ?? b.instructeur ?? '',
    day:         b.day         ?? b.jour        ?? 'Monday',
    time:        b.time        ?? b.heure       ?? '',
    duration:    b.duration    ?? b.duree       ?? '',
    level:       b.level       ?? b.niveau      ?? '',
    type:        b.type        ?? 'Live Class',
    link:        b.link        ?? b.lien        ?? '',
    status:      (b.status     ?? b.statut      ?? 'active').toLowerCase(),
    maxCapacity: b.maxCapacity ?? b.capaciteMax ?? 20,
    recurring:   b.recurring   ?? b.recurrent   ?? true,
    notes:       b.notes       ?? '',
    enrolled:  (b.enrolled  ?? b.inscrits  ?? []).map((s: any) => ({ id: s.id, name: s.name ?? s.nom ?? '', email: s.email ?? '', enrolledAt: s.enrolledAt ?? s.dateInscription ?? '' })),
    attendance: (b.attendance ?? b.presences ?? []).map((r: any) => ({ date: r.date, attendees: r.attendees ?? r.presents ?? [] })),
    materials:  (b.materials  ?? b.materiaux ?? []).map((m: any) => ({ title: m.title ?? m.titre ?? '', url: m.url ?? '', type: m.type ?? 'link' })),
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
    title:            b.title         ?? b.titre      ?? b.nom ?? '',
    description:      b.description   ?? '',
    image:            b.image         ?? '/images/event-1.jpg',
    slug:             b.slug          ?? String(b.id),
    status:           (b.status       ?? b.statut     ?? 'upcoming').toLowerCase(),
    deadline:         b.deadline      ?? b.dateFin    ?? '',
    prize:            b.prize         ?? b.recompense ?? '',
    category:         b.category      ?? b.categorie  ?? '',
    tags:             b.tags          ?? [],
    startDate:        b.startDate     ?? '',
    maxParticipants:  b.maxParticipants ?? 0,
    resultsPublished: b.resultsPublished ?? b.resultatsPublies ?? false,
    rules:            b.rules         ?? b.regles     ?? '',
    rounds: (b.rounds ?? []).map((r: any) => ({
      name: r.name ?? r.nom ?? '',
      startDate: r.startDate ?? r.dateDebut ?? '',
      endDate: r.endDate ?? r.dateFin ?? '',
      status: (r.status ?? 'pending').toLowerCase()
    })),
    participants: (b.participants ?? []).map((p: any) => ({
      id: p.id, name: p.name ?? p.nom ?? '', email: p.email ?? '',
      phone: p.phone, motivation: p.motivation,
      registeredAt: p.registeredAt ?? p.dateInscription ?? '',
      score: p.score, errorsCount: p.errorsCount,
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
const GATEWAY = 'http://localhost:8081';
const CLASS_API = `${GATEWAY}/api`;
const COMP_API = `${GATEWAY}/api`;


// ─── Service ──────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {
    this.loadClasses();
    this.loadCompetitions();
  }

  classes      = signal<PlatformClass[]>([]);
  competitions = signal<Competition[]>([]);

  // ── Training catalogue (multi-category) ────────────────────────────────────
  trainings = signal<Training[]>([
    // Language / English
    { id: 1,  title: 'Speak Fluent English in 30 Days', description: 'Real-world conversations and practical speaking drills.', type: 'Blended training', level: 'Beginner', price: 350, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'speak-fluent-english', action: 'Purchase', instructor: 'Dr. Sarah Wilson', category: 'Language', chapters: 12, duration: '4 weeks' },
    { id: 2,  title: 'The Ultimate English Writing Masterclass', description: 'From Beginner to Pro — essays, reports, and storytelling.', type: 'Live classes', level: 'Mid-level', price: 369, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'english-writing-masterclass', action: 'Book your place', instructor: 'Mark Thompson', category: 'Language', chapters: 15, duration: '6 weeks' },
    { id: 3,  title: 'Advanced Accent & Fluency Masterclass', description: 'Sound like a native speaker in weeks with phonetic training.', type: 'Live classes', level: 'Advanced', price: 1400, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'accent-makeover', action: 'Purchase', instructor: 'Emma Watson', category: 'Language', chapters: 10, duration: '3 weeks' },
    // Coding / Programming
    { id: 4,  title: 'Python & Algorithms: From Zero to Hero', description: 'Master Python fundamentals, data structures, and algorithms.', type: 'Blended training', level: 'Beginner', price: 490, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'python-algorithms-zero-to-hero', action: 'Purchase', instructor: 'Karim Ben Ali', category: 'Coding', chapters: 18, duration: '6 weeks' },
    { id: 5,  title: 'Competitive Programming Bootcamp', description: 'Advanced problem solving, graph theory, and dynamic programming.', type: 'Live classes', level: 'Advanced', price: 890, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'competitive-programming-bootcamp', action: 'Book your place', instructor: 'Nour Mansour', category: 'Coding', chapters: 22, duration: '8 weeks' },
    { id: 6,  title: 'Web Development: HTML to Full-Stack', description: 'Build real projects with HTML, CSS, JavaScript, React, and Node.', type: 'Blended training', level: 'Mid-level', price: 650, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'web-development-full-stack', action: 'Purchase', instructor: 'Youssef Hammami', category: 'Coding', chapters: 24, duration: '10 weeks' },
    // Science / Physics / Chemistry
    { id: 7,  title: 'Physics Olympiad Prep: Mechanics & Waves', description: 'Systematic prep for Science and Physics competitions.', type: 'Blended training', level: 'Advanced', price: 720, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'physics-olympiad-prep', action: 'Purchase', instructor: 'Dr. Hana Trabelsi', category: 'Science', chapters: 16, duration: '6 weeks' },
    { id: 8,  title: 'Chemistry Lab & Theory Intensive', description: 'From atomic structure to organic chemistry for competitions.', type: 'Live classes', level: 'Mid-level', price: 580, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'chemistry-lab-intensive', action: 'Book your place', instructor: 'Dr. Imed Chaari', category: 'Science', chapters: 14, duration: '5 weeks' },
    { id: 9,  title: 'Intro to Sciences: Physics, Chemistry & Bio', description: 'Foundations for beginners joining their first Science competitions.', type: 'Blended training', level: 'Beginner', price: 350, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'intro-to-sciences', action: 'Purchase', instructor: 'Prof. Leila Saidi', category: 'Science', chapters: 20, duration: '8 weeks' },
    // Mathematics
    { id: 10, title: 'Math Olympiad Fundamentals', description: 'Number theory, combinatorics, and geometry for Math competitions.', type: 'Blended training', level: 'Intermediate', price: 420, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'math-olympiad-fundamentals', action: 'Purchase', instructor: 'Prof. Sami Gharbi', category: 'Math', chapters: 18, duration: '6 weeks' },
    { id: 11, title: 'Advanced Calculus & Linear Algebra', description: 'Deep dive into calculus, matrices, and vectors.', type: 'Live classes', level: 'Advanced', price: 750, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'advanced-calculus-linear-algebra', action: 'Book your place', instructor: 'Dr. Wafa Jebali', category: 'Math', chapters: 20, duration: '8 weeks' },
    // Robotics / AI
    { id: 12, title: 'Robotics Foundations: Build & Code', description: 'Sensors, motors, and decision logic for Robotics competitions.', type: 'Blended training', level: 'Beginner', price: 530, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'robotics-foundations', action: 'Purchase', instructor: 'Eng. Mehdi Zouaoui', category: 'Robotics', chapters: 15, duration: '5 weeks' },
    { id: 13, title: 'AI & Machine Learning for Competitors', description: 'Decision trees, neural networks, and reinforcement learning.', type: 'Live classes', level: 'Advanced', price: 980, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'ai-machine-learning-competitors', action: 'Book your place', instructor: 'Dr. Rana Slim', category: 'Robotics', chapters: 18, duration: '7 weeks' },
    // Arts / Creative
    { id: 14, title: 'Creative Writing & Storytelling Mastery', description: 'Character arcs, narrative structure, and creative expression.', type: 'Blended training', level: 'Mid-level', price: 310, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'creative-writing-mastery', action: 'Purchase', instructor: 'Sarah El Amouri', category: 'Arts', chapters: 12, duration: '4 weeks' },
    // Skills / Business / Public Speaking
    { id: 15, title: 'Public Speaking & Debate Bootcamp', description: 'Own the stage and win speaking competitions with structured training.', type: 'Live classes', level: 'Beginner', price: 280, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'public-speaking-debate', action: 'Book your place', instructor: 'Rania Oueslati', category: 'Skills', chapters: 10, duration: '3 weeks' },
    { id: 16, title: 'Business Strategy & Entrepreneurship', description: 'From idea to pitch — strategy, marketing, and leadership essentials.', type: 'Blended training', level: 'Intermediate', price: 450, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'business-strategy', action: 'Purchase', instructor: 'Dr. Anis Kallel', category: 'Skills', chapters: 14, duration: '5 weeks' },
    { id: 17, title: 'Leadership & Team Management', description: 'Build high-performance teams and lead with confidence.', type: 'Live classes', level: 'Advanced', price: 600, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'leadership-team-management', action: 'Book your place', instructor: 'Houda Chaabouni', category: 'Skills', chapters: 12, duration: '4 weeks' },
    // Music
    { id: 18, title: 'Music Theory & Composition Fundamentals', description: 'Scales, harmony, rhythm, and basic composition for music competitions.', type: 'Blended training', level: 'Beginner', price: 320, image: '/images/training-3.jpg', banner: '/images/course-banner.jpg', slug: 'music-theory-fundamentals', action: 'Purchase', instructor: 'Mariem Ben Salah', category: 'Music', chapters: 10, duration: '4 weeks' },
    { id: 19, title: 'Advanced Music Performance', description: 'Technique, interpretation, and performance skills for competitions.', type: 'Live classes', level: 'Advanced', price: 800, image: '/images/training-1.jpg', banner: '/images/course-banner.jpg', slug: 'advanced-music-performance', action: 'Book your place', instructor: 'Prof. Tarek Guerfali', category: 'Music', chapters: 16, duration: '6 weeks' },
    // Physics (separate from Science for specificity)
    { id: 20, title: 'Quantum Physics Masterclass', description: 'Wave-particle duality, quantum entanglement, and Heisenberg uncertainty.', type: 'Live classes', level: 'Advanced', price: 850, image: '/images/training-2.jpg', banner: '/images/course-banner.jpg', slug: 'quantum-physics-masterclass', action: 'Book your place', instructor: 'Dr. Faten Mejri', category: 'Physics', chapters: 14, duration: '6 weeks' },
  ]);

  clubs = signal<Club[]>([
    { id: 1, name: 'English Conversation Club', icon: '💬', description: 'Practice speaking with peers.', image: '/images/club-1.jpg', slug: 'english-conversation-club', members: 156 },
    { id: 2, name: 'Book & Storytelling Club', icon: '📚', description: 'Improve reading skills.', image: '/images/training-1.jpg', slug: 'book-storytelling-club', members: 89 },
    { id: 3, name: 'Drama & Roleplay Club', icon: '🎭', description: 'Boost confidence.', image: '/images/training-2.jpg', slug: 'drama-roleplay-club', members: 45 },
    { id: 4, name: 'Writing & Grammar Club', icon: '✍️', description: 'Enhance your writing skills.', image: '/images/training-3.jpg', slug: 'writing-grammar-club', members: 72 },
  ]);

  exercises = signal<Exercise[]>([
    {
      id: 1, title: 'HTML Mastery: Semantic Layouts', category: 'Coding', difficulty: 'Beginner',
      description: 'Practice building accessible web structures using header, nav, section, and footer elements.', points: 50, icon: '🌐', estimatedMinutes: 10,
      tasks: [
        { question: 'Which element is best for navigation links?', options: ['<nav>', '<div>', '<section>', '<ul>'], correctIndex: 0, explanation: '<nav> is the semantically correct element for navigation blocks.' },
        { question: 'Where does the main title go?', options: ['<h2>', '<h3>', '<h1>', '<h4>'], correctIndex: 2, explanation: '<h1> represents the primary heading of the page.' }
      ]
    },
    {
      id: 2, title: 'JavaScript Essentials: Arrays', category: 'Coding', difficulty: 'Intermediate',
      description: 'Explore map, filter, and reduce to transform data like a pro.', points: 100, icon: '📜', estimatedMinutes: 15,
      tasks: [
        { question: 'What does map() return?', options: ['A new array', 'A single value', 'Nothing', 'A boolean'], correctIndex: 0, explanation: 'map() creates a new array with the results of calling a function on every element.' },
        { question: 'Filter odd numbers from [1,2,3]?', options: ['[1,3]', '[2]', '[1,2,3]', '[]'], correctIndex: 0, explanation: 'Filter returns only elements that satisfy the condition (x % 2 !== 0).' }
      ]
    },
    {
      id: 13, title: 'Python: List Comprehensions', category: 'Coding', difficulty: 'Intermediate',
      description: 'Master concise and powerful list creation in Python.', points: 85, icon: '🐍', estimatedMinutes: 7,
      tasks: [
        { question: 'Correct syntax for list comprehension?', options: ['[x for x in list]', '{x in list}', '(x for x in list)', '[for x in list: x]'], correctIndex: 0, explanation: '[expression for item in iterable] is the standard syntax.' },
        { question: 'Filter even numbers from "nums"?', options: ['[x for x in nums if x%2==0]', '[x if x%2==0 in nums]', '[x for x in nums while x%2==0]', 'nums.filter(even)'], correctIndex: 0, explanation: 'The "if" clause at the end filters items.' }
      ]
    },
    {
      id: 14, title: 'Binary Search Mastery', category: 'Coding', difficulty: 'Advanced',
      description: 'Implement and optimize search in sorted datasets.', points: 150, icon: '🔍', estimatedMinutes: 10,
      tasks: [
        { question: 'Time complexity of Binary Search?', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], correctIndex: 2, explanation: 'Each step halves the search space — log₂(n).' },
        { question: 'Binary search requires the data to be?', options: ['Linked List', 'Sorted', 'Shuffled', 'Small'], correctIndex: 1, explanation: 'Binary search only works on sorted collections.' }
      ]
    },
    {
      id: 15, title: 'Biology: Cellular Respiration', category: 'Science', difficulty: 'Intermediate',
      description: 'Trace the path of energy from glucose to ATP.', points: 90, icon: '🧬', estimatedMinutes: 8,
      tasks: [
        { question: 'Where does Glycolysis occur?', options: ['Mitochondria', 'Cytoplasm', 'Nucleus', 'Ribosome'], correctIndex: 1, explanation: 'Glycolysis happens in the cytosol (cytoplasm).' },
        { question: 'Main byproduct of respiration?', options: ['Oxygen', 'Glucose', 'Carbon Dioxide', 'Nitrogen'], correctIndex: 2, explanation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP.' }
      ]
    },
    {
      id: 16, title: 'Advanced Genetics: DNA Replication', category: 'Science', difficulty: 'Advanced',
      description: 'Test your knowledge of helicase, polymerase, and Okazaki fragments.', points: 180, icon: '🧬', estimatedMinutes: 12,
      tasks: [
        { question: 'Enzyme that "unwinds" DNA?', options: ['Ligase', 'Helicase', 'Polymerase', 'Primase'], correctIndex: 1, explanation: 'Helicase breaks hydrogen bonds to unzip the double helix.' },
        { question: 'Replication occurs in what direction?', options: ['3\' to 5\'', '5\' to 3\'', 'Inward', 'Outward'], correctIndex: 1, explanation: 'DNA Polymerase only adds nucleotides to the 3\' end, so it grows 5\' → 3\'.' }
      ]
    },
    {
      id: 17, title: 'Mental Math: Multiplication Hacks', category: 'Math', difficulty: 'Beginner',
      description: 'Learn and apply shortcuts for large multiplication.', points: 40, icon: '🧠', estimatedMinutes: 4,
      tasks: [
        { question: 'Shortcut for multiplying by 11 (e.g., 23×11)?', options: ['Add a zero', 'Add the digits (2+3=5) and put in middle: 253', 'Multiply by 10 and subtract', 'Double the number'], correctIndex: 1, explanation: 'For 2-digit numbers: sum of digits in the middle leads to the answer.' }
      ]
    },
    {
      id: 18, title: 'Calculus: Derivatives 101', category: 'Math', difficulty: 'Advanced',
      description: 'Foundations of rates of change and tangent lines.', points: 160, icon: '📈', estimatedMinutes: 10,
      tasks: [
        { question: 'Derivative of x²?', options: ['x', '2x', 'x²', '2'], correctIndex: 1, explanation: 'Power rule: d/dx(x^n) = n*x^(n-1).' },
        { question: 'Derivative of a constant?', options: ['1', 'x', '0', 'Infinity'], correctIndex: 2, explanation: 'Rate of change of a constant is always zero.' }
      ]
    },
    {
      id: 19, title: 'Robotics 101: Sensors', category: 'Robotics', difficulty: 'Beginner',
      description: 'Identify and use ultrasonic and IR sensors.', points: 50, icon: '📡', estimatedMinutes: 5,
      tasks: [
        { question: 'Sensor used to measure distance via sound?', options: ['Infrared', 'Ultrasonic', 'Gyroscope', 'Light sensor'], correctIndex: 1, explanation: 'Ultrasonic triggers sound pulses and measures echo time.' }
      ]
    },
    {
      id: 20, title: 'Intermediate Arduino: PWM Control', category: 'Robotics', difficulty: 'Intermediate',
      description: 'Control LED brightness and motor speed with Pulse Width Modulation.', points: 100, icon: '🔌', estimatedMinutes: 8,
      tasks: [
        { question: 'PWM stands for?', options: ['Power Wave Management', 'Pulse Width Modulation', 'Programmed Wire Method', 'Peak Wave Mode'], correctIndex: 1, explanation: 'PWM controls output by varying the pulse width.' }
      ]
    },
    {
      id: 21, title: 'Art History: Renaissance Masters', category: 'Arts', difficulty: 'Beginner',
      description: 'Explore the works of Da Vinci, Michelangelo, and Raphael.', points: 45, icon: '🎨', estimatedMinutes: 6,
      tasks: [
        { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Van Gogh', 'Leonardo da Vinci', 'Donatello'], correctIndex: 2, explanation: 'Da Vinci painted the Mona Lisa in the early 16th century.' }
      ]
    },
    {
      id: 22, title: 'Advanced Digital Art: Layer Blending', category: 'Arts', difficulty: 'Advanced',
      description: 'Master Multiply, Screen, and Overlay modes for lighting.', points: 130, icon: '🖌️', estimatedMinutes: 10,
      tasks: [
        { question: 'Blending mode that darkens colors?', options: ['Screen', 'Overlay', 'Multiply', 'Add'], correctIndex: 2, explanation: 'Multiply multiplies pixel values, resulting in darker output.' }
      ]
    },
    {
      id: 23, title: 'Public Speaking: Body Language', category: 'Skills', difficulty: 'Intermediate',
      description: 'Use gestures and posture to command the room.', points: 70, icon: '🧍', estimatedMinutes: 6,
      tasks: [
        { question: 'Open palms generally signify?', options: ['Defensiveness', 'Honesty and openness', 'Aggression', 'Boredom'], correctIndex: 1, explanation: 'Showing palms is a universal sign of transparency.' }
      ]
    },
    {
      id: 24, title: 'Financial Literacy: Compound Interest', category: 'Skills', difficulty: 'Advanced',
      description: 'Calculate and understand the power of long-term investing.', points: 140, icon: '💰', estimatedMinutes: 9,
      tasks: [
        { question: 'Compound interest difference from simple?', options: ['Only on principal', 'Interest on interest', 'Fixed amount every year', 'Government tax'], correctIndex: 1, explanation: 'Compound interest builds on previous interest earned.' }
      ]
    },
    {
      id: 25, title: 'Intro to Physics: Kinematics', category: 'Physics', difficulty: 'Beginner',
      description: 'Velocity, acceleration, and displacement basics.', points: 55, icon: '🏎️', estimatedMinutes: 6,
      tasks: [
        { question: 'Speed with direction is called?', options: ['Mass', 'Momentum', 'Velocity', 'Acceleration'], correctIndex: 2, explanation: 'Velocity is a vector — speed + direction.' }
      ]
    },
    {
      id: 26, title: 'Optics: Reflection & Refraction', category: 'Physics', difficulty: 'Intermediate',
      description: 'Study how light behaves at mirrors and lenses.', points: 95, icon: '👓', estimatedMinutes: 8,
      tasks: [
        { question: 'Light bending when entering water?', options: ['Reflection', 'Refraction', 'Diffraction', 'Absorption'], correctIndex: 1, explanation: 'Refraction is bending due to change in speed.' }
      ]
    },
    {
      id: 27, title: 'Music Composition: Chord Progressions', category: 'Music', difficulty: 'Intermediate',
      description: 'Build emotion with I-IV-V and ii-V-I patterns.', points: 80, icon: '🎹', estimatedMinutes: 8,
      tasks: [
        { question: 'The "V" chord in C Major is?', options: ['F', 'G', 'Am', 'Dm'], correctIndex: 1, explanation: 'C(I)-D(ii)-E(iii)-F(IV)-G(V).' }
      ]
    },
    {
      id: 28, title: 'Jazz Theory: Improvisation', category: 'Music', difficulty: 'Advanced',
      description: 'Learn modes and tension tones for jazz solos.', points: 190, icon: '🎷', estimatedMinutes: 15,
      tasks: [
        { question: 'Standard "ii-V-I" in C?', options: ['Dm7-G7-Cmaj7', 'C-F-G', 'Am-D7-G', 'Em-A7-D'], correctIndex: 0, explanation: 'D minor (ii), G dominant (V), C major (I).' }
      ]
    },
    {
      id: 29, title: 'Cybersecurity: Phishing Defense', category: 'Coding', difficulty: 'Beginner',
      description: 'Identify and report social engineering attacks.', points: 65, icon: '🛡️', estimatedMinutes: 5,
      tasks: [
        { question: 'Best way to verify a suspicious bank email?', options: ['Click the link', 'Reply with password', 'Check the official site directly', 'Download attachment'], correctIndex: 2, explanation: 'Always use official channels, never email links.' }
      ]
    },
    {
      id: 30, title: 'Cloud Computing: Shared Responsibility', category: 'Coding', difficulty: 'Intermediate',
      description: 'Master AWS/Azure/GCP management models.', points: 110, icon: '☁️', estimatedMinutes: 7,
      tasks: [
        { question: 'In IaaS, who manages the OS?', options: ['The Cloud Provider', 'The Customer', 'The Robot', 'Nobody'], correctIndex: 1, explanation: 'In Infrastructure as a Service, the customer manages the OS and above.' }
      ]
    }
  ]);

  events = signal<PlatformEvent[]>([
    { id: 1, title: 'Freelancer & Entrepreneur Networking Night', description: 'Hands-on training.', date: 'Friday, 16 August 2025', location: 'Technopole, Sousse, Tunisia', time: 'from 11:00 am to 18:30 pm', image: '/images/event-1.jpg', badge: 'Past event', slug: 'freelancer-networking-night', type: 'past' },
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

  joinClass(classId: number | string, name: string, email: string): string | null {
    const cls = this.classes().find(c => c.id === classId);
    if (!cls) return 'Class not found.';
    if (cls.status === 'cancelled') return 'This class has been cancelled.';
    if ((cls.enrolled ?? []).some(s => s.email.toLowerCase() === email.toLowerCase()))
      return 'You are already enrolled in this class.';
    if ((cls.enrolled ?? []).length >= (cls.maxCapacity ?? Infinity))
      return 'Sorry, this class is full.';

    const student: EnrolledStudent = { id: Date.now(), name, email, enrolledAt: new Date().toISOString().slice(0, 10) };
    const newStatus: PlatformClass['status'] =
      (cls.enrolled ?? []).length + 1 >= (cls.maxCapacity ?? Infinity) ? 'full' : cls.status;
    const updated = { ...cls, enrolled: [...(cls.enrolled ?? []), student], status: newStatus };
    this.classes.update(list => list.map(c => c.id === classId ? updated : c));
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

  registerForCompetition(competitionId: number | string, name: string, email: string, phone?: string, motivation?: string): string | null {
    const comp = this.competitions().find(c => c.id === competitionId);
    if (!comp) return 'Competition not found.';
    if (comp.status === 'completed') return 'This competition has already ended.';
    if ((comp.participants ?? []).some(p => p.email.toLowerCase() === email.toLowerCase()))
      return 'This email is already registered for this competition.';

    const newP: Participant = { id: Date.now(), name, email, phone, motivation, registeredAt: new Date().toISOString().slice(0, 10), status: 'registered' };
    const updated = { ...comp, participants: [...(comp.participants ?? []), newP] };
    this.competitions.update(list => list.map(c => c.id === competitionId ? updated : c));

    this.http.post<any>(`${COMP_API}/competitions/${competitionId}/register`, { name, email, phone, motivation }).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) {
        this.competitions.update(list => list.map(c => {
          if (c.id === competitionId) {
            const filtered = (c.participants ?? []).filter(p => p.email.toLowerCase() !== email.toLowerCase());
            return { ...c, participants: [...filtered, toComp({ participants: [res] }).participants![0]] };
          }
          return c;
        }));
      }
    });
    return null;
  }

  // ── VOTES & CLASSEMENT ─────────────────────────────────────────────────────

  voteCompetition(competitionId: number | string, email: string, voteType: 'LIKE' | 'DISLIKE') {
    return this.http.post<VoteStats>(
      `${COMP_API}/competitions/${competitionId}/vote`,
      { email, voteType }
    ).pipe(catchError(() => of(null)));
  }

  getVoteStats(competitionId: number | string, email?: string) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.http.get<VoteStats>(
      `${COMP_API}/competitions/${competitionId}/votes${params}`
    ).pipe(catchError(() => of({ likes: 0, dislikes: 0, score: 0, userVote: null } as VoteStats)));
  }

  submitProject(competitionId: number | string, email: string, submissionUrl: string | null, submissionNotes: string | null, score?: number, errorsCount?: number) {
    return this.http.post<Participant>(
      `${COMP_API}/competitions/${competitionId}/submit`,
      { email, submissionUrl, submissionNotes, score, errorsCount }
    ).pipe(catchError(() => of(null)));
  }

  getCompetitionRanking() {
    return this.http.get<CompetitionRanking[]>(`${COMP_API}/competitions/ranking`)
      .pipe(catchError(() => of([])));
  }

  getRecommendations(email: string) {
    return this.http.get<Competition[]>(
      `${COMP_API}/competitions/recommendations?email=${encodeURIComponent(email)}`
    ).pipe(catchError(() => of([])));
  }

  // ── ANNONCES (news feed) ───────────────────────────────────────────────────

  getAnnouncements(competitionId: number | string) {
    return this.http.get<Announcement[]>(
      `${COMP_API}/competitions/${competitionId}/announcements`
    ).pipe(catchError(() => of([] as Announcement[])));
  }

  postAnnouncement(competitionId: number | string, title: string, content: string, type: string) {
    return this.http.post<Announcement>(
      `${COMP_API}/competitions/${competitionId}/announcements`,
      { title, content, type }
    ).pipe(catchError(() => of(null)));
  }

  deleteAnnouncement(announcementId: number) {
    return this.http.delete(
      `${COMP_API}/competitions/announcements/${announcementId}`
    ).pipe(catchError(() => of(null)));
  }

  // ── AI RECOMMENDATION ENGINE ───────────────────────────────────────────────

  /** Maps any competition category string to a canonical training/exercise category */
  private normalizeCategory(raw: string): string {
    const c = (raw ?? '').toLowerCase().trim();
    if (c.includes('cod') || c.includes('program') || c.includes('hack') || c.includes('dev') || c.includes('web') || c.includes('software')) return 'Coding';
    if (c.includes('physic') && !c.includes('bio'))  return 'Physics';
    if (c.includes('science') || c.includes('bio') || c.includes('chem') || c.includes('lab')) return 'Science';
    if (c.includes('math') || c.includes('algebra') || c.includes('calcul') || c.includes('statistic')) return 'Math';
    if (c.includes('robot') || c.includes(' ai ') || c.includes('machine') || c.includes('autonom') || c === 'ai') return 'Robotics';
    if (c.includes('art') || c.includes('creat') || c.includes('design') || c.includes('draw') || c.includes('paint')) return 'Arts';
    if (c.includes('music') || c.includes('song') || c.includes('instrument') || c.includes('melody')) return 'Music';
    if (c.includes('lang') || c.includes('english') || c.includes('french') || c.includes('arabic') || c.includes('writ') || c.includes('essay')) return 'Language';
    if (c.includes('skill') || c.includes('lead') || c.includes('manag') || c.includes('public') || c.includes('commun') || c.includes('debate') || c.includes('busi') || c.includes('entre') || c.includes('market') || c.includes('startup')) return 'Skills';
    return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'General';
  }

  /** Gets a full intelligent recommendation profile based on COMPLETED competition history.
   * fromComp: optional context injected directly from a just-completed competition.
   */
  getIntelligentProfile(
    email: string,
    fromComp?: { id: number | string; category: string; title: string }
  ): Observable<RecommendationProfile | null> {

    const allComps         = this.competitions();
    const allExercisesData = this.exercises();
    const allTrainingsData = this.trainings();

    // ── A: Scan localStorage for ALL competitions this email registered for ───
    // This covers locally-registered competitions not yet synced to backend.
    interface LocalEntry { compId: number | string; category: string; title: string; score: number; errors: number; status: string; }
    const localEntries: LocalEntry[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) ?? '';
        if (!key.startsWith('reg_comp_email_')) continue;
        const storedEmail = localStorage.getItem(key) ?? '';
        if (storedEmail.toLowerCase() !== email.toLowerCase()) continue;

        // Extract comp id: key = reg_comp_email_{id}
        const compId = key.replace('reg_comp_email_', '');

        // Find the competition in the loaded data
        const comp = allComps.find(c => String(c.id) === compId);
        if (!comp) continue;

        // Read its task submission
        let score  = 0;
        let errors = 0;
        try {
          const raw = localStorage.getItem(`submission_comp_${compId}`);
          if (raw) {
            const sub = JSON.parse(raw);
            if (sub.taskScore != null && sub.taskTotal != null && sub.taskTotal > 0) {
              score  = Math.round((sub.taskScore / sub.taskTotal) * 100);
              const results: any[] = sub.taskResults ?? [];
              errors = results.filter(r => !r.correct).length;
            }
          }
        } catch (_) { /* ignore */ }

        localEntries.push({
          compId: comp.id,
          category: comp.category,
          title: comp.title,
          score,
          errors,
          status: comp.status
        });
      }
    } catch (_) { /* localStorage not available */ }

    // ── B: Backend participants lookup ────────────────────────────────────────
    const backendParticipated = allComps.filter(c =>
      (c.participants ?? []).some(p => p.email.toLowerCase() === email.toLowerCase())
    );

    // ── C: Merge — union of local + backend, deduplicated by compId ──────────
    const seenIds = new Set<string | number>();
    interface AnalysisEntry { compId: number | string; category: string; title: string; score: number; errors: number; status: string; }
    const analysisPool: AnalysisEntry[] = [];

    // Add local entries first (they have real task scores)
    for (const e of localEntries) {
      seenIds.add(e.compId);
      analysisPool.push(e);
    }

    // Add backend entries (use backend score if available, or 0)
    for (const c of backendParticipated) {
      if (seenIds.has(c.id)) continue;
      const p = (c.participants ?? []).find(p => p.email.toLowerCase() === email.toLowerCase());
      let score  = p?.score       ?? 0;
      let errors = p?.errorsCount ?? 0;
      // Try localStorage fallback for this competition too
      try {
        if (score === 0) {
          const raw = localStorage.getItem(`submission_comp_${c.id}`);
          if (raw) {
            const sub = JSON.parse(raw);
            if (sub.taskScore != null && sub.taskTotal != null && sub.taskTotal > 0) {
              score  = Math.round((sub.taskScore / sub.taskTotal) * 100);
              const results: any[] = sub.taskResults ?? [];
              errors = results.filter(r => !r.correct).length;
            }
          }
        }
      } catch (_) { /* ignore */ }
      seenIds.add(c.id);
      analysisPool.push({ compId: c.id, category: c.category, title: c.title, score, errors, status: c.status });
    }

    // ── D: Inject fromComp if it's not already in the pool ───────────────────
    if (fromComp && !seenIds.has(fromComp.id)) {
      let score  = 0;
      let errors = 0;
      try {
        const raw = localStorage.getItem(`submission_comp_${fromComp.id}`);
        if (raw) {
          const sub = JSON.parse(raw);
          if (sub.taskScore != null && sub.taskTotal != null && sub.taskTotal > 0) {
            score  = Math.round((sub.taskScore / sub.taskTotal) * 100);
            const results: any[] = sub.taskResults ?? [];
            errors = results.filter(r => !r.correct).length;
          }
        }
      } catch (_) { /* ignore */ }
      analysisPool.push({ compId: fromComp.id, category: fromComp.category, title: fromComp.title, score, errors, status: 'completed' });
    }

    // ── E: Discovery mode — truly no data ────────────────────────────────────
    if (analysisPool.length === 0) {
      // If fromComp is provided, at least bootstrap the profile with that category
      const boostCat = fromComp ? this.normalizeCategory(fromComp.category) : null;
      const boostedTrainings = allTrainingsData.map(t => ({
        ...t,
        aiScore: boostCat && (t.category ?? '').toLowerCase() === boostCat.toLowerCase() ? 60 : 20
      })).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).slice(0, 3);

      return of({
        level: 'Beginner',
        dominantCategory: boostCat ?? 'General',
        historyCategories: boostCat ? [boostCat] : [],
        weakestCategory: null,
        strengths: [],
        accuracy: 100,
        totalScore: 0,
        totalErrors: 0,
        participatedCount: 0,
        completedCount: 0,
        recommendedCompetitions: allComps.filter(c => c.status !== 'completed').slice(0, 3),
        recommendedExercises:    allExercisesData.filter(e =>
          boostCat ? e.category === boostCat : e.difficulty === 'Beginner'
        ).slice(0, 4),
        recommendedContent: boostedTrainings
      });
    }

    // ── F: Focus analysis on completed entries ────────────────────────────────
    const completedEntries  = analysisPool.filter(e => e.status === 'completed');
    const analysisEntries   = completedEntries.length > 0 ? completedEntries : analysisPool;

    let totalScore  = 0;
    let totalErrors = 0;
    const catFrequency: Record<string, number>   = {};
    const catErrors:    Record<string, number>   = {};
    const catScores:    Record<string, number[]> = {};

    for (const e of analysisEntries) {
      const normCat = this.normalizeCategory(e.category);
      totalScore  += e.score;
      totalErrors += e.errors;
      catFrequency[normCat] = (catFrequency[normCat] || 0)  + 1;
      catErrors[normCat]    = (catErrors[normCat]    || 0)  + e.errors;
      catScores[normCat]    = [...(catScores[normCat] || []), e.score];
    }

    // If fromComp is provided, BOOST its normalized category weight x2
    if (fromComp) {
      const boostCat = this.normalizeCategory(fromComp.category);
      catFrequency[boostCat] = (catFrequency[boostCat] || 0) + 2; 
    }

    const sortedCats        = Object.entries(catFrequency).sort((a, b) => b[1] - a[1]);
    const historyCategories = sortedCats.map(([cat]) => cat);
    const dominantCategory  = historyCategories[0] ?? 'General';

    const sortedByErrors  = Object.entries(catErrors).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const weakestCategory = sortedByErrors.length > 0 ? sortedByErrors[0][0] : null;

    const strengths = Object.entries(catScores)
      .filter(([, scores]) => scores.reduce((a, b) => a + b, 0) / scores.length >= 70)
      .map(([cat]) => cat);

    const avgScore = analysisEntries.length > 0 ? totalScore / analysisEntries.length : 0;
    const level: 'Beginner' | 'Intermediate' | 'Advanced' =
      avgScore > 80 ? 'Advanced' : avgScore > 45 ? 'Intermediate' : 'Beginner';
    const accuracy = Math.max(0, Math.min(100,
      Math.round(100 - (totalErrors / Math.max(analysisEntries.length * 5, 1)) * 100)
    ));

    // ── G: Recommended open competitions ─────────────────────────────────────
    const joinedIds   = new Set(analysisPool.map(e => e.compId));
    const openComps   = allComps.filter(c => c.status !== 'completed' && !joinedIds.has(c.id));
    const matchDom    = openComps.filter(c => this.normalizeCategory(c.category) === dominantCategory);
    const matchHist   = openComps.filter(c =>
      historyCategories.includes(this.normalizeCategory(c.category)) &&
      this.normalizeCategory(c.category) !== dominantCategory
    );
    const recommendedCompetitions = [
      ...matchDom,
      ...matchHist,
      ...openComps.filter(c => !historyCategories.includes(this.normalizeCategory(c.category)))
    ].slice(0, 4);

    // ── H: Exercises ──────────────────────────────────────────────────────────
    // 1. Primary Remedial: Weakest category matching user's current level
    const remedialExs = weakestCategory
      ? allExercisesData.filter(e =>
          e.category.toLowerCase() === weakestCategory.toLowerCase() &&
          e.difficulty === level
        )
      : [];

    // 2. Secondary Remedial (Foundation): Weakest category at lower difficulty (bridging gaps)
    const foundationExs = weakestCategory
      ? allExercisesData.filter(e =>
          e.category.toLowerCase() === weakestCategory.toLowerCase() &&
          e.difficulty !== level &&
          (level === 'Advanced' || (level === 'Intermediate' && e.difficulty === 'Beginner'))
        )
      : [];

    // 3. History Match: Other categories the user has touched, matching current level
    const historyExs  = allExercisesData.filter(e =>
      historyCategories.some(cat => cat.toLowerCase() === e.category.toLowerCase())
      && !remedialExs.find(r => r.id === e.id)
      && !foundationExs.find(f => f.id === e.id)
      && e.difficulty === level
    );

    // 4. Exploration: Level-appropriate exercises from completely new categories
    const fillerExs   = allExercisesData.filter(e =>
      e.difficulty === level
      && !remedialExs.find(r => r.id === e.id)
      && !foundationExs.find(f => f.id === e.id)
      && !historyExs.find(h => h.id === e.id)
    );

    // Combined list, prioritized by remediation, capped at 12
    const recommendedExercises = [...remedialExs, ...foundationExs, ...historyExs, ...fillerExs].slice(0, 12);

    // ── I: AI-scored training courses ─────────────────────────────────────────
    const levelMap: Record<string, string[]> = {
      Beginner:     ['Beginner'],
      Intermediate: ['Beginner', 'Mid-level', 'Intermediate'],
      Advanced:     ['Mid-level', 'Advanced']
    };
    const acceptedLevels = levelMap[level];

    const scoredTrainings = allTrainingsData.map(t => {
      let aiScore = 0;
      const tCat  = (t.category ?? '').toLowerCase();

      if (historyCategories.find(c => c.toLowerCase() === tCat)) aiScore += 50;
      if (weakestCategory && weakestCategory.toLowerCase() === tCat) aiScore += 20;
      if (acceptedLevels.includes(t.level)) aiScore += 30;
      if (dominantCategory.toLowerCase() === tCat) aiScore += 10;
      // Extra boost if training matches the just-completed competition category
      if (fromComp && this.normalizeCategory(fromComp.category).toLowerCase() === tCat) aiScore = Math.min(aiScore + 25, 100);

      return { ...t, aiScore: Math.min(aiScore, 100) };
    });

    const recommended = scoredTrainings
      .filter(t => t.aiScore > 0)
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 4);

    const finalRecommendedContent = recommended.length > 0
      ? recommended
      : scoredTrainings.sort((a, b) => b.aiScore - a.aiScore).slice(0, 3);

    return of({
      level,
      dominantCategory,
      historyCategories,
      weakestCategory,
      strengths,
      accuracy,
      totalScore,
      totalErrors,
      participatedCount: analysisPool.length,
      completedCount:    completedEntries.length,
      recommendedCompetitions,
      recommendedExercises,
      recommendedContent: finalRecommendedContent
    });
  }

  // ── CRUD local trainings/clubs/events ─────────────────────────────────────
  addTraining(t: Training)            { this.trainings.update(x => [...x, { ...t, id: Date.now() }]); }
  updateTraining(t: Training)         { this.trainings.update(x => x.map(i => i.id === t.id ? t : i)); }
  deleteTraining(id: number | string) { this.trainings.update(x => x.filter(i => i.id !== id)); }
}
