'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const TIMETABLE = [
    { day: 'Mon', sessions: [{ time: '4:00 PM', subject: 'Physics', topic: 'Circular Motion', duration: 60 }, { time: '6:00 PM', subject: 'Mathematics', topic: 'Complex Numbers', duration: 45 }] },
    { day: 'Tue', sessions: [{ time: '5:00 PM', subject: 'Chemistry', topic: 'Chemical Bonding', duration: 90 }] },
    { day: 'Wed', sessions: [{ time: '4:00 PM', subject: 'Physics', topic: 'Electromagnetism', duration: 60 }, { time: '6:30 PM', subject: 'History', topic: 'World War I', duration: 45 }] },
    { day: 'Thu', sessions: [{ time: '4:00 PM', subject: 'Mathematics', topic: 'Integration Practice', duration: 60 }, { time: '6:00 PM', subject: 'English', topic: 'Shakespeare', duration: 30 }] },
    { day: 'Fri', sessions: [{ time: '4:00 PM', subject: 'Chemistry', topic: 'Organic Chemistry', duration: 90 }] },
    { day: 'Sat', sessions: [{ time: '10:00 AM', subject: 'Revision', topic: 'Full Physics Mock Test', duration: 120 }, { time: '2:00 PM', subject: 'Mathematics', topic: 'Math Mock Test', duration: 90 }] },
    { day: 'Sun', sessions: [] },
];

const SUBJECT_COLORS: Record<string, string> = {
    Physics: 'rgba(99,102,241,0.15)',
    Mathematics: 'rgba(6,182,212,0.15)',
    Chemistry: 'rgba(16,185,129,0.15)',
    History: 'rgba(245,158,11,0.15)',
    Geography: 'rgba(168,85,247,0.15)',
    English: 'rgba(236,72,153,0.15)',
    Revision: 'rgba(239,68,68,0.15)',
};

const SUBJECT_BORDER: Record<string, string> = {
    Physics: 'rgba(99,102,241,0.4)',
    Mathematics: 'rgba(6,182,212,0.4)',
    Chemistry: 'rgba(16,185,129,0.4)',
    History: 'rgba(245,158,11,0.4)',
    Geography: 'rgba(168,85,247,0.4)',
    English: 'rgba(236,72,153,0.4)',
    Revision: 'rgba(239,68,68,0.4)',
};

