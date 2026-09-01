'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthState = 'unauthenticated' | 'select-subject' | 'authenticated';
export type DashboardView = 'home' | 'learning' | 'practice' | 'resources' | 'ai' | 'progress';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    joinedAt: Date;
}

export interface Subject {
    id: string;
    name: string;
    emoji: string;
    color: string;
    gradient: string;
    chapters: Chapter[];
    progress: number;
    mastery: number;
}

export interface Chapter {
    id: string;
    title: string;
    topics: Topic[];
    completed: boolean;
}

export interface Topic {
    id: string;
    title: string;
    completed: boolean;
    weak?: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    subject: string;
    difficulty: Difficulty;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export interface ProgressData {
    studyTime: number;
    streak: number;
    questionsAnswered: number;
    accuracy: number;
    subjectMastery: { [subjectId: string]: number };
    weakTopics: { topic: string; subject: string }[];
    studyDays: boolean[];
}

// ─── Context Interface ────────────────────────────────────────────────────────

interface AppContextType {
    // Auth
    authState: AuthState;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => void;

    // Active Subject (single selected subject — persisted)
    activeSubject: Subject | null;
    selectSubject: (subjectId: string, customName?: string) => void;
    changeSubject: () => void; // returns user to select-subject screen

    // Navigation
    currentView: DashboardView;
    setCurrentView: (view: DashboardView) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;

    // All available subjects data
    allSubjects: Subject[];

    // Learning drill-down (which chapter/topic is open inside Learning view)
    learningSubject: Subject | null;
    setLearningSubject: (s: Subject | null) => void;
    selectedChapter: Chapter | null;
    setSelectedChapter: (c: Chapter | null) => void;
    selectedTopic: Topic | null;
    setSelectedTopic: (t: Topic | null) => void;

    // Practice
    currentQuiz: QuizQuestion[];
    quizResults: { correct: number; total: number } | null;
    setQuizResults: (r: { correct: number; total: number }) => void;

    // AI Chat
    chatMessages: ChatMessage[];
    addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    clearChat: () => void;
    aiLoading: boolean;
    setAiLoading: (v: boolean) => void;
    sendAiMessage: (message: string) => Promise<void>;

    // Progress
    progress: ProgressData;

