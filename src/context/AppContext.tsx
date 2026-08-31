'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthState = 'unauthenticated' | 'onboarding' | 'authenticated';
export type DashboardView = 'home' | 'learning' | 'practice' | 'resources' | 'ai' | 'progress';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    class: string;
    subjects: string[];
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
    studyTime: number; // hours
    streak: number; // days
    questionsAnswered: number;
    accuracy: number;
    subjectMastery: { [subjectId: string]: number };
    weakTopics: { topic: string; subject: string }[];
    studyDays: boolean[];
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextType {
    // Auth
    authState: AuthState;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => void;
    completeOnboarding: (data: { class: string; subjects: string[] }) => void;

    // Navigation
    currentView: DashboardView;
    setCurrentView: (view: DashboardView) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (v: boolean) => void;

    // Learning
    subjects: Subject[];
    selectedSubject: Subject | null;
    setSelectedSubject: (s: Subject | null) => void;
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SUBJECTS_DATA: Subject[] = [
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
                    { id: 'ph-1-1', title: "Newton's Laws of Motion", completed: true },
                    { id: 'ph-1-2', title: 'Work, Energy and Power', completed: true },
                    { id: 'ph-1-3', title: 'Circular Motion', completed: false, weak: true },
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
                    { id: 'ph-3-1', title: "Coulomb's Law & Electric Field", completed: false },
                    { id: 'ph-3-2', title: 'Magnetic Force', completed: false, weak: true },
                    { id: 'ph-3-3', title: 'Electromagnetic Induction', completed: false },
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
    }
];

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
        explanation: "The mitochondria is called the powerhouse of the cell because it produces ATP (adenosine triphosphate) through cellular respiration, which is the primary energy currency of the cell.",
        subject: 'Chemistry',
        difficulty: 'easy'
    },
    {
        id: 'q6',
        question: "In which layer of the atmosphere does weather occur?",
        options: ['Stratosphere', 'Mesosphere', 'Troposphere', 'Thermosphere'],
        correct: 2,
        explanation: "Weather phenomena occur in the Troposphere, the lowest layer of Earth's atmosphere (0-12 km). This is where most of Earth's water vapor and atmospheric mass is found.",
        subject: 'Geography',
        difficulty: 'medium'
    },
];

