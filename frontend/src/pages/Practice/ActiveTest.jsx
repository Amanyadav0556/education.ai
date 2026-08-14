import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, AlertCircle, FileQuestion, HelpCircle, X } from 'lucide-react';

const MOCK_QUESTIONS = [
    {
        id: 1,
        text: "If 3x - y = 12 and y = 3, what is the value of x?",
        options: ["3", "4", "5", "15"],
        correct: 2, // '5'
        topic: "Heart of Algebra"
    },
    {
        id: 2,
        text: "The function f(x) = 2x² - 4x - 6 is graphed in the xy-plane. What are the x-intercepts of the graph?",
        options: ["-1 and 3", "1 and -3", "-2 and 6", "2 and -6"],
        correct: 0,
        topic: "Passport to Advanced Math"
    },
    {
        id: 3,
        text: "A triangle has sides of length 7, 24, and 25. What is the area of the triangle?",
        options: ["84", "168", "87.5", "600"],
        correct: 0,
        topic: "Geometry and Trigonometry"
    },
    {
        id: 4,
        text: "Which of the following is equivalent to (x² - 4) / (x - 2)?",
        options: ["x - 2", "x + 2", "x", "x² - 2"],
        correct: 1,
        topic: "Passport to Advanced Math"
    },
    {
        id: 5,
        text: "A reading passage discusses the implications of solar energy. Which choice provides the best evidence for the author's claim that solar panels are becoming cheaper?",
        options: [
            "Lines 12-15 ('In the past...')",
            "Lines 22-25 ('The cost per watt...')",
            "Lines 38-40 ('While installation...')",
            "Lines 55-58 ('Tax credits have...')"
        ],
        correct: 1,
        topic: "Command of Evidence"
    }
];

export default function ActiveTest() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { qIndex: selectedOptionIndex }
    const [markedForReview, setMarkedForReview] = useState({});
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOptionSelect = (optIndex) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentQIndex]: optIndex }));
    };

    const toggleMarkReview = () => {
        setMarkedForReview(prev => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const currentQ = MOCK_QUESTIONS[currentQIndex];

    if (isSubmitted) {
        let score = 0;
        MOCK_QUESTIONS.forEach((q, i) => {
            if (answers[i] === q.correct) score++;
        });

        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-12 px-6">
                    <div className="bg-bg-surface p-10 rounded-[32px] border border-border-base shadow-xl text-center">
                        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-black text-text-main mb-4">Test Submitted Successfully!</h1>
                        <p className="text-xl font-bold text-text-sub mb-8">You scored {score} out of {MOCK_QUESTIONS.length}</p>

                        <div className="flex gap-4 justify-center">
                            <button onClick={() => navigate('/practice')} className="bg-bg-surface-hover hover:bg-border-base text-text-main px-8 py-3 rounded-xl font-bold border border-border-strong transition-all">Back to Tests</button>
                            <button onClick={() => navigate('/learning-twin')} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all">View Analytics</button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <div className="min-h-screen bg-bg-base font-sans selection:bg-primary/20 flex flex-col items-center">

            {/* Top Navigation Bar */}
            <div className="w-full bg-bg-surface border-b border-border-strong px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/practice')} className="p-2 hover:bg-bg-surface-hover rounded-xl text-text-muted transition-colors">
                        <X size={20} />
                    </button>
                    <div>
                        <h2 className="font-bold text-text-main">Official SAT Practice Test {id}</h2>
                        <p className="text-xs font-bold text-text-muted">Section 1: Mathematics</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-100/50">
                        <Clock size={18} />
                        <span className="tabular-nums tracking-wider">{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold shadow-sm transition-all active:scale-95">
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-6 lg:p-10 flex-1">

                {/* Left Side: Question Panel */}
                <div className="flex-1 bg-bg-surface rounded-3xl border border-border-base shadow-sm flex flex-col">
                    <div className="p-6 md:p-8 flex-1">
                        <div className="flex justify-between items-start mb-8">
                            <span className="font-black text-2xl text-text-main">Question {currentQIndex + 1}</span>
                            <button onClick={toggleMarkReview} className={`flex items-center gap-2 p-2 rounded-xl font-bold text-sm transition-all border ${markedForReview[currentQIndex] ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-transparent text-text-muted border-transparent hover:bg-bg-surface-hover'}`}>
                                <Bookmark size={18} className={markedForReview[currentQIndex] ? 'fill-current' : ''} /> {markedForReview[currentQIndex] ? 'Marked' : 'Mark for Review'}
                            </button>
                        </div>

                        <div className="text-lg md:text-xl font-medium text-text-main leading-relaxed mb-10">
                            {currentQ.text}
                        </div>

                        <div className="space-y-4">
                            {currentQ.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${answers[currentQIndex] === idx ? 'border-[#4f46e5] bg-primary/5 shadow-sm' : 'border-border-strong bg-bg-surface-hover hover:border-text-muted/30'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${answers[currentQIndex] === idx ? 'bg-[#4f46e5] text-white' : 'bg-bg-base border border-border-strong text-text-sub group-hover:bg-border-base'}`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className={`font-semibold text-base ${answers[currentQIndex] === idx ? 'text-[#4f46e5]' : 'text-text-main'}`}>{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 md:p-6 border-t border-border-strong bg-bg-surface-hover rounded-b-3xl flex justify-between items-center">
                        <button
                            disabled={currentQIndex === 0}
                            onClick={() => setCurrentQIndex(prev => prev - 1)}
                            className="flex items-center gap-2 font-bold text-text-main bg-bg-surface border border-border-strong px-5 py-2.5 rounded-xl disabled:opacity-50 transition-all hover:bg-border-base"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>

                        <div className="font-bold text-sm text-text-muted">
                            {currentQIndex + 1} of {MOCK_QUESTIONS.length}
                        </div>

                        <button
                            disabled={currentQIndex === MOCK_QUESTIONS.length - 1}
                            onClick={() => setCurrentQIndex(prev => prev + 1)}
                            className="flex items-center gap-2 font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] px-5 py-2.5 rounded-xl disabled:opacity-50 transition-all shadow-sm"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Right Side: Navigation Grid */}
                <div className="w-full md:w-72 flex-shrink-0 space-y-6">
                    <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
                        <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><FileQuestion size={18} className="text-text-muted" /> Question Overview</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {MOCK_QUESTIONS.map((_, idx) => {
                                let stateStyle = 'bg-bg-surface-hover border-border-strong text-text-sub hover:border-text-muted/30';
                                if (answers[idx] !== undefined) stateStyle = 'bg-primary/10 border-primary/30 text-[#4f46e5]';
                                if (markedForReview[idx]) stateStyle = 'bg-amber-100 border-amber-300 text-amber-700';

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`aspect-square rounded-xl border-2 font-bold transition-all flex items-center justify-center ${stateStyle} ${currentQIndex === idx ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-surface' : ''}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-text-sub"><div className="w-4 h-4 rounded border-2 border-primary/30 bg-primary/10"></div> Answered</div>
                            <div className="flex items-center gap-3 text-xs font-bold text-text-sub"><div className="w-4 h-4 rounded border-2 border-border-strong bg-bg-surface-hover"></div> Unanswered</div>
                            <div className="flex items-center gap-3 text-xs font-bold text-text-sub"><div className="w-4 h-4 rounded border-2 border-amber-300 bg-amber-100"></div> Marked Review</div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                        <div className="flex items-start gap-3 text-blue-800">
                            <HelpCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-bold leading-relaxed">
                                You can use standard elimination strategies. Try skipping difficult questions and returning to them via the grid!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
