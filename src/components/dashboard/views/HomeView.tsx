'use client';
import { useApp } from '@/context/AppContext';

export default function HomeView() {
    const { user, activeSubject, progress, setCurrentView, changeSubject } = useApp();

    if (!activeSubject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No subject selected</h2>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const mastery = progress.subjectMastery[activeSubject.id] ?? activeSubject.mastery;
    const weakTopics = progress.weakTopics.filter(w =>
        w.subject.toLowerCase() === activeSubject.name.toLowerCase()
    );
    const continueChapter = activeSubject.chapters.find(c => !c.completed);
    const continueTopic = continueChapter?.topics.find(t => !t.completed);
    const totalTopics = activeSubject.chapters.reduce((a, c) => a + c.topics.length, 0);
    const completedTopics = activeSubject.chapters.reduce((a, c) => a + c.topics.filter(t => t.completed).length, 0);

    return (
        <div>
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div style={{
                padding: '32px 36px',
                background: 'var(--stone-800)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative texture */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(ellipse 70% 60% at 90% 50%, rgba(61,84,69,0.3) 0%, transparent 60%)',
                }} />

                <div style={{ position: 'relative' }}>
                    <div className="eyebrow" style={{ color: 'rgba(247,242,232,0.4)', marginBottom: 10 }}>
                        Current Subject
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                                <span style={{ fontSize: 44 }}>{activeSubject.emoji}</span>
                                <h1 style={{
                                    fontFamily: 'Playfair Display, serif',
                                    fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                                    fontWeight: 600,
                                    color: 'var(--cream-50)',
                                    letterSpacing: '-0.015em',
                                    lineHeight: 1.1,
                                }}>
                                    {activeSubject.name}
                                </h1>
                            </div>
                            <p style={{ color: 'rgba(247,242,232,0.55)', fontSize: 14, lineHeight: 1.65, maxWidth: 440 }}>
                                Welcome back, <strong style={{ color: 'var(--cream-50)' }}>{user?.name?.split(' ')[0]}</strong>.
                                You've completed <strong style={{ color: 'var(--cream-50)' }}>{completedTopics} of {totalTopics}</strong> topics.
                                {completedTopics < totalTopics ? " Keep going." : " Great work!"}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            <button className="btn btn-secondary" onClick={() => setCurrentView('practice')}
                                style={{ color: 'var(--cream-50)', borderColor: 'rgba(247,242,232,0.25)', background: 'rgba(247,242,232,0.08)' }}>
                                Start Practice
                            </button>
                            <button className="btn btn-ghost" onClick={() => setCurrentView('ai')}
                                style={{ color: 'rgba(247,242,232,0.65)', fontSize: 12 }}>
                                Ask AI
                            </button>
                            <button className="btn btn-ghost" onClick={changeSubject}
                                style={{ color: 'rgba(247,242,232,0.4)', fontSize: 11 }}>
                                ⇄ Change
                            </button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 24, maxWidth: 420 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: 'rgba(247,242,232,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Progress
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream-50)' }}>{activeSubject.progress}%</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(247,242,232,0.12)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${activeSubject.progress}%`, background: 'rgba(247,242,232,0.5)', borderRadius: 100, transition: 'width 1s var(--ease-out)' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────────────── */}
            <div className="grid-4 stagger-children" style={{ marginBottom: 24 }}>
                {[
                    { icon: '◎', label: `${activeSubject.name} Mastery`, value: `${mastery}%` },
                    { icon: '◈', label: 'Day Streak', value: `${progress.streak}` },
                    { icon: '◉', label: 'Topics Done', value: `${completedTopics}/${totalTopics}` },
                    { icon: '◇', label: 'Accuracy', value: `${progress.accuracy}%` },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div style={{
                            fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14,
                        }}>{s.label}</div>
                        <div className="stat-value">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2" style={{ gap: 20 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Continue Learning */}
                    {continueTopic && continueChapter && (
                        <div style={{
                            padding: '22px 24px',
                            background: 'var(--cream-50)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <div className="eyebrow" style={{ marginBottom: 12 }}>Continue Learning</div>
                            <h3 className="heading-serif-sm" style={{ marginBottom: 5 }}>{continueChapter.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                                Next up: <span style={{ color: 'var(--stone-800)', fontWeight: 500 }}>{continueTopic.title}</span>
                            </p>
                            <button className="btn btn-primary btn-sm" onClick={() => setCurrentView('learning')}>
                                Continue →
                            </button>
                        </div>
                    )}

                    {/* Chapters */}
                    <div style={{
                        padding: '22px 24px',
                        background: 'var(--cream-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <h2 className="heading-md">Chapters</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('learning')} style={{ fontSize: 12 }}>
                                View all →
                            </button>
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
                                            background: 'var(--cream-100)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.15s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--stone-800)')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--stone-800)' }}>
                                                {ch.completed ? '✓ ' : ''}{ch.title}
                                            </span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{done}/{ch.topics.length}</span>
                                        </div>
                                        <div className="progress-container" style={{ height: 3 }}>
                                            <div className="progress-bar" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* AI Recommendation */}
                    <div style={{
                        padding: '22px 24px',
                        background: 'var(--sage-100)',
                        border: '1px solid var(--sage-200)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div className="eyebrow" style={{ color: 'var(--sage-700)', marginBottom: 10 }}>AI Insight</div>
                        <h3 className="heading-md" style={{ marginBottom: 10 }}>
                            {weakTopics.length > 0 ? `${weakTopics.length} weak area${weakTopics.length > 1 ? 's' : ''} detected` : 'Solid progress!'}
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--stone-600)', lineHeight: 1.65, marginBottom: 16 }}>
                            {weakTopics.length > 0
                                ? <>Focus on <strong>{weakTopics[0].topic}</strong> today — it's your biggest gap in {activeSubject.name}.</>
                                : <>Your {activeSubject.name} mastery is at <strong>{mastery}%</strong>. Aim for 90%+ this week.</>}
                        </p>
                        <button className="btn btn-sage btn-sm" onClick={() => setCurrentView('ai')}>
                            Get Study Plan →
                        </button>
                    </div>

                    {/* Today's Practice */}
                    <div style={{
                        padding: '22px 24px',
                        background: 'var(--cream-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h2 className="heading-md">Today's Practice</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('practice')} style={{ fontSize: 12 }}>Start →</button>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                            5 curated <strong style={{ color: 'var(--stone-800)' }}>{activeSubject.name}</strong> questions targeting your weak spots.
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                            {[['Easy', '2'], ['Medium', '2'], ['Hard', '1']].map(([d, n]) => (
                                <div key={d} style={{
                                    flex: 1, padding: '10px',
                                    background: 'var(--cream-200)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ fontSize: 16, fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>{n}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{d}</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setCurrentView('practice')}>
                            Start Quiz
                        </button>
                    </div>

                    {/* Weak Topics */}
                    {weakTopics.length > 0 && (
                        <div style={{
                            padding: '22px 24px',
                            background: 'var(--terra-100)',
                            border: '1px solid rgba(139,74,53,0.15)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <div className="eyebrow" style={{ color: 'var(--terra-600)', marginBottom: 12 }}>Weak Areas</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {weakTopics.map((wt, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 13, color: 'var(--stone-700)', fontWeight: 400 }}>{wt.topic}</span>
                                        <button className="btn btn-sm" style={{
                                            background: 'var(--terra-600)', color: 'var(--cream-50)',
                                            border: 'none', fontSize: 11, padding: '5px 12px',
                                        }} onClick={() => setCurrentView('practice')}>
                                            Practice
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Streak */}
                    <div style={{
                        padding: '20px 24px',
                        background: 'var(--cream-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h2 className="heading-md">Study Streak</h2>
                            <span style={{
                                fontFamily: 'Playfair Display, serif',
                                fontWeight: 600, fontSize: 18, color: 'var(--stone-800)',
                            }}>{progress.streak} days</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {progress.studyDays.map((active, i) => (
                                <div key={i} className={`streak-tile ${active ? 'active' : 'inactive'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
