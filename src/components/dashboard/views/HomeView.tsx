'use client';
import { useApp } from '@/context/AppContext';

export default function HomeView() {
    const { user, subjects, progress, setCurrentView } = useApp();

    const totalSubjects = subjects.length;
    const avgProgress = Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / totalSubjects);

    return (
        <div>
            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(6,182,212,0.08) 100%)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px 40px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 200,
                    height: 200,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
                    borderRadius: '50%',
                }} />
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div className="badge badge-primary" style={{ marginBottom: 12 }}>
                                🔥 {progress.streak}-day streak active
                            </div>
                            <h1 className="heading-xl" style={{ marginBottom: 8 }}>
                                Welcome back, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
                                You've answered <strong style={{ color: 'var(--text-primary)' }}>{progress.questionsAnswered} questions</strong> and studied for <strong style={{ color: 'var(--text-primary)' }}>{progress.studyTime} hours</strong> this month. Keep it up! 🎯
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-primary" onClick={() => setCurrentView('practice')}>
                                ✍️ Start Practice
                            </button>
                            <button className="btn btn-secondary" onClick={() => setCurrentView('ai')}>
                                🤖 Ask AI
                            </button>
                        </div>
                    </div>

                    {/* Today's goal progress */}
                    <div style={{ marginTop: 24, maxWidth: 420 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📅 Today's Study Goal</span>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>65% completed</span>
                        </div>
                        <div className="progress-container" style={{ height: 8 }}>
                            <div className="progress-bar" style={{ width: '65%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid-4 stagger-children" style={{ marginBottom: 24 }}>
                <div className="stat-card" style={{ '--grad': 'var(--grad-primary)' } as React.CSSProperties}>
                    <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>📚</div>
                    <div className="stat-value">{totalSubjects}</div>
                    <div className="stat-label">Active Subjects</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🔥</div>
                    <div className="stat-value" style={{ background: 'var(--grad-warning)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.streak}</div>
                    <div className="stat-label">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
                    <div className="stat-value" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.questionsAnswered}</div>
                    <div className="stat-label">Questions Answered</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>🎯</div>
                    <div className="stat-value" style={{ background: 'var(--grad-secondary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{progress.accuracy}%</div>
                    <div className="stat-label">Accuracy Rate</div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
                {/* Subject Progress */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h2 className="heading-md">📚 Your Subjects</h2>
                        <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('learning')}>View all →</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {subjects.slice(0, 5).map(sub => (
                            <div key={sub.id} style={{
                                padding: '16px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                                onClick={() => setCurrentView('learning')}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-glow)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
                            >
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: sub.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    flexShrink: 0,
                                }}>{sub.emoji}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600 }}>{sub.name}</span>
                                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{sub.progress}%</span>
                                    </div>
                                    <div className="progress-container" style={{ height: 4 }}>
                                        <div className="progress-bar" style={{ width: `${sub.progress}%`, background: sub.gradient }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* AI Recommendation */}
                    <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 24 }}>🤖</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>AI Recommendation</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Based on your progress</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
                            You have <strong style={{ color: '#fcd34d' }}>{progress.weakTopics.length} weak areas</strong> that need attention. I suggest focusing on <strong style={{ color: 'var(--primary-300)' }}>Circular Motion</strong> in Physics today — it's your biggest gap.
                        </p>
                        <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('ai')}>
                            🎯 Get Study Plan
                        </button>
                    </div>

                    {/* Weak Topics */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <h2 className="heading-md">⚠️ Weak Topics</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('progress')}>View all →</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {progress.weakTopics.slice(0, 4).map((wt, i) => (
                                <div key={i} style={{
                                    padding: '12px 14px',
                                    background: 'rgba(239,68,68,0.06)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{wt.topic}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{wt.subject}</div>
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('practice')}>
                                        Practice
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Streak Calendar */}
                    <div style={{
                        padding: '20px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <h2 className="heading-md">🔥 Streak</h2>
                            <span style={{ fontSize: 20, fontWeight: 800 }} className="text-gradient">{progress.streak} days</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {progress.studyDays.map((active, i) => (
                                <div key={i} className={`streak-tile ${active ? 'active' : 'inactive'}`} title={active ? 'Studied!' : 'No study'}>
                                    {active ? '🔥' : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