    // Notifications
    notifications: { id: string; message: string; type: 'info' | 'success' | 'warning' }[];
    addNotification: (msg: string, type?: 'info' | 'success' | 'warning') => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── LocalStorage Keys ────────────────────────────────────────────────────────

const LS_ACTIVE_SUBJECT = 'eduai_active_subject';
const LS_AUTH_USER = 'eduai_user';

// ─── All Subjects Data ────────────────────────────────────────────────────────

export const SUBJECTS_DATA: Subject[] = [
    {
        id: 'physics',
        name: 'Physics',
        emoji: '⚡',
        color: '#818cf8',
        gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
        progress: 68,
        mastery: 72,
        chapters: [
            {
                id: 'ph-1', title: 'Mechanics', completed: true,
                topics: [
                    { id: 'ph-1-1', title: "Relative Motion in One Dimension", completed: true },
                    { id: 'ph-1-2', title: "Newton's Laws of Motion", completed: true },
                    { id: 'ph-1-3', title: 'Work, Energy and Power', completed: true },
                    { id: 'ph-1-4', title: 'Circular Motion', completed: false, weak: true },
                ]
            },
            {
                id: 'ph-2', title: 'Thermodynamics', completed: false,
                topics: [
                    { id: 'ph-2-1', title: 'Laws of Thermodynamics', completed: true },
                    { id: 'ph-2-2', title: 'Heat Transfer', completed: false },
                    { id: 'ph-2-3', title: 'Kinetic Theory of Gases', completed: false },
                ]
            },
            {
                id: 'ph-3', title: 'Electromagnetism', completed: false,
                topics: [
                    { id: 'ph-3-1', title: "Moving Coil Galvanometer", completed: false },
                    { id: 'ph-3-2', title: "Coulomb's Law & Electric Field", completed: false },
                    { id: 'ph-3-3', title: 'Magnetic Force', completed: false, weak: true },
                    { id: 'ph-3-4', title: 'Electromagnetic Induction', completed: false },
                ]
            }
        ]
    },
    {
        id: 'mathematics',
        name: 'Mathematics',
        emoji: '📐',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4, #6366f1)',
        progress: 82,
        mastery: 85,
        chapters: [
            {
                id: 'ma-1', title: 'Calculus', completed: true,
                topics: [
                    { id: 'ma-1-1', title: 'Limits & Continuity', completed: true },
                    { id: 'ma-1-2', title: 'Differentiation', completed: true },
                    { id: 'ma-1-3', title: 'Integration', completed: true },
                ]
            },
            {
                id: 'ma-2', title: 'Algebra', completed: false,
                topics: [
                    { id: 'ma-2-1', title: 'Matrices & Determinants', completed: true },
                    { id: 'ma-2-2', title: 'Complex Numbers', completed: false, weak: true },
                    { id: 'ma-2-3', title: 'Quadratic Equations', completed: true },
                ]
            },
            {
                id: 'ma-3', title: 'Probability & Statistics', completed: false,
                topics: [
                    { id: 'ma-3-1', title: 'Basic Probability', completed: false, weak: true },
                    { id: 'ma-3-2', title: 'Permutations & Combinations', completed: false },
                    { id: 'ma-3-3', title: 'Statistics', completed: false },
                ]
            }
        ]
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        emoji: '🧪',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
        progress: 55,
        mastery: 58,
        chapters: [
            {
                id: 'ch-1', title: 'Atomic Structure', completed: true,
                topics: [
                    { id: 'ch-1-1', title: 'Bohr Model', completed: true },
                    { id: 'ch-1-2', title: 'Quantum Numbers', completed: true },
                ]
            },
            {
                id: 'ch-2', title: 'Chemical Bonding', completed: false,
                topics: [
                    { id: 'ch-2-1', title: 'Ionic & Covalent Bonds', completed: false, weak: true },
                    { id: 'ch-2-2', title: 'VSEPR Theory', completed: false },
                ]
            },
            {
                id: 'ch-3', title: 'Organic Chemistry', completed: false,
                topics: [
                    { id: 'ch-3-1', title: 'Hydrocarbons', completed: false },
                    { id: 'ch-3-2', title: 'Functional Groups', completed: false, weak: true },
                ]
            }
        ]
    },
    {
        id: 'history',
        name: 'History',
        emoji: '📜',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
        progress: 40,
        mastery: 45,
        chapters: [
            {
                id: 'hi-1', title: 'Ancient Civilizations', completed: false,
                topics: [
                    { id: 'hi-1-1', title: 'Indus Valley Civilization', completed: true },
                    { id: 'hi-1-2', title: 'Egyptian Empire', completed: false },
                ]
            },
            {
                id: 'hi-2', title: 'World Wars', completed: false,
                topics: [
                    { id: 'hi-2-1', title: 'World War I Causes', completed: false, weak: true },
                    { id: 'hi-2-2', title: 'World War II', completed: false },
                ]
            }
        ]
    },
    {
        id: 'geography',
        name: 'Geography',
        emoji: '🌍',
        color: '#a855f7',
        gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
        progress: 35,
        mastery: 38,
        chapters: [
            {
                id: 'ge-1', title: 'Physical Geography', completed: false,
                topics: [
                    { id: 'ge-1-1', title: 'Climate Zones', completed: false },
                    { id: 'ge-1-2', title: 'Plate Tectonics', completed: false, weak: true },
                ]
            },
            {
                id: 'ge-2', title: 'Human Geography', completed: false,
                topics: [
                    { id: 'ge-2-1', title: 'Population Distribution', completed: false },
                    { id: 'ge-2-2', title: 'Urbanization', completed: false },
                ]
            }
        ]
    },
    {
        id: 'english',
        name: 'English',
        emoji: '📝',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        progress: 75,
        mastery: 78,
        chapters: [
            {
                id: 'en-1', title: 'Grammar', completed: true,
                topics: [
                    { id: 'en-1-1', title: 'Tenses', completed: true },
                    { id: 'en-1-2', title: 'Sentence Structure', completed: true },
                ]
            },
            {
                id: 'en-2', title: 'Literature', completed: false,
                topics: [
                    { id: 'en-2-1', title: 'Shakespeare', completed: false },
                    { id: 'en-2-2', title: 'Modern Fiction', completed: false },
                ]
            }
        ]
    },
    {
        id: 'sports',
        name: 'Sports & PE',
        emoji: '🏃',
        color: '#f97316',
        gradient: 'linear-gradient(135deg, #f97316, #f59e0b)',
        progress: 90,
        mastery: 92,
        chapters: [
            {
                id: 'sp-1', title: 'Physical Fitness', completed: true,
                topics: [
                    { id: 'sp-1-1', title: 'Aerobic Exercises', completed: true },
                    { id: 'sp-1-2', title: 'Nutrition & Health', completed: true },
                ]
            }
        ]
    },
];

// ─── Quiz Questions (per subject) ─────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'q1',
        question: "According to Newton's Second Law, what is the relationship between force, mass, and acceleration?",
        options: ['F = m/a', 'F = ma', 'F = m+a', 'F = m²a'],
        correct: 1,
        explanation: "Newton's Second Law states F = ma, meaning force equals mass times acceleration. A larger force produces greater acceleration, while a larger mass requires more force for the same acceleration.",
        subject: 'Physics',
        difficulty: 'easy'
    },
    {
        id: 'q2',
        question: "What is the integral of sin(x) with respect to x?",
        options: ['cos(x) + C', '-cos(x) + C', 'tan(x) + C', '-sin(x) + C'],
        correct: 1,
        explanation: "The integral of sin(x)dx = -cos(x) + C. This is because the derivative of -cos(x) is sin(x), which you can verify by differentiating.",
        subject: 'Mathematics',
        difficulty: 'medium'
    },
    {
        id: 'q3',
        question: "What is the atomic number of Carbon?",
        options: ['4', '6', '8', '12'],
        correct: 1,
        explanation: "Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus. Its atomic mass is approximately 12 (6 protons + 6 neutrons in its most common isotope).",
        subject: 'Chemistry',
        difficulty: 'easy'
    },
    {
        id: 'q4',
        question: "Which battle marked the beginning of the decline of the Mughal Empire?",
        options: ['Battle of Plassey', 'Battle of Panipat', 'Battle of Buxar', 'Battle of Haldighati'],
        correct: 0,
        explanation: "The Battle of Plassey (1757) is considered the turning point as it led to British dominance in India, which ultimately contributed to the decline of Mughal power.",
        subject: 'History',
        difficulty: 'hard'
    },
    {
        id: 'q5',
        question: "What is the powerhouse of the cell?",
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'],
        correct: 2,
        explanation: "The mitochondria is called the powerhouse of the cell because it produces ATP through cellular respiration, which is the primary energy currency of the cell.",
        subject: 'Chemistry',
        difficulty: 'easy'
    },
    {
        id: 'q6',
        question: "In which layer of the atmosphere does weather occur?",
        options: ['Stratosphere', 'Mesosphere', 'Troposphere', 'Thermosphere'],
        correct: 2,
        explanation: "Weather phenomena occur in the Troposphere, the lowest layer of Earth's atmosphere (0–12 km). Most of Earth's water vapor and atmospheric mass is found here.",
        subject: 'Geography',
        difficulty: 'medium'
    },
    {
        id: 'q7',
        question: "What is the value of π (pi) to two decimal places?",
        options: ['3.12', '3.14', '3.16', '3.18'],
        correct: 1,
        explanation: "π (pi) ≈ 3.14159... To two decimal places it is 3.14. It represents the ratio of a circle's circumference to its diameter.",
        subject: 'Mathematics',
        difficulty: 'easy'
    },
    {
        id: 'q8',
        question: "Which force keeps planets in orbit around the Sun?",
        options: ['Magnetic Force', 'Nuclear Force', 'Gravitational Force', 'Electromagnetic Force'],
        correct: 2,
        explanation: "Gravitational force, described by Newton's Law of Universal Gravitation, keeps planets in orbit by providing the centripetal acceleration needed for circular motion.",
        subject: 'Physics',
        difficulty: 'easy'
    },
    {
        id: 'q9',
        question: "What is a figure of speech where a comparison is made using 'like' or 'as'?",
        options: ['Metaphor', 'Simile', 'Hyperbole', 'Alliteration'],
        correct: 1,
        explanation: "A simile makes a comparison using 'like' or 'as', e.g., 'brave as a lion'. A metaphor makes the same comparison directly without those words.",
        subject: 'English',
        difficulty: 'easy'
    },
    {
        id: 'q10',
        question: "Which continent has the highest number of countries?",
        options: ['Asia', 'Europe', 'Africa', 'South America'],
        correct: 2,
        explanation: "Africa has the most countries of any continent with 54 recognized sovereign states, followed by Asia with 48 countries.",
        subject: 'Geography',
        difficulty: 'medium'
    },
];