export default function ProgressView() {
    const { subjects, progress, user } = useApp();
    const [activeTab, setActiveTab] = useState<'overview' | 'mastery' | 'timetable'>('overview');

    const overallMastery = Math.round(
        Object.values(progress.subjectMastery).reduce((a, b) => a + b, 0) / Object.values(progress.subjectMastery).length
    );

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="heading-xl" style={{ marginBottom: 8 }}>Progress & Planner</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your learning journey and get AI-powered study plans.</p>
            </div>

            {/* Tabs */}
            <div className="tab-list" style={{ marginBottom: 28, maxWidth: 440 }}>
                {(['overview', 'mastery', 'timetable'] as const).map(t => (
                    <button key={t} className={`tab-item${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'overview' ? '📊 Overview' : t === 'mastery' ? '🎯 Mastery' : '📅 AI Timetable'}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div>
                    {/* Top Stats */}
                    <div className="grid-4 stagger-children" style={{ marginBottom: 28 }}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>⏱️</div>
                            <div className="stat-value">{progress.studyTime}h</div>
                            <div className="stat-label">Study Time (Month)</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🔥</div>
                            <div className="stat-value" style={{ background: 'var(--grad-warning)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.streak}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🎓</div>
                            <div className="stat-value" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{overallMastery}%</div>
                            <div className="stat-label">Overall Mastery</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>🎯</div>
                            <div className="stat-value" style={{ background: 'var(--grad-secondary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.accuracy}%</div>
                            <div className="stat-label">Accuracy Rate</div>
                        </div>
                    </div>

                    <div className="grid-2" style={{ gap: 24 }}>
                        {/* Activity Heatmap */}
                        <div style={{
                            padding: '24px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <h2 className="heading-md" style={{ marginBottom: 8 }}>📅 Study Activity</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Last {progress.studyDays.length} days</p>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {progress.studyDays.map((active, i) => (
                                    <div
                                        key={i}
                                        title={`Day ${i + 1}: ${active ? 'Studied' : 'No study'}`}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 3,
                                            background: active
                                                ? `rgba(99,102,241,${0.4 + Math.random() * 0.5})`
                                                : 'rgba(255,255,255,0.04)',
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.3)')}
                                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                                    />
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800 }} className="text-gradient">
                                        {progress.studyDays.filter(Boolean).length}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Active days</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fcd34d' }}>{progress.streak}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current streak</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: '#6ee7b7' }}>{progress.studyTime}h</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Weak Topics */}
                        <div style={{
                            padding: '24px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <h2 className="heading-md" style={{ marginBottom: 4 }}>⚠️ Weak Areas</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Topics needing your attention</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {progress.weakTopics.map((wt, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px',
                                        background: 'rgba(239,68,68,0.06)',
                                        border: '1px solid rgba(239,68,68,0.15)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}>
                                        <div style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'rgba(239,68,68,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            flexShrink: 0,
                                        }}>⚠️</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{wt.topic}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{wt.subject}</div>
                                        </div>
                                        <div style={{ fontSize: 11, color: '#fca5a5' }}>Priority {i + 1}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mastery Tab */}
            {activeTab === 'mastery' && (
                <div>
                    <div style={{
                        padding: '24px 28px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 24,
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 56, fontFamily: 'Outfit', fontWeight: 800 }} className="text-gradient">
                                {overallMastery}%
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Overall Mastery</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                You're doing great! Your strongest subject is <strong style={{ color: '#6ee7b7' }}>Sports & PE ({progress.subjectMastery['sports']}%)</strong> and your weakest is <strong style={{ color: '#fca5a5' }}>Geography ({progress.subjectMastery['geography']}%)</strong>.
                            </p>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginTop: 8 }}>
                                Focus on Geography and History to bring your overall mastery above 70%.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {subjects.map(sub => {
                            const mastery = progress.subjectMastery[sub.id] || 0;
                            return (
                                <div key={sub.id} style={{
                                    padding: '20px 24px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-lg)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                                        <div style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            background: sub.gradient,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 22,
                                        }}>{sub.emoji}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, fontSize: 15 }}>{sub.name}</span>
                                                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, background: sub.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                    {mastery}%
                                                </span>
                                            </div>
                                            <div style={{ marginTop: 8 }}>
                                                <div className="progress-container" style={{ height: 8 }}>
                                                    <div className="progress-bar" style={{ width: `${mastery}%`, background: sub.gradient }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span className={`badge ${mastery >= 80 ? 'badge-success' : mastery >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                                            {mastery >= 80 ? '🏆 Mastered' : mastery >= 60 ? '📈 Developing' : '📚 Needs Work'}
                                        </span>
                                        <span className="badge badge-primary">📖 {sub.chapters.length} Chapters</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Timetable Tab */}
            {activeTab === 'timetable' && (
                <div>
                    <div style={{
                        padding: '20px 24px',
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}>
                        <span style={{ fontSize: 32 }}>🤖</span>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>AI-Generated Study Timetable</div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                Based on your weak areas and learning pace, the AI has created this personalized weekly schedule.
                            </p>
                        </div>
                        <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>🔄 Regenerate</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
                        {TIMETABLE.map(day => (
                            <div key={day.day} style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    background: day.day === 'Sun' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.08)',
                                    borderBottom: '1px solid var(--border-subtle)',
                                    fontWeight: 700,
                                    fontSize: 13,
                                }}>{day.day}</div>

                                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                                    {day.sessions.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '20px 0' }}>
                                            🌟 Rest Day
                                        </div>
                                    ) : (
                                        day.sessions.map((sess, i) => (
                                            <div key={i} style={{
                                                padding: '8px 10px',
                                                background: SUBJECT_COLORS[sess.subject] || 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${SUBJECT_BORDER[sess.subject] || 'var(--border-subtle)'}`,
                                                borderRadius: 8,
                                            }}>
                                                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4 }}>{sess.subject}</div>
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
