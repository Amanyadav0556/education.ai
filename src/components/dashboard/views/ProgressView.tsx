'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function ProgressView() {
    const { activeSubject, progress, changeSubject } = useApp();
    const [activeTab, setActiveTab] = useState<'overview' | 'mastery' | 'timetable'>('overview');

    if (!activeSubject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No subject selected</h2>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const mastery = progress.subjectMastery[activeSubject.id] ?? activeSubject.mastery;
    const weakTopics = progress.weakTopics.filter(w =>
        w.subject.toLowerCase() === activeSubject.name.toLowerCase()
    );

    // Per-chapter mastery (approximate from topics)
    const chapterMastery = activeSubject.chapters.map(ch => ({
        title: ch.title,
        mastery: Math.round((ch.topics.filter(t => t.completed).length / ch.topics.length) * 100),
    }));

    // AI timetable sessions for active subject
    const TIMETABLE = [
        {
            day: 'Mon', sessions: [
                { time: '4:00 PM', topic: activeSubject.chapters[0]?.title ?? 'Chapter 1 Review', duration: 60 },
                { time: '6:00 PM', topic: 'Quick Quiz', duration: 30 },
            ]
        },
        {
            day: 'Tue', sessions: [
                { time: '5:00 PM', topic: activeSubject.chapters[1]?.title ?? 'Chapter 2 Practice', duration: 90 },
            ]
        },
        {
            day: 'Wed', sessions: [
                { time: '4:00 PM', topic: 'Weak Topics Revision', duration: 60 },
            ]
        },
        {
            day: 'Thu', sessions: [
                { time: '4:00 PM', topic: activeSubject.chapters[2]?.title ?? 'Chapter 3', duration: 60 },
                { time: '6:30 PM', topic: 'Flashcard Review', duration: 20 },
            ]
        },
        {
            day: 'Fri', sessions: [
                { time: '4:00 PM', topic: 'Mock Test Prep', duration: 90 },
            ]
        },
        {
            day: 'Sat', sessions: [
                { time: '10:00 AM', topic: `Full ${activeSubject.name} Mock Test`, duration: 120 },
            ]
        },
        { day: 'Sun', sessions: [] },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                {/* Subject header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 13,
                        background: activeSubject.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                        boxShadow: `0 4px 14px ${activeSubject.color}40`,
                    }}>{activeSubject.emoji}</div>
                    <div>
                        <h1 className="heading-xl">{activeSubject.name} Progress</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Track your mastery and plan your studies.</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-list" style={{ marginBottom: 28, maxWidth: 440 }}>
                {(['overview', 'mastery', 'timetable'] as const).map(t => (
                    <button key={t} className={`tab-item${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'overview' ? '📊 Overview' : t === 'mastery' ? '🎯 Chapters' : '📅 AI Timetable'}
                    </button>
                ))}
            </div>

            {/* ── Overview Tab ─────────────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
                <div>
                    {/* Top Stats */}
                    <div className="grid-4 stagger-children" style={{ marginBottom: 28 }}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: `${activeSubject.color}20` }}>🏆</div>
                            <div className="stat-value" style={{ background: activeSubject.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{mastery}%</div>
                            <div className="stat-label">{activeSubject.name} Mastery</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🔥</div>
                            <div className="stat-value" style={{ background: 'var(--grad-warning)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.streak}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>⏱️</div>
                            <div className="stat-value" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.studyTime}h</div>
                            <div className="stat-label">Study Time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>🎯</div>
                            <div className="stat-value" style={{ background: 'var(--grad-secondary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.accuracy}%</div>
                            <div className="stat-label">Accuracy Rate</div>
                        </div>
                    </div>

                    <div className="grid-2" style={{ gap: 24 }}>
                        {/* Activity Heatmap */}
                        <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
                            <h2 className="heading-md" style={{ marginBottom: 8 }}>📅 Study Activity</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Last {progress.studyDays.length} days</p>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {progress.studyDays.map((active, i) => (
                                    <div
                                        key={i}
                                        title={`Day ${i + 1}: ${active ? 'Studied' : 'No study'}`}
                                        style={{
                                            width: 16, height: 16, borderRadius: 3,
                                            background: active ? `${activeSubject.color}${Math.floor(60 + (i % 4) * 15).toString(16)}` : 'rgba(255,255,255,0.04)',
                                            cursor: 'pointer', transition: 'transform 0.1s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.3)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800 }} className="text-gradient">{progress.studyDays.filter(Boolean).length}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active days</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fcd34d' }}>{progress.streak}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Streak</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#6ee7b7' }}>{progress.studyTime}h</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Weak Topics */}
                        <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
                            <h2 className="heading-md" style={{ marginBottom: 4 }}>⚠️ {activeSubject.name} Weak Areas</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Topics needing attention</p>
                            {weakTopics.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                                    <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                                    <div style={{ fontSize: 14 }}>No weak topics found!</div>
                                    <div style={{ fontSize: 12, marginTop: 4 }}>Keep practicing to maintain your mastery.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {weakTopics.map((wt, i) => (
                                        <div key={i} style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>⚠️</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600 }}>{wt.topic}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{wt.subject}</div>
                                            </div>
                                            <div style={{ fontSize: 11, color: '#fca5a5' }}>Priority {i + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Chapters / Mastery Tab ────────────────────────────────────────────── */}
            {activeTab === 'mastery' && (
                <div>
                    {/* Summary banner */}
                    <div style={{
                        padding: '24px 28px',
                        background: `linear-gradient(135deg, ${activeSubject.color}14, rgba(99,102,241,0.06))`,
                        border: `1px solid ${activeSubject.color}22`,
                        borderRadius: 'var(--radius-xl)', marginBottom: 24,
                        display: 'flex', alignItems: 'center', gap: 24,
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 56, fontFamily: 'Outfit', fontWeight: 800, background: activeSubject.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {mastery}%
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Overall Mastery</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                Your <strong style={{ color: 'var(--text-primary)' }}>{activeSubject.name}</strong> mastery is at{' '}
                                <strong style={{ color: mastery >= 80 ? '#6ee7b7' : mastery >= 60 ? '#fcd34d' : '#fca5a5' }}>{mastery}%</strong>.{' '}
                                {mastery >= 80 ? 'Excellent work! Aim for 90%+ to achieve full mastery.' : mastery >= 60 ? "You're making good progress! Focus on weak chapters." : "Keep practicing! Review fundamentals to build a strong base."}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {activeSubject.chapters.map((ch, i) => {
                            const chMastery = chapterMastery[i].mastery;
                            return (
                                <div key={ch.id} style={{ padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: ch.completed ? 'var(--grad-success)' : activeSubject.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                                            {ch.completed ? '✅' : i + 1}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, fontSize: 15 }}>{ch.title}</span>
                                                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, background: activeSubject.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    {chMastery}%
                                                </span>
                                            </div>
                                            <div style={{ marginTop: 8 }}>
                                                <div className="progress-container" style={{ height: 8 }}>
                                                    <div className="progress-bar" style={{ width: `${chMastery}%`, background: activeSubject.gradient }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span className={`badge ${chMastery >= 80 ? 'badge-success' : chMastery >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                                            {chMastery >= 80 ? '🏆 Mastered' : chMastery >= 50 ? '📈 Developing' : '📚 Needs Work'}
                                        </span>
                                        <span className="badge badge-primary">📖 {ch.topics.length} Topics</span>
                                        <span className="badge badge-primary">✅ {ch.topics.filter(t => t.completed).length} Done</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── AI Timetable Tab ────────────────────────────────────────────────── */}
            {activeTab === 'timetable' && (
                <div>
                    <div style={{ padding: '20px 24px', background: `${activeSubject.color}10`, border: `1px solid ${activeSubject.color}25`, borderRadius: 'var(--radius-lg)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 32 }}>🤖</span>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>AI-Generated Study Timetable</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Personalized weekly schedule for <strong>{activeSubject.name}</strong> based on your weak areas and learning pace.
                            </p>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>🔄 Regenerate</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
                        {TIMETABLE.map(day => (
                            <div key={day.day} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div style={{
                                    padding: '10px', textAlign: 'center',
                                    background: day.day === 'Sun' ? 'rgba(239,68,68,0.1)' : `${activeSubject.color}12`,
                                    borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: 13,
                                }}>{day.day}</div>
                                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                                    {day.sessions.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '20px 0' }}>🌟 Rest Day</div>
                                    ) : (
                                        day.sessions.map((sess, i) => (
                                            <div key={i} style={{
                                                padding: '8px 10px',
                                                background: `${activeSubject.color}15`,
                                                border: `1px solid ${activeSubject.color}35`,
                                                borderRadius: 8,
                                            }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{activeSubject.name}</div>
                                                <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{sess.topic}</div>
                                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{sess.time} · {sess.duration}min</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
