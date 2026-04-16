import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
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
  aiScore?: number;
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
  recommendedContent: (Training & { aiScore: number })[];
  recommendedCompetitions: Competition[];
  recommendedExercises: Exercise[];
  remedialRoadmap: { compTitle: string; suggestedExercise: Exercise; reason: string }[];
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
    // ── CODING ───────────────────────────────────────────────────────────
    {
      id: 1, title: 'Deep Learning: Architecture & Gradients', category: 'AI & ML', difficulty: 'Advanced',
      description: 'Master backpropagation, vanishing gradients, and transformer architectures.', points: 250, icon: '🧠', estimatedMinutes: 25,
      tasks: [
        { question: 'Why use Layer Normalization in Transformers?', options: ['Reduces memory', 'Stabilizes training & faster convergence', 'Adds nonlinearity', 'Increases parameter count'], correctIndex: 1, explanation: 'LayerNorm helps keep activations in a healthy range.' },
        { question: 'Vanishing gradient problem is most common with?', options: ['ReLU', 'Sigmoid', 'Leaky ReLU', 'ELU'], correctIndex: 1, explanation: 'Sigmoid saturates at 0 and 1.' },
        { question: 'What does "Attention" compute in a Transformer?', options: ['Weight sum of values', 'Matrix inversion', 'Boolean logic', 'Data compression'], correctIndex: 0, explanation: 'Weights are determined by query-key compatibility.' },
        { question: 'The "Temperature" parameter in LLM sampling affects?', options: ['Model speed', 'Probability distribution flatness', 'Input length', 'GPU thermal limits'], correctIndex: 1, explanation: 'Controls randomness of the output.' },
        { question: 'Dropout helps prevent?', options: ['Slow training', 'Overfitting', 'Underfitting', 'Linearity'], correctIndex: 1, explanation: 'Forces the network to learn redundant representations.' }
      ]
    },
    {
      id: 2, title: 'Advanced Vulnerability Research', category: 'Cyber Research', difficulty: 'Advanced',
      description: 'Perform kernel-level exploit analysis and mitigation bypass.', points: 280, icon: '🛡️', estimatedMinutes: 30,
      tasks: [
        { question: 'ASLR bypass often requires?', options: ['More RAM', 'An information leak', 'A faster CPU', 'Administrator rights'], correctIndex: 1, explanation: 'Requires knowing an address to calculate offsets.' },
        { question: 'ROP (Return Oriented Programming) gadgets end with?', options: ['JMP', 'CALL', 'RET', 'NOP'], correctIndex: 2, explanation: 'RET allows jumping to the next gadget on the stack.' },
        { question: 'A "Race Condition" occurs when?', options: ['Two hackers compete', 'Program logic depends on timing of events', 'CPU is too hot', 'Memory is full'], correctIndex: 1, explanation: 'Unsynchronized access leads to TOCTOU bugs.' },
        { question: 'The "Same-Origin Policy" (SOP) is for?', options: ['Kernel security', 'Web browser security', 'File system access', 'Network routing'], correctIndex: 1, explanation: 'Prevents cross-origin data theft.' },
        { question: 'Heap spraying aims to?', options: ['Cool down PC', 'Predict vulnerable memory locations', 'Delete logs', 'Intercept Wi-Fi'], correctIndex: 1, explanation: 'Increases chance of jumping to shellcode.' }
      ]
    },

    // ── MATH ─────────────────────────────────────────────────────────────
    {
      id: 3, title: 'Analytic Number Theory: Zeta Function', category: 'Pure Math', difficulty: 'Advanced',
      description: 'Explore prime numbers and complex analysis.', points: 300, icon: '∑', estimatedMinutes: 30,
      tasks: [
        { question: 'Trivial zeros of searching Zeta?', options: ['Positive integers', 'Negative even integers', 'Prime numbers', 'Odd numbers'], correctIndex: 1, explanation: '-2, -4, -6...' },
        { question: 'Prime Number Theorem π(x) is?', options: ['log(x)', 'x * log(x)', 'x / log(x)', 'x²'], correctIndex: 2, explanation: 'Foundational result in number theory.' },
        { question: 'Riemann Hypothesis critical line is?', options: ['0', '1/2', '1', 'i'], correctIndex: 1, explanation: 'Re(s) = 1/2.' },
        { question: 'Euler product formula uses?', options: ['Integrals', 'Primes', 'Derivatives', 'Logs'], correctIndex: 1, explanation: 'Relates Zeta to primes p.' },
        { question: 'Functional equation relates s to?', options: ['1-s', 's²', '1/s', 'log(s)'], correctIndex: 0, explanation: 'Symmetry property.' }
      ]
    },
    {
      id: 4, title: 'Lattice-Based Cryptography', category: 'Applied Math', difficulty: 'Advanced',
      description: 'Design post-quantum security via Shortest Vector Problem (SVP).', points: 260, icon: '📐', estimatedMinutes: 25,
      tasks: [
        { question: 'Lattices are sets of?', options: ['Continuous points', 'Discrete points in n-dim space', 'Only integers', 'Curves'], correctIndex: 1, explanation: 'Integer combinations of basis vectors.' },
        { question: 'SVP is known to be?', options: ['NP-Hard', 'P-Time', 'Constant', 'Sub-linear'], correctIndex: 0, explanation: 'Shortest Vector Problem is computationally difficult.' },
        { question: 'Learning with Errors (LWE) adds?', options: ['Speed', 'Gaussian noise', 'Salt', 'Padding'], correctIndex: 1, explanation: 'Noise makes reversal difficult.' },
        { question: 'Shor\'s algorithm breaks?', options: ['Lattice-based', 'RSA and ECC', 'AES', 'SHA-256'], correctIndex: 1, explanation: 'Quantum computers factor integers quickly.' },
        { question: 'A "Basis" defines?', options: ['A single point', 'The whole lattice', 'Just the x-axis', 'A circle'], correctIndex: 1, explanation: 'Different bases can generate the same lattice.' }
      ]
    },

    // ── ROBOTICS ─────────────────────────────────────────────────────────
    {
      id: 5, title: 'Swarm Intelligence & SLAM', category: 'Aero-Robotics', difficulty: 'Advanced',
      description: 'Program decentralized coordination and mapping.', points: 220, icon: '🤖', estimatedMinutes: 20,
      tasks: [
        { question: 'Graph-based SLAM advantage?', options: ['Memory', 'Loop closure efficiency', 'No sensors', '2D only'], correctIndex: 1, explanation: 'Places revisited optimize the whole path.' },
        { question: 'Decentralized control avoids?', options: ['Speed', 'Sensors', 'Single point of failure', 'Complexity'], correctIndex: 2, explanation: 'No central leader required.' },
        { question: 'Odometry measures?', options: ['Obstacles', 'Change in position', 'Battery', 'Latency'], correctIndex: 1, explanation: 'Inferred from motor encoders.' },
        { question: 'Particle Filters are for?', options: ['Path planning', 'Non-Gaussian localization', 'Comms', 'Mechanical'], correctIndex: 1, explanation: 'Represented by a set of samples.' },
        { question: 'Lumen sensor measures?', options: ['Distance', 'Luminous flux', 'Heat', 'G-force'], correctIndex: 1, explanation: 'Total visible light emitted.' }
      ]
    },
    {
      id: 6, title: 'Humanoid Balance & ZMP', category: 'Bio-Robotics', difficulty: 'Advanced',
      description: 'Implement Push-Recovery and Gait Smoothing.', points: 240, icon: '🚶‍♀️', estimatedMinutes: 25,
      tasks: [
        { question: 'Zero Moment Point (ZMP) must stay?', options: ['Moving', 'Inside the support polygon', 'At the head', 'In the air'], correctIndex: 1, explanation: 'Required for static and dynamic stability.' },
        { question: 'In humanoid robotics, "Yaw" refers to?', options: ['Up/Down', 'Left/Right rotation', 'Side tilt', 'Speed'], correctIndex: 1, explanation: 'Rotation around the vertical axis.' },
        { question: 'IK (Inverse Kinematics) calculates?', options: ['Speed', 'Joint angles from position', 'Power', 'Weight'], correctIndex: 1, explanation: 'Essential for reaching targets.' },
        { question: 'PID controllers use?', options: ['History', 'Proportional, Integral, Derivative', 'AI', 'Random'], correctIndex: 1, explanation: 'Classic feedback loop.' },
        { question: 'Push-recovery uses?', options: ['Capture Point theory', 'Deletion', 'Sleep mode', 'Manual reset'], correctIndex: 0, explanation: 'Estimating where to step to avoid falling.' }
      ]
    },

    // ── PHYSICS ──────────────────────────────────────────────────────────
    {
      id: 7, title: 'Quantum: Shor & Bell', category: 'Quantum', difficulty: 'Advanced',
      description: 'Prove non-locality and implement factorization.', points: 230, icon: '⚛️', estimatedMinutes: 15,
      tasks: [
        { question: 'Bell\'s violation proves?', options: ['Local universe', 'Non-locality', 'Light speed', 'Gravity'], correctIndex: 1, explanation: 'No local hidden variables.' },
        { question: 'Entangled particles measurement is?', options: ['Delayed', 'Instant correlation', 'Independent', 'Slow'], correctIndex: 1, explanation: 'Spooky action at a distance.' },
        { question: 'Pauli exclusion applies to?', options: ['Bosons', 'Fermions', 'Photons', 'Gravitons'], correctIndex: 1, explanation: 'Cannot occupy same state.' },
        { question: 'Adiabatic process ΔU is?', options: ['Q', '-W', '0', 'mcΔT'], correctIndex: 1, explanation: 'Since Q = 0.' },
        { question: 'Cat experiment relates to?', options: ['Rights', 'Superposition', 'Heat', 'Sound'], correctIndex: 1, explanation: 'Macroscopic superposition absurdity.' }
      ]
    },
    {
      id: 8, title: 'Black Hole Event Horizons', category: 'Astrophysics', difficulty: 'Advanced',
      description: 'Model light deflection and accretion dynamics.', points: 270, icon: '🌌', estimatedMinutes: 25,
      tasks: [
        { question: 'Schwarzschild radius defines?', options: ['Core', 'Event Horizon', 'Spin', 'Color'], correctIndex: 1, explanation: 'Nothing returns from here.' },
        { question: 'Gravitational Lensing is?', options: ['Glass', 'Light bending near mass', 'Darkness', 'Speed boost'], correctIndex: 1, explanation: 'Predicted by General Relativity.' },
        { question: 'Hawking Radiation implies?', options: ['BH growth', 'BH evaporation', 'BH coldness', 'BH static'], correctIndex: 1, explanation: 'Black holes can lose mass.' },
        { question: 'Singularity is where?', options: ['Density becomes infinite', 'Light is white', 'Space is flat', 'Time stops'], correctIndex: 0, explanation: 'Equation breakdown.' },
        { question: 'Accretion disks emit?', options: ['Ice', 'X-rays', 'Only radio', 'Sound'], correctIndex: 1, explanation: 'Extreme heat from friction.' }
      ]
    },

    // ── SCIENCE ──────────────────────────────────────────────────────────
    {
      id: 9, title: 'Genetic Editing: CRISPR-Cas9', category: 'Bio-Science', difficulty: 'Advanced',
      description: 'Design precision gene edits and manage off-target effects.', points: 180, icon: '🧬', estimatedMinutes: 18,
      tasks: [
        { question: 'PAM sequence is for?', options: ['Transcription', 'Cas9 recognition', 'Protein folding', 'DNA replication'], correctIndex: 1, explanation: 'Essential for DNA binding.' },
        { question: 'Double-strand breaks repair via?', options: ['Mitosis', 'NHEJ or HDR', 'Osmosis', 'Diffusion'], correctIndex: 1, explanation: 'Standard cellular repair.' },
        { question: 'gRNA function?', options: ['Energy', 'Guides Cas9 to sequence', 'Transports oxygen', 'Stores fats'], correctIndex: 1, explanation: 'Complementary to target DNA.' },
        { question: 'Base editing benefit?', options: ['Faster', 'No double-strand break', 'Cheap', 'Easy'], correctIndex: 1, explanation: 'Atomic-level precision without cut.' },
        { question: 'Epigenetics refers to?', options: ['Sequence change', 'Expression change', 'Cell size', 'Metabolism'], correctIndex: 1, explanation: 'Reading DNA differently.' }
      ]
    },
    {
      id: 10, title: 'Nano-Materials & Carbon Capture', category: 'Materials', difficulty: 'Advanced',
      description: 'Design MOF structures for atmospheric filtration.', points: 210, icon: '💎', estimatedMinutes: 20,
      tasks: [
        { question: 'MOF stands for?', options: ['Metal-Organic Framework', 'Many Organic Fibers', 'Massive Ore Field', 'Minimal Oil Film'], correctIndex: 0, explanation: 'Porous materials used for gas capture.' },
        { question: 'Nanoscale is usually?', options: ['1-100nm', '1-100cm', '1-100m', '1-100um'], correctIndex: 0, explanation: 'Defined at atomic/molecular level.' },
        { question: 'Carbon Adsorption in MOFs is?', options: ['Chemical', 'Physisorption or Chemisorption', 'Liquid', 'Nuclear'], correctIndex: 1, explanation: 'Gas adheres to the surface.' },
        { question: 'Specific Surface Area of MOFs is?', options: ['Low', 'Incredibly high', 'Zero', 'Negative'], correctIndex: 1, explanation: 'Internal porosity provides massive area.' },
        { question: 'Graphene is a layer of?', options: ['Silicon', 'Carbon atoms', 'Gold', 'Plastic'], correctIndex: 1, explanation: 'Single layer in hex lattice.' }
      ]
    },

    // ── ARTS ─────────────────────────────────────────────────────────────
    {
      id: 11, title: 'UE5 Lighting (Nanite & Lumen)', category: 'Digital Arts', difficulty: 'Advanced',
      description: 'Master chromatic harmony and global illumination.', points: 190, icon: '🎨', estimatedMinutes: 25,
      tasks: [
        { question: 'Nanite advantage?', options: ['Shadows', 'Virtualized micro-polygons', 'Sound', 'Speed'], correctIndex: 1, explanation: 'Film-quality assets without LODs.' },
        { question: 'Lumen provides?', options: ['AI', 'Dynamic Global Illumination', 'Networking', 'Text'], correctIndex: 1, explanation: 'Real-time indirect lighting.' },
        { question: 'Vertex Displacement is for?', options: ['Color', 'Moving mesh via shader', 'Deletion', 'History'], correctIndex: 1, explanation: 'Small geometric details.' },
        { question: 'Master Material reduces?', options: ['Sky', 'Logic overhead via instances', 'Camera speed', 'Price'], correctIndex: 1, explanation: 'Sharing logic across assets.' },
        { question: 'Spatial Audio simulates?', options: ['Music', 'Directional propagation', 'Internet', 'Chat'], correctIndex: 1, explanation: 'Acoustic realism.' }
      ]
    },
    {
      id: 12, title: 'Diffusion Models & Aesthetic Finetuning', category: 'Generative Art', difficulty: 'Advanced',
      description: 'Train LoRA layers for consistent art style generation.', points: 170, icon: '🖼️', estimatedMinutes: 15,
      tasks: [
        { question: 'U-Net in diffusion architecture?', options: ['Denoises image', 'Speeds up CPU', 'Saves file', 'Draws lines'], correctIndex: 0, explanation: 'Iteratively refines noise into content.' },
        { question: 'Prompt weighing affects?', options: ['Font size', 'Influence of specific keywords', 'Color mode', 'Format'], correctIndex: 1, explanation: 'Emphasis on tokens.' },
        { question: 'CLIP model helps by?', options: ['Linking text to image concepts', 'Cutting hair', 'Compiling code', 'Playing audio'], correctIndex: 0, explanation: 'Contrastive Language-Image Pre-training.' },
        { question: 'Latent space refers to?', options: ['Compressed representation', 'Sleep mode', 'Hard drive', 'Cloud'], correctIndex: 0, explanation: 'Where math operations occur.' },
        { question: 'Inpainting is for?', options: ['Printing', 'Generating missing parts of image', 'Deleting files', 'Selling'], correctIndex: 1, explanation: 'Focused regeneration.' }
      ]
    },

    // ── LANGUAGE ─────────────────────────────────────────────────────────
    {
      id: 13, title: 'Authorship & Idiolect Profiling', category: 'Linguistics', difficulty: 'Advanced',
      description: 'Analyze authorship via syntax density mapping.', points: 200, icon: '🔍', estimatedMinutes: 20,
      tasks: [
        { question: 'Idiolect is?', options: ['Dialect', 'Individual language usage', 'Code', 'Error'], correctIndex: 1, explanation: 'Unique linguistic fingerprint.' },
        { question: 'Lexical Density means?', options: ['Weight', 'Content vs function words', 'Resolution', 'Font'], correctIndex: 1, explanation: 'Indicates informativity.' },
        { question: 'Stylometry uses?', options: ['Handwriting', 'Statistical word freq', 'Intuition', 'Ink'], correctIndex: 1, explanation: 'Quantitative method.' },
        { question: 'Syntactic Pattern?', options: ['Typos', 'Arrangement of phrases', 'Length', 'Color'], correctIndex: 1, explanation: 'Structural consistency.' },
        { question: 'Stylometry needs?', options: ['Short text', 'Large corpus', 'Slang', 'Translation'], correctIndex: 1, explanation: 'Statistical reliability.' }
      ]
    },
    {
      id: 14, title: 'Low-Resource Neural Translation', category: 'NLP', difficulty: 'Advanced',
      description: 'Train sparse self-attention models on limited corpora.', points: 180, icon: '🌐', estimatedMinutes: 18,
      tasks: [
        { question: 'Back-translation helps by?', options: ['Deleting data', 'Synthesizing training data', 'Fast loading', 'Reversing time'], correctIndex: 1, explanation: 'Augments low-resource datasets.' },
        { question: 'BLEU score measures?', options: ['Color', 'Translation quality vs reference', 'Speed', 'Battery'], correctIndex: 1, explanation: 'Bilingual Evaluation Understudy.' },
        { question: 'Cross-lingual embedding links?', options: ['Two networks', 'Words from different languages in same space', 'Two files', 'Two screens'], correctIndex: 1, explanation: 'Allows transfer learning.' },
        { question: 'Beam Search improves?', options: ['Decoding candidates', 'Internet speed', 'Cooling', 'Graphics'], correctIndex: 0, explanation: 'Explores multiple translation hypotheses.' },
        { question: 'Overfitting in low-resource settings?', options: ['Good', 'Memorizing small data instead of learning', 'Fast', 'Easy'], correctIndex: 1, explanation: 'Serious risk with small datasets.' }
      ]
    },

    // ── MUSIC ────────────────────────────────────────────────────────────
    {
      id: 15, title: 'Algorithmic Counterpoint Generation', category: 'AI Music', difficulty: 'Advanced',
      description: 'Combine classical theory with modern generative models.', points: 150, icon: '🎼', estimatedMinutes: 15,
      tasks: [
        { question: 'Parallel Fifth in species counterpoint?', options: ['Good', 'Encouraged', 'Forbidden', 'Optional'], correctIndex: 2, explanation: 'Avoided in traditional theory.' },
        { question: 'RNNs handle?', options: ['Speed', 'Sequential temporal data', 'Power', 'Screens'], correctIndex: 1, explanation: 'Keeps state over time.' },
        { question: 'Timbre is?', options: ['Pitch', 'Volume', 'Tone quality', 'Length'], correctIndex: 2, explanation: 'Distinguishes instruments.' },
        { question: 'GANs in music?', options: ['List notes', 'Competitive generator/discriminator', 'Noise', 'Slow'], correctIndex: 1, explanation: 'Generates realistic samples.' },
        { question: 'Cadence provide?', options: ['Fast beat', 'Resolution', 'Name', 'Singing'], correctIndex: 1, explanation: 'End of phrase signal.' }
      ]
    },
    {
      id: 16, title: 'FM & Wavetable Sound Design', category: 'Sound Design', difficulty: 'Advanced',
      description: 'Master harmonics and complex modulation routing.', points: 160, icon: '🎹', estimatedMinutes: 12,
      tasks: [
        { question: 'FM stands for?', options: ['Frequency Modulation', 'Fast Music', 'Full Mode', 'File Map'], correctIndex: 0, explanation: 'One oscillator modulates another.' },
        { question: 'Wavetable synthesis uses?', options: ['Tape', 'Cycles of recorded waveforms', 'Live mic', 'Static'], correctIndex: 1, explanation: 'Scanning through tables for movement.' },
        { question: 'ADSR envelope?', options: ['Fast', 'Attack Decay Sustain Release', 'Slow', 'Math'], correctIndex: 1, explanation: 'Volume over time shape.' },
        { question: 'Cutoff frequency relates to?', options: ['Volume', 'Filters (Low/High pass)', 'Pitch', 'Reverb'], correctIndex: 1, explanation: 'Where a filter starts working.' },
        { question: 'LFO is a?', options: ['Fast beat', 'Low Frequency Oscillator', 'Light', 'File'], correctIndex: 1, explanation: 'Used for modulation (vibrato, etc.).' }
      ]
    },

    // ── SKILLS ───────────────────────────────────────────────────────────
    {
      id: 17, title: 'Strategic Logistics for Space-Tech', category: 'Space Venture', difficulty: 'Advanced',
      description: 'Evaluate orbital logistics and interplanetary commerce.', points: 140, icon: '🚀', estimatedMinutes: 15,
      tasks: [
        { question: 'Kessler Syndrome risk?', options: ['Fuel', 'Satellite collision chain reaction', 'Health', 'Speed'], correctIndex: 1, explanation: 'Makes orbits unusable.' },
        { question: 'Lunar mining hurdle?', options: ['Rocks', 'Launch & return logistics cost', 'Cold', 'Net'], correctIndex: 1, explanation: 'Economic feasibility barrier.' },
        { question: 'GEO orbit is for?', options: ['Landing', 'Fixed telecommunications', 'Science', 'Travel'], correctIndex: 1, explanation: 'Fixed ground position.' },
        { question: 'Outer Space Treaty stipulate?', options: ['NASA only', 'No national appropriation', 'No mining', 'No tourists'], correctIndex: 1, explanation: 'Common heritage of mankind.' },
        { question: 'Delta-V is?', options: ['Price', 'Total velocity change required', 'Volume', 'Data'], correctIndex: 1, explanation: 'Energy budget for mission.' }
      ]
    },
    {
      id: 18, title: 'High-Stakes Crisis Decision Making', category: 'Strategic Leadership', difficulty: 'Advanced',
      description: 'Simulate leadership under systemic infrastructure failure.', points: 220, icon: '⚖️', estimatedMinutes: 20,
      tasks: [
        { question: 'Cognitive Bias in crisis?', options: ['Helps', 'Can lead to tunnel vision', 'Fast', 'Easy'], correctIndex: 1, explanation: 'Stresses affects objectivity.' },
        { question: '"Red Teaming" is?', options: ['A red car', 'Challenging plans with adversarial view', 'A team name', 'Painting'], correctIndex: 1, explanation: 'Improves robustness.' },
        { question: 'SWOT analysis?', options: ['Fast', 'Strengths Weaknesses Opportunities Threats', 'Slow', 'Math'], correctIndex: 1, explanation: 'Strategic planning tool.' },
        { question: 'Stakeholder communication in crisis?', options: ['Wait', 'Transparent and timely', 'Secret', 'None'], correctIndex: 1, explanation: 'Crucial for trust.' },
        { question: 'Risk Mitigation?', options: ['Ignoring', 'Reducing impact or likelihood', 'Escaping', 'Deleting'], correctIndex: 1, explanation: 'Proactive management.' }
      ]
    },

    // ── REMEDIAL & FOUNDATION (LEVELS 1 & 2) ─────────────────────────────
    
    // AI & ML (Remedial)
    {
      id: 101, title: 'Intro to Neural Networks', category: 'AI & ML', difficulty: 'Beginner',
      description: 'Understanding neurons, weights, and bias.', points: 100, icon: '💡', estimatedMinutes: 10,
      tasks: [ { question: 'What is a neuron weight?', options: ['Value', 'Strength of connection', 'Size', 'Color'], correctIndex: 1, explanation: 'Weights determine signal importance.' } ]
    },
    {
      id: 102, title: 'ML: Gradient Descent Basics', category: 'AI & ML', difficulty: 'Intermediate',
      description: 'The math behind minimizing loss functions.', points: 150, icon: '📉', estimatedMinutes: 15,
      tasks: [ { question: 'Learning rate too high causes?', options: ['Overshooting', 'Speed', 'Accuracy', 'Nothing'], correctIndex: 0, explanation: 'Can diverge and fail to find the minimum.' } ]
    },

    // Cyber Research (Remedial)
    {
      id: 103, title: 'Network Security Basics', category: 'Cyber Research', difficulty: 'Beginner',
      description: 'IP, TCP/IP, and firewall fundamentals.', points: 100, icon: '🕸️', estimatedMinutes: 10,
      tasks: [ { question: 'Purpose of a Firewall?', options: ['Heat', 'Filtering network traffic', 'Logging in', 'Speed'], correctIndex: 1, explanation: 'Blocks unauthorized access.' } ]
    },
    {
      id: 104, title: 'Web App Pentesting', category: 'Cyber Research', difficulty: 'Intermediate',
      description: 'OWASP Top 10 and SQL Injection.', points: 150, icon: '💉', estimatedMinutes: 15,
      tasks: [ { question: 'SQL injection target?', options: ['Database', 'CSS', 'HTML', 'Images'], correctIndex: 0, explanation: 'Exploits insecure query construction.' } ]
    },

    // Aero-Robotics (Remedial)
    {
      id: 105, title: 'Intro to Drones', category: 'Aero-Robotics', difficulty: 'Beginner',
      description: 'Motors, propellers, and flight theory.', points: 100, icon: '🚁', estimatedMinutes: 10,
      tasks: [ { question: 'Quadcopter has how many motors?', options: ['2', '4', '6', '1'], correctIndex: 1, explanation: 'Standard configuration.' } ]
    },
    {
      id: 106, title: 'ROS Basics (Robot OS)', category: 'Aero-Robotics', difficulty: 'Intermediate',
      description: 'Nodes, topics, and messages.', points: 150, icon: '📻', estimatedMinutes: 15,
      tasks: [ { question: 'ROS Topic is a?', options: ['Bus for data', 'File', 'User', 'IP'], correctIndex: 0, explanation: 'Asynchronous communication channel.' } ]
    },

    // Quantum (Remedial)
    {
      id: 107, title: 'Quantum Logic Gates', category: 'Quantum', difficulty: 'Beginner',
      description: 'X, Y, Z, and Hadamard gates.', points: 100, icon: '🔑', estimatedMinutes: 10,
      tasks: [ { question: 'Hadamard gate creates?', options: ['Zero', 'Superposition', 'Heat', 'Noise'], correctIndex: 1, explanation: 'Map |0> to (|0> + |1>)/sqrt(2).' } ]
    },
    {
      id: 108, title: 'Circuit Simulation', category: 'Quantum', difficulty: 'Intermediate',
      description: 'Building circuits with multiple qubits.', points: 150, icon: '🛰️', estimatedMinutes: 15,
      tasks: [ { question: 'Controlled-NOT (CNOT) target depends on?', options: ['Control qubit', 'Weather', 'User', 'Time'], correctIndex: 0, explanation: 'Flips target if control is |1>.' } ]
    },

    // Bio-Science (Remedial)
    {
      id: 109, title: 'DNA Structure 101', category: 'Bio-Science', difficulty: 'Beginner',
      description: 'Nucleotides and the double helix.', points: 100, icon: '🧬', estimatedMinutes: 10,
      tasks: [ { question: 'A pairs with?', options: ['T', 'G', 'C', 'A'], correctIndex: 0, explanation: 'Adenine pairs with Thymine.' } ]
    },
    {
      id: 110, title: 'Gene Expression', category: 'Bio-Science', difficulty: 'Intermediate',
      description: 'Transcription and Translation.', points: 150, icon: '🧾', estimatedMinutes: 15,
      tasks: [ { question: 'RNA is transcribed from?', options: ['DNA', 'Protein', 'Carbs', 'Fats'], correctIndex: 0, explanation: 'Central dogma of biology.' } ]
    },

    // Space Venture (Remedial)
    {
      id: 111, title: 'NewSpace Industry Start', category: 'Space Venture', difficulty: 'Beginner',
      description: 'Private space flight and small-sats.', points: 100, icon: '🚀', estimatedMinutes: 10,
      tasks: [ { question: 'What is a CubeSat?', options: ['Fruit', 'Miniaturized satellite', 'Rocket', 'Engine'], correctIndex: 1, explanation: 'Standardized 10cm cube units.' } ]
    },
    {
      id: 112, title: 'Orbital Mechanics 101', category: 'Space Venture', difficulty: 'Intermediate',
      description: 'Keplerian elements and LEO.', points: 150, icon: '🛰️', estimatedMinutes: 15,
      tasks: [ { question: 'LEO stands for?', options: ['Low Earth Orbit', 'Long End Orbit', 'Level One', 'Large'], correctIndex: 0, explanation: 'Common range for imaging/comm sats.' } ]
    },
    // Math (Remedial)
    {
      id: 113, title: 'Algebra Fundamentals', category: 'Math', difficulty: 'Beginner',
      description: 'Master variables, equations, and basic functions.', points: 100, icon: '📐', estimatedMinutes: 10,
      tasks: [ { question: 'If 2x = 10, what is x?', options: ['2', '5', '8', '20'], correctIndex: 1, explanation: 'Divide both sides by 2.' } ]
    },
    // Coding (Remedial)
    {
      id: 114, title: 'Python Syntax Basics', category: 'Coding', difficulty: 'Beginner',
      description: 'Indentation, variables, and data types.', points: 100, icon: '🐍', estimatedMinutes: 10,
      tasks: [ { question: 'Which is a valid variable name in Python?', options: ['1_var', 'var_1', 'var-1', 'while'], correctIndex: 1, explanation: 'Variables cannot start with digits or contain hyphens.' } ]
    },
    // Science (Remedial)
    {
      id: 115, title: 'The Scientific Method', category: 'Science', difficulty: 'Beginner',
      description: 'Observation, hypothesis, and experimentation.', points: 100, icon: '🧪', estimatedMinutes: 10,
      tasks: [ { question: 'A testable prediction is called?', options: ['Fact', 'Hypothesis', 'Theory', 'Result'], correctIndex: 1, explanation: 'A hypothesis is a proposed explanation for an observation.' } ]
    },
    // Linguistics (Remedial)
    {
      id: 116, title: 'Intro to Syntax & Semantics', category: 'Linguistics', difficulty: 'Beginner',
      description: 'How sentences are built and meaning is derived.', points: 100, icon: '✍️', estimatedMinutes: 10,
      tasks: [ { question: 'Syntax refers to?', options: ['Word meaning', 'Sentence structure', 'Sound', 'History'], correctIndex: 1, explanation: 'Syntax is the arrangement of words to create well-formed sentences.' } ]
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
    ).pipe(
      tap(participant => {
        if (participant) {
          this.competitions.update(list => list.map(c => {
            if (c.id === competitionId) {
              const others = (c.participants ?? []).filter(p => p.email.toLowerCase() !== email.toLowerCase());
              return { ...c, participants: [...others, participant] };
            }
            return c;
          }));
        }
      }),
      catchError(() => of(null))
    );
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

  publishResults(id: number | string): Observable<Competition | null> {
    return this.http.post<Competition>(`${COMP_API}/competitions/${id}/publish`, {}).pipe(
      catchError(() => of(null))
    );
  }

  // ── AI RECOMMENDATION ENGINE (HARDENED v2) ─────────────────────────────────

  private getParticipantStatus(email: string): { compId: number | string; category: string; title: string; score: number; errors: number; status: string }[] {
    const allComps = this.competitions();
    const pool: any[] = [];
    
    // 1. Check backend participation
    for (const c of allComps) {
      const p = (c.participants ?? []).find(p => p.email.toLowerCase() === email.toLowerCase());
      if (p) {
        pool.push({
          compId: c.id,
          category: c.category,
          title: c.title,
          score: p.score ?? 0,
          errors: p.errorsCount ?? 0,
          status: (p.score != null || p.submissionUrl) ? 'completed' : 'registered'
        });
      }
    }
    
    // 2. Check local storage for recent task submissions (causal mapping)
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('submission_comp_')) {
          const cid = key.replace('submission_comp_', '');
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.email?.toLowerCase() === email.toLowerCase()) {
            const comp = allComps.find(c => String(c.id) === cid);
            if (comp && !pool.find(x => String(x.compId) === cid)) {
              pool.push({
                compId: comp.id,
                category: comp.category,
                title: comp.title,
                score: data.taskScore ? Math.round((data.taskScore / data.taskTotal) * 100) : 0,
                errors: data.taskResults ? data.taskResults.filter((r: any) => !r.correct).length : 0,
                status: 'completed'
              });
            }
          }
        }
      }
    } catch (_) {}

    return pool;
  }

  normalizeCategory(cat: string): string {
    const c = (cat || 'General').toLowerCase();
    if (c.includes('ai') || c.includes('learn')) return 'AI & ML';
    if (c.includes('math') || c.includes('pure')) return 'Math';
    if (c.includes('cyber') || c.includes('exploit') || c.includes('research')) return 'Cyber Research';
    if (c.includes('drone') || c.includes('robot') || c.includes('aero')) return 'Aero-Robotics';
    if (c.includes('quant')) return 'Quantum';
    if (c.includes('bio') || c.includes('genet')) return 'Bio-Science';
    if (c.includes('art') || c.includes('design')) return 'Digital Arts';
    if (c.includes('lang') || c.includes('lingu') || c.includes('english')) return 'Linguistics';
    if (c.includes('music')) return 'Music';
    if (c.includes('space') || c.includes('tech') || c.includes('venture')) return 'Space Venture';
    if (c.includes('leader') || c.includes('manage') || c.includes('crisis')) return 'Strategic Leadership';
    if (c.includes('code') || c.includes('prog') || c.includes('dev')) return 'Coding';
    if (c.includes('sci')) return 'Science';
    return cat || 'General';
  }

  getIntelligentProfile(currentUserEmail: string, fromComp?: Competition): Observable<RecommendationProfile> {
    const allComps      = this.competitions();
    const allExercisesData = this.exercises();
    const allTrainingsData = this.trainings();
    
    const analysisPool = this.getParticipantStatus(currentUserEmail);
    const completedEntries = analysisPool.filter(e => e.status === 'completed' || e.score > 0);
    const analysisEntries  = completedEntries.length > 0 ? completedEntries : analysisPool;

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

    if (fromComp) {
      const boostCat = this.normalizeCategory(fromComp.category);
      catFrequency[boostCat] = (catFrequency[boostCat] || 0) + 3; 
    }

    const sortedCats        = Object.entries(catFrequency).sort((a, b) => b[1] - a[1]);
    let historyCategories = sortedCats.map(([cat]) => cat);
    
    // Fallback for new users: suggest core categories
    if (historyCategories.length === 0) {
      historyCategories = ['Coding', 'Math', 'Science', 'Linguistics'];
    }
    
    const dominantCategory  = historyCategories[0];

    // Remedial Logic: Find category with highest error density
    const sortedByErrors  = Object.entries(catErrors).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
    const weakestCategory = sortedByErrors.length > 0 ? sortedByErrors[0][0] : null;

    const strengths = Object.entries(catScores)
      .filter(([, scores]) => scores.length > 0 && (scores.reduce((a, b) => a + b, 0) / scores.length) >= 75)
      .map(([cat]) => cat);

    const avgScore = analysisEntries.length > 0 ? totalScore / analysisEntries.length : 0;
    const level: 'Beginner' | 'Intermediate' | 'Advanced' =
      avgScore > 75 ? 'Advanced' : avgScore > 40 ? 'Intermediate' : 'Beginner';
    
    const accuracy = Math.max(0, Math.min(100,
      Math.round(100 - (totalErrors / Math.max(analysisEntries.length * 5, 1)) * 100)
    ));

    // ── G: Recommended Competitions ──────────────────────────────────────────
    const joinedIds   = new Set(analysisPool.map(e => e.compId));
    const scoredComps = allComps
      .filter(c => c.status !== 'completed' && !joinedIds.has(c.id))
      .map(c => {
        let aiScore = 50; 
        const cCat = this.normalizeCategory(c.category);
        if (cCat === dominantCategory) aiScore += 30;
        if (historyCategories.includes(cCat)) aiScore += 10;
        if (weakestCategory && cCat === weakestCategory) aiScore += 15;
        return { ...c, aiScore: Math.min(aiScore, 100) } as Competition & { aiScore: number };
      })
      .sort((a, b) => (b as any).aiScore - (a as any).aiScore);

    const recommendedCompetitions = scoredComps.slice(0, 4);

    // ── H: Remedial Practice Exercises (Step-Down Logic) ────────────────────
    const remedialLevel = (level === 'Advanced') ? 'Intermediate' : 'Beginner';
    const remedialExs = weakestCategory
      ? allExercisesData.filter(e =>
          this.normalizeCategory(e.category).toLowerCase() === weakestCategory.toLowerCase() &&
          e.difficulty === remedialLevel
        )
      : [];

    const historyExs = allExercisesData.filter(e =>
      this.normalizeCategory(e.category).toLowerCase() === dominantCategory.toLowerCase() &&
      e.difficulty === level &&
      !remedialExs.find(r => r.id === e.id)
    );

    const recommendedExercises = [...remedialExs, ...historyExs].slice(0, 8);

    // ── H.2: Targeted Remedial Roadmap ──────────────────────────────────────
    const remedialRoadmap: { compTitle: string; suggestedExercise: Exercise; reason: string }[] = [];
    const struggles = analysisPool.filter(p => (p.score > 0 && p.score < 60) || p.errors > 3);
    for (const s of struggles.slice(0, 3)) {
      const normCat = this.normalizeCategory(s.category);
      const exercise = allExercisesData.find(e => 
        this.normalizeCategory(e.category) === normCat && 
        e.difficulty === remedialLevel
      );
      if (exercise) {
        remedialRoadmap.push({
          compTitle: s.title,
          suggestedExercise: exercise,
          reason: s.score < 60 ? `Score of ${s.score}% indicates foundation gaps` : `High error density (${s.errors} errors) detected`
        });
      }
    }

    // ── I: Related Training ──────────────────────────────────────────────────
    const scoredTrainings = allTrainingsData.map(t => {
      let aiScore = 0;
      const tCat  = this.normalizeCategory(t.category ?? '').toLowerCase();
      if (historyCategories.find(c => c.toLowerCase() === tCat)) aiScore += 40;
      if (weakestCategory && weakestCategory.toLowerCase() === tCat) aiScore += 40;
      if (dominantCategory.toLowerCase() === tCat) aiScore += 20;
      return { ...t, aiScore: Math.min(aiScore, 100) };
    });

    const finalRecommendedContent = scoredTrainings
      .filter(t => t.aiScore > 0)
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 4);

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
      completedCount: analysisPool.length, // Using analysisPool size as proxy for completed
      recommendedContent: finalRecommendedContent,
      recommendedCompetitions,
      recommendedExercises,
      remedialRoadmap
    });
  }

  addTraining(t: Training)            { this.trainings.update(x => [...x, { ...t, id: Date.now() }]); }
  updateTraining(t: Training)         { this.trainings.update(x => x.map(i => i.id === t.id ? t : i)); }
  deleteTraining(id: number | string) { this.trainings.update(x => x.filter(i => i.id !== id)); }
}
