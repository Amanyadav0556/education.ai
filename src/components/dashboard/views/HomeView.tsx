'use client';
import { useApp } from '@/context/AppContext';

export default function HomeView() {
    const { user, activeSubject, progress, setCurrentView, changeSubject } = useApp();

    if (!activeSubject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No active subject selected</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Select a subject to get started.</p>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const mastery = progress.subjectMastery[activeSubject.id] ?? activeSubject.mastery;
    const weakTopics = progress.weakTopics.filter(w =>
        w.subject.toLowerCase() === activeSubject.name.toLowerCase()
    );

    // Find first incomplete chapter and topic
    const continueChapter = activeSubject.chapters.find(c => !c.completed);
    const continueTopic = continueChapter?.topics.find(t => !t.completed);

    // Count completed  
    const totalTopics = activeSubject.chapters.reduce((a, c) => a + c.topics.length, 0);
    const completedTopics = activeSubject.chapters.reduce((a, c) => a + c.topics.filter(t => t.completed).length, 0);

    return (
        <div>
            {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
            <div style={{
                background: `linear-gradient(135deg, ${activeSubject.color}18 0%, ${activeSubject.color}08 50%, transparent 100%)`,
                border: `1px solid ${activeSubject.color}30`,
                borderRadius: 'var(--radius-xl)',
                padding: '32px 36px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute', top: -60, right: -60,
                    width: 220, height: 220,
                    background: `radial-gradient(circle, ${activeSubject.color}25, transparent)`,
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: activeSubject.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26,
                                    boxShadow: `0 4px 16px ${activeSubject.color}50`,
                                }}>{activeSubject.emoji}</div>
                                <div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                                        Current Subject
                                    </div>
                                    <h1 className="heading-xl">{activeSubject.name}</h1>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: 460, lineHeight: 1.6 }}>
                                Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</strong>!
                                You've completed <strong style={{ color: 'var(--text-primary)' }}>{completedTopics}/{totalTopics}</strong> topics.{' '}
                                {completedTopics < totalTopics ? "Let's keep going! 🎯" : "Amazing! You've covered everything! 🏆"}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button className="btn btn-primary" onClick={() => setCurrentView('practice')}>
                                ✍️ Start Practice
                            </button>
                            <button className="btn btn-secondary" onClick={() => setCurrentView('ai')}>
                                🤖 Ask AI
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={changeSubject}
                                style={{ fontSize: 12 }}
                            >
                                🔄 Change Subject
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ maxWidth: 500 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{activeSubject.name} Progress</span>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{activeSubject.progress}%</span>
                        </div>
                        <div className="progress-container" style={{ height: 8 }}>
                            <div className="progress-bar" style={{ width: `${activeSubject.progress}%`, background: activeSubject.gradient }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ────────────────────────────────────────────────────────── */}
            <div className="grid-4 stagger-children" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: `${activeSubject.color}20` }}>🏆</div>
                    <div className="stat-value" style={{ background: activeSubject.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {mastery}%
                    </div>
                    <div className="stat-label">{activeSubject.name} Mastery</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🔥</div>
                    <div className="stat-value" style={{ background: 'var(--grad-warning)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {progress.streak}
                    </div>
                    <div className="stat-label">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>📖</div>
                    <div className="stat-value" style={{ background: 'var(--grad-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {completedTopics}/{totalTopics}
                    </div>
                    <div className="stat-label">Topics Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>🎯</div>
                    <div className="stat-value">
                        {progress.accuracy}%
                    </div>
                    <div className="stat-label">Accuracy Rate</div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Continue Learning */}
                    {continueTopic && continueChapter && (
                        <div style={{
                            padding: '20px 24px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 10 }}>
                                📖 Continue Learning
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{continueChapter.title}</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                                Next: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{continueTopic.title}</span>
                            </p>
                            <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('learning')}>
                                Continue →
                            </button>
                        </div>
                    )}

                    {/* Chapters overview */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 className="heading-md">{activeSubject.name} Chapters</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('learning')}>View all →</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {activeSubject.chapters.map((ch, i) => {
                                const done = ch.topics.filter(t => t.completed).length;
                                const pct = Math.round((done / ch.topics.length) * 100);
                                return (
                                    <div
                                        key={ch.id}
                                        onClick={() => setCurrentView('learning')}
                                        style={{
                                            padding: '12px 14px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 12,
                                            cursor: 'pointer',
                                            transition: 'border-color 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = activeSubject.color + '60')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: ch.completed ? 'var(--grad-success)' : activeSubject.gradient,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
                                            opacity: ch.completed ? 1 : 0.85,
                                        }}>
                                            {ch.completed ? '✓' : i + 1}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600 }}>{ch.title}</span>
                                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{done}/{ch.topics.length}</span>
                                            </div>
                                            <div className="progress-container" style={{ height: 3 }}>
                                                <div className="progress-bar" style={{ width: `${pct}%`, background: activeSubject.gradient }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* AI Recommendation */}
                    <div style={{
                        padding: '20px 24px',
                        background: `linear-gradient(135deg, ${activeSubject.color}12, rgba(99,102,241,0.06))`,
                        border: `1px solid ${activeSubject.color}25`,
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <span style={{ fontSize: 24 }}>🤖</span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>AI Recommendation</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personalized for {activeSubject.name}</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
                            {weakTopics.length > 0
                                ? <>You have <strong style={{ color: '#fcd34d' }}>{weakTopics.length} weak area{weakTopics.length > 1 ? 's' : ''}</strong> in {activeSubject.name}. Focus on <strong style={{ color: 'var(--primary-300)' }}>{weakTopics[0].topic}</strong> today — it's your biggest gap.</>
                                : <>Your {activeSubject.name} mastery is at <strong style={{ color: '#6ee7b7' }}>{mastery}%</strong>! Keep up the great work and aim for 90%+ this week.</>}
                        </p>
                        <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('ai')}>
                            🎯 Get Study Plan
                        </button>
                    </div>

                    {/* Today's Practice */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <h2 className="heading-md">✍️ Today's Practice</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('practice')}>Start →</button>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                            5 recommended <strong>{activeSubject.name}</strong> questions tailored to your weak areas.
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                                <div key={diff} style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                                        {diff === 'Easy' ? '2' : diff === 'Medium' ? '2' : '1'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{diff}</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full" style={{ marginTop: 14 }} onClick={() => setCurrentView('practice')}>
                            Start Today's Quiz
                        </button>
                    </div>

                    {/* Weak Topics — subject filtered */}
                    {weakTopics.length > 0 && (
                        <div style={{
                            padding: '20px 24px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <h2 className="heading-md">⚠️ Weak Areas</h2>
                                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('progress')}>View →</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {weakTopics.map((wt, i) => (
                                    <div key={i} style={{
                                        padding: '10px 14px',
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
                    )}

                    {/* Streak */}
                    <div style={{
                        padding: '18px 24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h2 className="heading-md">🔥 Streak</h2>
                            <span style={{ fontSize: 18, fontWeight: 800 }} className="text-gradient">{progress.streak} days</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
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
