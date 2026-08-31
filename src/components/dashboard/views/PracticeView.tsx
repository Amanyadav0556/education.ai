'use client';
import { useState } from 'react';
import { useApp, QuizQuestion, Difficulty } from '@/context/AppContext';

const DIFF_LABELS: Record<Difficulty, string> = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' };

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
            onFinish(correctCount + (selected === q.correct ? 0 : 0));
            return;
        }
        setCurrent(c => c + 1);
        setSelected(null);
        setShowAnswer(false);
    };

    const progress = ((current) / questions.length) * 100;

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Question {current + 1} of {questions.length}</span>
                    <span style={{ marginLeft: 12 }} className={`badge diff-${q.difficulty}`}>{DIFF_LABELS[q.difficulty]}</span>
                    <span style={{ marginLeft: 8 }} className="badge badge-primary">{q.subject}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-300)' }}>
                    🎯 {correctCount}/{current} correct
                </div>
            </div>

            <div className="progress-container" style={{ height: 6, marginBottom: 28 }}>
                <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>

            {/* Question */}
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
                            <div
                                key={idx}
                                className={cls}
                                onClick={() => handleSelect(idx)}
                                style={{ cursor: showAnswer ? 'default' : 'pointer' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        border: '1px solid currentColor',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        opacity: 0.7,
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

            {/* Explanation */}
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
                        <span style={{ marginLeft: 8 }} className="badge badge-primary">🤖 AI Explanation</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {q.explanation}
                    </p>
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

function QuizResults({ correct, total, onRetry }: { correct: number; total: number; onRetry: () => void }) {
    const pct = Math.round((correct / total) * 100);
    const grade = pct >= 90 ? '🏆 Excellent!' : pct >= 70 ? '🌟 Great Job!' : pct >= 50 ? '👍 Good Effort!' : '💪 Keep Practicing!';

    return (
        <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', padding: '40px 0' }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>
                {pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '💪'}
            </div>
            <h1 className="heading-xl" style={{ marginBottom: 8 }}>{grade}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Quiz completed! Here's your performance summary.</p>

            <div style={{
                padding: '28px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 28,
            }}>
                <div style={{
                    fontSize: 72,
                    fontFamily: 'Outfit',
                    fontWeight: 800,
                    background: pct >= 70 ? 'var(--grad-success)' : pct >= 50 ? 'var(--grad-warning)' : 'var(--grad-danger)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                }}>{pct}%</div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 }}>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#6ee7b7' }}>{correct}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Correct</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#fca5a5' }}>{total - correct}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Incorrect</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-300)' }}>{total}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total</div>
                    </div>
                </div>
            </div>

            <div style={{
                padding: '16px 20px',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 24,
                textAlign: 'left',
            }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>🤖 AI Recommendation</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {pct < 60
                        ? "I noticed you struggled with some concepts. I recommend reviewing the topics you got wrong and practicing with easier questions first."
                        : pct < 80
                            ? "Great performance! You're on the right track. Focus on the questions you got wrong — they'll help you reach 90%+"
                            : "Outstanding! You've mastered this material. Try harder difficulty questions to challenge yourself further."}
                </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={onRetry}>🔄 Retry Quiz</button>
                <button className="btn btn-primary">📊 View Analysis</button>
            </div>
        </div>
    );
}

export default function PracticeView() {
    const { currentQuiz, subjects } = useApp();
    const [mode, setMode] = useState<'select' | 'quiz' | 'results'>('select');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
    const [correctCount, setCorrectCount] = useState(0);
    const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);

    const filteredQuestions = currentQuiz.filter(q => {
        const diffMatch = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
        const subMatch = selectedSubjectId === 'all' || q.subject.toLowerCase() === selectedSubjectId.toLowerCase();
        return diffMatch && subMatch;
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
                <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => setMode('select')}>
                    ← Back to Setup
                </button>
                <QuizRunner questions={activeQuestions} onFinish={handleFinish} />
            </div>
        );
    }

    if (mode === 'results') {
        return <QuizResults correct={correctCount} total={activeQuestions.length} onRetry={() => { setMode('select'); setCorrectCount(0); }} />;
    }

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 className="heading-xl" style={{ marginBottom: 8 }}>Practice & Quiz</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Test your knowledge with AI-powered adaptive questions and get instant explanations for mistakes.
                </p>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
                <div>
                    {/* Filter Panel */}
                    <div style={{
                        padding: '24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 20,
                    }}>
                        <h2 className="heading-md" style={{ marginBottom: 20 }}>🎯 Setup Your Quiz</h2>

                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Subject</label>
                            <select
                                className="form-input"
                                value={selectedSubjectId}
                                onChange={e => setSelectedSubjectId(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(s => <option key={s.id} value={s.name.toLowerCase()}>{s.emoji} {s.name}</option>)}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Difficulty Level</label>
                            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setSelectedDifficulty(d)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${selectedDifficulty === d ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                                            background: selectedDifficulty === d ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                                            color: selectedDifficulty === d ? 'var(--primary-300)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {d === 'all' ? '🌀 All' : d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            padding: '14px 16px',
                            background: 'rgba(99,102,241,0.08)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 20,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Questions available:</span>
                            <span style={{ fontSize: 18, fontWeight: 800 }} className="text-gradient">{filteredQuestions.length}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg w-full"
                            onClick={startQuiz}
                            disabled={filteredQuestions.length === 0}
                        >
                            🚀 Start Quiz ({filteredQuestions.length} questions)
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <h3 className="heading-md" style={{ marginBottom: 16 }}>📊 Your Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>✅ Questions Answered</span>
                                <span style={{ fontWeight: 700 }}>248</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>🎯 Accuracy Rate</span>
                                <span style={{ fontWeight: 700, color: '#6ee7b7' }}>78%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>🔥 Best Streak</span>
                                <span style={{ fontWeight: 700, color: '#fcd34d' }}>15 days</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>⭐ Avg Score</span>
                                <span style={{ fontWeight: 700, color: 'var(--primary-300)' }}>74%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Preview */}
                <div>
                    <h2 className="heading-md" style={{ marginBottom: 16 }}>📋 Question Preview</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredQuestions.map((q, i) => (
                            <div key={q.id} style={{
                                padding: '16px 18px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'border-color 0.2s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                            >
                                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                                    <span className={`badge diff-${q.difficulty}`}>{DIFF_LABELS[q.difficulty]}</span>
                                    <span className="badge badge-primary">{q.subject}</span>
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {i + 1}. {q.question}
                                </p>
                            </div>
                        ))}
                        {filteredQuestions.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No questions match your filters. Try changing the difficulty or subject.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