const PROGRESS_DATA: ProgressData = {
    studyTime: 47,
    streak: 12,
    questionsAnswered: 248,
    accuracy: 78,
    subjectMastery: {
        physics: 72,
        mathematics: 85,
        chemistry: 58,
        history: 45,
        geography: 38,
        english: 78,
        sports: 92,
        other: 50,
    },
    weakTopics: [
        { topic: 'Circular Motion', subject: 'Physics' },
        { topic: 'Complex Numbers', subject: 'Mathematics' },
        { topic: 'Chemical Bonding', subject: 'Chemistry' },
        { topic: 'Plate Tectonics', subject: 'Geography' },
        { topic: 'World War I Causes', subject: 'History' },
    ],
    studyDays: [true, true, false, true, true, true, true, false, true, true, true, true, false, true, false, true, true, true, true, false, true],
};

// ─── Safe localStorage helpers ────────────────────────────────────────────────

function lsGet(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string) {
    try { localStorage.setItem(key, val); } catch { /* noop */ }
}
function lsRemove(key: string) {
    try { localStorage.removeItem(key); } catch { /* noop */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
    // Hydrate from localStorage on first render (client only)
    const [authState, setAuthState] = useState<AuthState>('unauthenticated');
    const [user, setUser] = useState<User | null>(null);
    const [activeSubject, setActiveSubjectState] = useState<Subject | null>(null);
    const [hydrated, setHydrated] = useState(false);

    const [currentView, setCurrentView] = useState<DashboardView>('home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Learning drill-down state
    const [learningSubject, setLearningSubject] = useState<Subject | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const [quizResults, setQuizResults] = useState<{ correct: number; total: number } | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'info' | 'success' | 'warning' }[]>([]);

    // ── Hydrate from localStorage once (avoids SSR mismatch) ──────────────────
    useEffect(() => {
        const savedUser = lsGet(LS_AUTH_USER);
        const savedSubjectId = lsGet(LS_ACTIVE_SUBJECT);

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser) as User;
                parsedUser.joinedAt = new Date(parsedUser.joinedAt);
                setUser(parsedUser);

                if (savedSubjectId) {
                    const found = SUBJECTS_DATA.find(s => s.id === savedSubjectId);
                    if (found) {
                        setActiveSubjectState(found);
                        setAuthState('authenticated');
                    } else if (savedSubjectId.startsWith('other:')) {
                        // custom subject
                        const customName = savedSubjectId.replace('other:', '');
                        const otherSubject: Subject = buildOtherSubject(customName);
                        setActiveSubjectState(otherSubject);
                        setAuthState('authenticated');
                    } else {
                        setAuthState('select-subject');
                    }
                } else {
                    setAuthState('select-subject');
                }
            } catch {
                lsRemove(LS_AUTH_USER);
                lsRemove(LS_ACTIVE_SUBJECT);
            }
        }

        setChatMessages([{
            id: '0',
            role: 'ai',
            content: "I'm your personal AI tutor! Ask me anything about your subject, and I'll give you personalized explanations, practice questions, and study tips. 🎓",
            timestamp: new Date(),
        }]);
        setHydrated(true);
    }, []);

    // ── Auth Actions ───────────────────────────────────────────────────────────

    const login = useCallback(async (email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 1200));
        const u: User = {
            id: '1',
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            joinedAt: new Date(),
        };
        setUser(u);
        lsSet(LS_AUTH_USER, JSON.stringify(u));

        // Check if there's already a saved subject
        const savedSubjectId = lsGet(LS_ACTIVE_SUBJECT);
        if (savedSubjectId) {
            const found = SUBJECTS_DATA.find(s => s.id === savedSubjectId);
            if (found) {
                setActiveSubjectState(found);
                setAuthState('authenticated');
                return;
            }
        }
        setAuthState('select-subject');
    }, []);

    const signup = useCallback(async (name: string, email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 1200));
        const u: User = { id: '1', name, email, joinedAt: new Date() };
        setUser(u);
        lsSet(LS_AUTH_USER, JSON.stringify(u));
        // Always go to subject selection after signup
        lsRemove(LS_ACTIVE_SUBJECT);
        setActiveSubjectState(null);
        setAuthState('select-subject');
    }, []);

    const googleLogin = useCallback(async () => {
        await new Promise(r => setTimeout(r, 800));
        const u: User = { id: '1', name: 'Aman Yadav', email: 'aman@gmail.com', joinedAt: new Date() };
        setUser(u);
        lsSet(LS_AUTH_USER, JSON.stringify(u));
        const savedSubjectId = lsGet(LS_ACTIVE_SUBJECT);
        if (savedSubjectId) {
            const found = SUBJECTS_DATA.find(s => s.id === savedSubjectId);
            if (found) {
                setActiveSubjectState(found);
                setAuthState('authenticated');
                return;
            }
        }
        setAuthState('select-subject');
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setActiveSubjectState(null);
        setAuthState('unauthenticated');
        setCurrentView('home');
        setLearningSubject(null);
        setSelectedChapter(null);
        setSelectedTopic(null);
        lsRemove(LS_AUTH_USER);
        lsRemove(LS_ACTIVE_SUBJECT);
        setChatMessages([{
            id: '0', role: 'ai',
            content: "I'm your personal AI tutor! Ask me anything about your subject, and I'll give you personalized explanations, practice questions, and study tips. 🎓",
            timestamp: new Date(),
        }]);
    }, []);

    // ── Subject Selection ──────────────────────────────────────────────────────

    function buildOtherSubject(customName: string): Subject {
        return {
            id: 'other',
            name: customName,
            emoji: '🌟',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            progress: 0,
            mastery: 0,
            chapters: [
                {
                    id: 'ot-1', title: `Introduction to ${customName}`, completed: false,
                    topics: [
                        { id: 'ot-1-1', title: `${customName} Fundamentals`, completed: false },
                        { id: 'ot-1-2', title: `${customName} Core Concepts`, completed: false },
                    ]
                }
            ]
        };
    }

    const selectSubject = useCallback((subjectId: string, customName?: string) => {
        let subject: Subject;
        if (subjectId === 'other' && customName) {
            subject = buildOtherSubject(customName);
            lsSet(LS_ACTIVE_SUBJECT, `other:${customName}`);
        } else {
            const found = SUBJECTS_DATA.find(s => s.id === subjectId);
            if (!found) return;
            subject = found;
            lsSet(LS_ACTIVE_SUBJECT, subjectId);
        }
        setActiveSubjectState(subject);
        setLearningSubject(null);
        setSelectedChapter(null);
        setSelectedTopic(null);
        setCurrentView('home');
        setAuthState('authenticated');
        // Update AI context greeting
        setChatMessages([{
            id: '0',
            role: 'ai',
            content: `🎓 **${subject.name} AI Tutor activated!**\n\nI'm now fully focused on **${subject.name}**. I can:\n\n• Explain any ${subject.name} concept clearly\n• Generate practice questions\n• Identify your weak areas\n• Create a personalized study plan\n\nWhat would you like to learn today?`,
            timestamp: new Date(),
        }]);
    }, []);

    const changeSubject = useCallback(() => {
        setAuthState('select-subject');
    }, []);

    // ── Chat ──────────────────────────────────────────────────────────────────

    const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        setChatMessages(prev => [...prev, { ...msg, id: Date.now().toString(), timestamp: new Date() }]);
    }, []);

    const clearChat = useCallback(() => {
        const subjectName = activeSubject?.name ?? 'your subject';
        setChatMessages([{
            id: '0', role: 'ai',
            content: `🎓 Chat cleared! I'm still focused on **${subjectName}**. What would you like to explore?`,
            timestamp: new Date(),
        }]);
    }, [activeSubject]);

    const sendAiMessage = useCallback(async (message: string) => {
        addChatMessage({ role: 'user', content: message });
        setAiLoading(true);
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

        const lower = message.toLowerCase();
        const subjectName = activeSubject?.name ?? 'your subject';
        const subjectId = activeSubject?.id ?? '';

        let response: string;

        if (lower.includes('practice') || lower.includes('question') || lower.includes('quiz')) {
            response = `✍️ **${subjectName} Practice Questions**\n\nHere are 3 practice questions for you:\n\n**Q1 (Easy):** What is the fundamental principle behind ${subjectName}?\n**Q2 (Medium):** Explain with an example how ${subjectName} concepts apply in real life.\n**Q3 (Hard):** Solve a multi-step problem combining key ${subjectName} theorems.\n\nWould you like me to generate more questions at a specific difficulty level?`;
        } else if (lower.includes('explain') || lower.includes('what is') || lower.includes('how') || lower.includes('why')) {
            response = `🎯 **Explanation — ${subjectName}**\n\nGreat question! Here's a clear breakdown:\n\n**Core Concept:**\nIn ${subjectName}, this concept is fundamental to understanding advanced topics.\n\n✅ Simple analogy you can relate to\n✅ Step-by-step derivation\n✅ Common misconceptions cleared\n✅ Practice problems to test understanding\n\nWould you like me to go deeper into any part of this explanation?`;
        } else if (lower.includes('plan') || lower.includes('schedule') || lower.includes('timetable')) {
            response = `📅 **Personalized ${subjectName} Study Plan**\n\nBased on your progress and weak areas, here's a recommended schedule:\n\n**Today:**\n• 4:00 PM — Review weak topics (45 min)\n• 5:00 PM — Practice questions (30 min)\n\n**This Week:**\n• Focus on your lowest-mastery chapters first\n• End each session with a 5-question quiz\n• Review mistakes using AI explanations\n\nShall I generate a full 2-week plan?`;
        } else if (subjectId === 'physics' || lower.includes('physics') || lower.includes('force') || lower.includes('motion')) {
            response = `⚡ **Physics Explained!**\n\nPhysics is the study of matter, energy, and the fundamental forces of nature.\n\n**Key areas I can help with:**\n- Newton's Laws of Motion\n- Thermodynamics\n- Waves and Optics\n- Electromagnetism\n\nWhich topic would you like me to deep-dive into?`;
        } else if (subjectId === 'mathematics' || lower.includes('math') || lower.includes('calculus')) {
            response = `📐 **Mathematics Made Easy!**\n\nMath is all about patterns and logical reasoning.\n\n1. **Understand the concept** — not just the formula\n2. **Practice step-by-step** — break problems down\n3. **Real-world applications** — see why it matters\n\nWould you like me to solve a specific problem or explain a concept?`;
        } else {
            response = `🤖 **AI Response — ${subjectName} context**\n\nGreat question! Based on your active subject **${subjectName}**, here's what I can tell you:\n\n• This concept is central to understanding ${subjectName}\n• I've identified related areas in your current study path\n• I'll tailor my explanation to your level\n\nWould you like a step-by-step breakdown or a quick summary first?`;
        }

        addChatMessage({ role: 'ai', content: response });
        setAiLoading(false);
    }, [addChatMessage, activeSubject]);

    // ── Notifications ─────────────────────────────────────────────────────────

    const addNotification = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
    }, []);

    // ── Derived quiz questions filtered to active subject ─────────────────────
    const activeQuizQuestions = activeSubject
        ? QUIZ_QUESTIONS.filter(q => q.subject.toLowerCase() === activeSubject.id.toLowerCase() ||
            q.subject.toLowerCase() === activeSubject.name.toLowerCase())
        : QUIZ_QUESTIONS;
    // Fall back to all questions if no match
    const quizForSubject = activeQuizQuestions.length > 0 ? activeQuizQuestions : QUIZ_QUESTIONS;

    // ── Progress filtered to active subject ───────────────────────────────────
    const activeProgress: ProgressData = activeSubject
        ? {
            ...PROGRESS_DATA,
            subjectMastery: { [activeSubject.id]: PROGRESS_DATA.subjectMastery[activeSubject.id] ?? 60 },
            weakTopics: PROGRESS_DATA.weakTopics.filter(
                w => w.subject.toLowerCase() === activeSubject.name.toLowerCase()
            ),
        }
        : PROGRESS_DATA;

    if (!hydrated) return null; // Prevent SSR mismatch

    return (
        <AppContext.Provider value={{
            authState,
            user,
            login,
            signup,
            googleLogin,
            logout,
            activeSubject,
            selectSubject,
            changeSubject,
            currentView,
            setCurrentView,
            sidebarCollapsed,
            setSidebarCollapsed,
            allSubjects: SUBJECTS_DATA,
            learningSubject,
            setLearningSubject,
            selectedChapter,
            setSelectedChapter,
            selectedTopic,
            setSelectedTopic,
            currentQuiz: quizForSubject,
            quizResults,
            setQuizResults,
            chatMessages,
            addChatMessage,
            clearChat,
            aiLoading,
            setAiLoading,
            sendAiMessage,
            progress: activeProgress,
            notifications,
            addNotification,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