const AI_RESPONSES: { [key: string]: string } = {
    default: "I'm your personal AI tutor! I can explain concepts, solve doubts, generate practice questions, and create personalized study plans. What would you like to learn today? 🎓",
    physics: "📡 **Physics Explained!**\n\nGreat question! Physics is the study of matter, energy, and the fundamental forces of nature. Let me break this down for you with clear examples and visual explanations.\n\n**Key Concepts I can help with:**\n- Newton's Laws of Motion\n- Thermodynamics\n- Waves and Optics\n- Electromagnetism\n- Quantum Physics\n\nWhich topic would you like me to deep-dive into?",
    math: "📐 **Mathematics Made Easy!**\n\nMath is all about patterns and logical reasoning. Here's how I approach it:\n\n1. **Understand the concept** - Not just the formula\n2. **Practice step-by-step** - Break complex problems down\n3. **Real-world applications** - See why it matters\n\nWould you like me to solve a specific problem or explain a concept?",
    explain: "🎯 **Concept Explanation Ready!**\n\nHere's a comprehensive breakdown:\n\n**Core Principle:**\nEvery scientific concept builds on fundamentals. I'll explain it from the ground up with:\n\n✅ Simple analogies you can relate to\n✅ Step-by-step derivations\n✅ Common misconceptions cleared\n✅ Practice problems to test understanding\n\nWhat specific concept or topic needs clarification?",
};

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

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>('unauthenticated');
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<DashboardView>('home');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [quizResults, setQuizResults] = useState<{ correct: number; total: number } | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '0',
            role: 'ai',
            content: AI_RESPONSES.default,
            timestamp: new Date(),
        }
    ]);
    const [aiLoading, setAiLoading] = useState(false);
    const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'info' | 'success' | 'warning' }[]>([]);

    const login = useCallback(async (email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 1200));
        setUser({
            id: '1',
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            class: '11th Grade',
            subjects: ['physics', 'mathematics', 'chemistry'],
            joinedAt: new Date(),
        });
        setAuthState('authenticated');
    }, []);

    const signup = useCallback(async (name: string, email: string, _password: string) => {
        await new Promise(r => setTimeout(r, 1200));
        setUser({
            id: '1',
            name,
            email,
            class: '',
            subjects: [],
            joinedAt: new Date(),
        });
        setAuthState('onboarding');
    }, []);

    const googleLogin = useCallback(async () => {
        await new Promise(r => setTimeout(r, 800));
        setUser({
            id: '1',
            name: 'Aman Yadav',
            email: 'aman@gmail.com',
            class: '11th Grade',
            subjects: ['physics', 'mathematics', 'chemistry', 'english'],
            joinedAt: new Date(),
        });
        setAuthState('authenticated');
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setAuthState('unauthenticated');
        setCurrentView('home');
        setChatMessages([{ id: '0', role: 'ai', content: AI_RESPONSES.default, timestamp: new Date() }]);
    }, []);

    const completeOnboarding = useCallback((data: { class: string; subjects: string[] }) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
        setAuthState('authenticated');
    }, []);

    const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        setChatMessages(prev => [...prev, { ...msg, id: Date.now().toString(), timestamp: new Date() }]);
    }, []);

    const clearChat = useCallback(() => {
        setChatMessages([{ id: '0', role: 'ai', content: AI_RESPONSES.default, timestamp: new Date() }]);
    }, []);

    const sendAiMessage = useCallback(async (message: string) => {
        addChatMessage({ role: 'user', content: message });
        setAiLoading(true);
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
        const lower = message.toLowerCase();
        let response = AI_RESPONSES.default;
        if (lower.includes('physics') || lower.includes('force') || lower.includes('motion')) response = AI_RESPONSES.physics;
        else if (lower.includes('math') || lower.includes('calculus') || lower.includes('integral')) response = AI_RESPONSES.math;
        else if (lower.includes('explain') || lower.includes('what is') || lower.includes('how')) response = AI_RESPONSES.explain;
        else response = `🤖 **AI Response:**\n\nGreat question about "${message}"!\n\nBased on your learning profile, here's what I know:\n\n• This concept connects to your current studies in Physics and Mathematics\n• I've identified some related weak areas I can help strengthen\n• I'll generate personalized examples relevant to your grade level\n\nLet me provide a detailed explanation with practice problems. Would you like a step-by-step breakdown or a quick summary first?`;
        addChatMessage({ role: 'ai', content: response });
        setAiLoading(false);
    }, [addChatMessage]);

    const addNotification = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
        const id = Date.now().toString();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
    }, []);

    const filteredSubjects = SUBJECTS_DATA.filter(s => user?.subjects?.includes(s.id) || authState !== 'authenticated' || user?.subjects?.length === 0);

    return (
        <AppContext.Provider value={{
            authState,
            user,
            login,
            signup,
            googleLogin,
            logout,
            completeOnboarding,
            currentView,
            setCurrentView,
            sidebarCollapsed,
            setSidebarCollapsed,
            subjects: authState === 'authenticated' && user?.subjects?.length ? filteredSubjects : SUBJECTS_DATA,
            selectedSubject,
            setSelectedSubject,
            selectedChapter,
            setSelectedChapter,
            selectedTopic,
            setSelectedTopic,
            currentQuiz: QUIZ_QUESTIONS,
            quizResults,
            setQuizResults,
            chatMessages,
            addChatMessage,
            clearChat,
            aiLoading,
            setAiLoading,
            sendAiMessage,
            progress: PROGRESS_DATA,
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
