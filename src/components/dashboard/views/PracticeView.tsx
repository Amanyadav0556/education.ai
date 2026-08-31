'use client';
import { useState } from 'react';
import { useApp, QuizQuestion, Difficulty } from '@/context/AppContext';

const DIFF_LABELS: Record<Difficulty, string> = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' };

// ── Quiz Runner ───────────────────────────────────────────────────────────────

function QuizRunner({ questions, onFinish }: { questions: QuizQuestion[]; onFinish: (correct: number) => void }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    const q = questions[current];

    const handleSelect = (idx: number) => {
        if (showAnswer) return;
        setSelected(idx);
        setShowAnswer(true);
        if (idx === q.correct) setCorrectCount(c => c + 1);
    };

    const handleNext = () => {
        if (current + 1 >= questions.length) {
            onFinish(correctCount);
            return;
        }
        setCurrent(c => c + 1);
        setSelected(null);
        setShowAnswer(false);
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Progress header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Question {current + 1} of {questions.length}</span>
                    <span className={`badge diff-${q.difficulty}`}>{DIFF_LABELS[q.difficulty]}</span>
                    <span className="badge badge-primary">{q.subject}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-300)' }}>🎯 {correctCount}/{current} correct</span>
            </div>

            <div className="progress-container" style={{ height: 6, marginBottom: 28 }}>
                <div className="progress-bar" style={{ width: `${(current / questions.length) * 100}%` }} />
            </div>

            {/* Question card */}
            <div style={{
                padding: '28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 20,
            }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>{q.question}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {q.options.map((opt, idx) => {
                        let cls = 'quiz-option';
                        if (showAnswer) {
                            if (idx === q.correct) cls += ' correct';
                            else if (idx === selected && idx !== q.correct) cls += ' wrong';
                        } else if (idx === selected) cls += ' selected';

                        return (
                            <div key={idx} className={cls} onClick={() => handleSelect(idx)} style={{ cursor: showAnswer ? 'default' : 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        border: '1px solid currentColor',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontWeight: 700, flexShrink: 0, opacity: 0.7,
                                    }}>
                                        {showAnswer && idx === q.correct ? '✓' : showAnswer && idx === selected && idx !== q.correct ? '✗' : String.fromCharCode(65 + idx)}
                                    </div>
                                    <span style={{ fontSize: 14 }}>{opt}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Explanation on answer reveal */}
            {showAnswer && (
                <div style={{
                    padding: '20px',
                    background: selected === q.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${selected === q.correct ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 20,
                    animation: 'fade-in 0.3s ease',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 20 }}>{selected === q.correct ? '✅' : '❌'}</span>
                        <span style={{ fontWeight: 700, color: selected === q.correct ? '#6ee7b7' : '#fca5a5' }}>
                            {selected === q.correct ? 'Correct!' : 'Incorrect'}
                        </span>
                        <span className="badge badge-primary" style={{ marginLeft: 8 }}>🤖 AI Explanation</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{q.explanation}</p>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {showAnswer && (
                    <button className="btn btn-primary btn-lg" onClick={handleNext}>
                        {current + 1 >= questions.length ? '🏆 See Results' : 'Next Question →'}
                    </button>
                )}
            </div>
        </div>
    );
}

// ── Results ────────────────────────────────────────────────────────────────────

function QuizResults({ correct, total, subjectName, onRetry }: { correct: number; total: number; subjectName: string; onRetry: () => void }) {
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '🌟 Great Job!' : pct >= 50 ? '👍 Good Effort!' : '💪 Keep Practicing!';

    return (
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: '40px 0' }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '💪'}</div>
            <h1 className="heading-xl" style={{ marginBottom: 8 }}>{grade}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
                <strong>{subjectName}</strong> quiz completed!
            </p>

            <div style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', marginBottom: 28 }}>
                <div style={{
                    fontSize: 72, fontFamily: 'Outfit', fontWeight: 800,
                    background: pct >= 70 ? 'var(--grad-success)' : pct >= 50 ? 'var(--grad-warning)' : 'var(--grad-danger)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8,
                }}>{pct}%</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 }}>
                    <div><div style={{ fontSize: 24, fontWeight: 700, color: '#6ee7b7' }}>{correct}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Correct</div></div>
                    <div><div style={{ fontSize: 24, fontWeight: 700, color: '#fca5a5' }}>{total - correct}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Incorrect</div></div>
                    <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-300)' }}>{total}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total</div></div>
                </div>
            </div>

            <div style={{ padding: '16px 20px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>🤖 AI Recommendation</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {pct < 60
                        ? `You had some trouble with ${subjectName} questions. Review the weak topics and try again with Easy difficulty first.`
                        : pct < 80
                            ? `Good work on ${subjectName}! Focus on the questions you got wrong to push past 80%.`
                            : `Outstanding ${subjectName} performance! Try Hard difficulty questions to reach mastery level.`}
                </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={onRetry}>🔄 Retry Quiz</button>
                <button className="btn btn-primary">📊 View Analysis</button>
            </div>
        </div>
    );
}

// ── Main Practice View ────────────────────────────────────────────────────────

export default function PracticeView() {
    const { currentQuiz, activeSubject, changeSubject } = useApp();
    const [mode, setMode] = useState<'select' | 'quiz' | 'results'>('select');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
    const [correctCount, setCorrectCount] = useState(0);
    const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);

    if (!activeSubject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>✍️</div>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No subject selected</h2>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const filteredQuestions = currentQuiz.filter(q => {
        const diffMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
        return diffMatch;
    });

    const startQuiz = () => {
        const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
        setActiveQuestions(shuffled);
        setMode('quiz');
    };

    const handleFinish = (correct: number) => {
        setCorrectCount(correct);
        setMode('results');
    };

    if (mode === 'quiz') {
        return (
            <div>
                <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => setMode('select')}>← Back to Setup</button>
                <QuizRunner questions={activeQuestions} onFinish={handleFinish} />
            </div>
        );
    }

    if (mode === 'results') {
        return (
            <QuizResults
                correct={correctCount}
                total={activeQuestions.length}
                subjectName={activeSubject.name}
                onRetry={() => { setMode('select'); setCorrectCount(0); }}
            />
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                {/* Subject context badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: activeSubject.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22,
                    }}>{activeSubject.emoji}</div>
                    <div>
                        <h1 className="heading-xl">{activeSubject.name} Practice</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            AI-powered adaptive questions with instant explanations
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
                {/* Left: Setup panel */}
                <div>
                    <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', marginBottom: 20 }}>
                        <h2 className="heading-md" style={{ marginBottom: 20 }}>🎯 Setup Your Quiz</h2>

                        {/* Subject display (locked to active) */}
                        <div style={{ marginBottom: 20 }}>
                            <div className="form-label" style={{ display: 'block', marginBottom: 8 }}>Subject</div>
                            <div style={{
                                padding: '10px 16px',
                                background: `${activeSubject.color}15`,
                                border: `1px solid ${activeSubject.color}40`,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <span style={{ fontSize: 20 }}>{activeSubject.emoji}</span>
                                <span style={{ fontWeight: 600 }}>{activeSubject.name}</span>
                                <button
                                    onClick={changeSubject}
                                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
                                >🔄 Change</button>
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <div className="form-label" style={{ display: 'block', marginBottom: 8 }}>Difficulty Level</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDifficulty(d)}
                                        style={{
                                            flex: 1, padding: '10px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${selectedDifficulty === d ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                                            background: selectedDifficulty === d ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                                            color: selectedDifficulty === d ? 'var(--primary-300)' : 'var(--text-secondary)',
                                            cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                                        }}
                                    >
                                        {d === 'all' ? '🌀 All' : d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Mid' : '🔴 Hard'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(99,102,241,0.08)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 20,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Questions available:</span>
                            <span style={{ fontSize: 18, fontWeight: 800 }} className="text-gradient">{filteredQuestions.length}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={startQuiz}
                            disabled={filteredQuestions.length === 0}
                        >
                            🚀 Start {activeSubject.name} Quiz
                        </button>

                        {filteredQuestions.length === 0 && (
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                                No questions for this filter combination. More questions coming soon!
                            </p>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
                        <h3 className="heading-md" style={{ marginBottom: 16 }}>📊 Your {activeSubject.name} Stats</h3>
                        {[
                            { label: '✅ Questions Answered', val: '248' },
                            { label: '🎯 Accuracy Rate', val: '78%', highlight: '#6ee7b7' },
                            { label: '🔥 Best Streak', val: '15 days', highlight: '#fcd34d' },
                            { label: '⭐ Avg Score', val: '74%', highlight: 'var(--primary-300)' },
                        ].map(s => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{s.label}</span>
                                <span style={{ fontWeight: 700, color: s.highlight ?? 'var(--text-primary)' }}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Question Preview */}
                <div>
                    <h2 className="heading-md" style={{ marginBottom: 16 }}>📋 Question Preview</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredQuestions.slice(0, 8).map((q, i) => (
                            <div key={q.id} style={{
                                padding: '14px 18px', background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                                transition: 'border-color 0.15s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                            >
                                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                                    <span className={`badge diff-${q.difficulty}`}>{DIFF_LABELS[q.difficulty]}</span>
                                    <span className="badge badge-primary">{q.subject}</span>
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {i + 1}. {q.question}
                                </p>
                            </div>
                        ))}
                        {filteredQuestions.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No questions match. Try selecting a different difficulty.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
