'use client';
import { useApp } from '@/context/AppContext';

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Dashboard', subtitle: "Today's overview" },
    learning: { title: 'Learning', subtitle: 'Chapters & topics' },
    practice: { title: 'Practice', subtitle: 'Quizzes & questions' },
    resources: { title: 'Resources', subtitle: 'Notes, PDFs & flashcards' },
    ai: { title: 'Personal AI', subtitle: 'Your AI tutor' },
    progress: { title: 'Progress', subtitle: 'Mastery & planner' },
};

export default function Topbar({ marginLeft }: { marginLeft: number }) {
    const { currentView, user, progress, setCurrentView, addNotification, activeSubject, changeSubject } = useApp();
    const info = VIEW_TITLES[currentView] || VIEW_TITLES.home;

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <header className="topbar" style={{ left: marginLeft }}>
            {/* Left */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {currentView === 'home' ? (
                    <div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 15, fontWeight: 600,
                            color: 'var(--stone-800)',
                        }}>
                            {greeting}, {user?.name?.split(' ')[0]}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
                            {info.subtitle}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 15, fontWeight: 600,
                            color: 'var(--stone-800)',
                        }}>{info.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{info.subtitle}</div>
                    </div>
                )}
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

                {/* Active Subject pill */}
                {activeSubject && (
                    <button
                        id="topbar-active-subject"
                        onClick={changeSubject}
                        title="Change subject"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: '6px 14px',
                            background: 'var(--stone-800)',
                            border: 'none',
                            borderRadius: 'var(--radius-pill)',
                            cursor: 'pointer',
                            fontSize: 12, fontWeight: 500,
                            color: 'var(--cream-50)',
                            transition: 'opacity 0.15s',
                            fontFamily: 'DM Sans, sans-serif',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        <span style={{ fontSize: 14 }}>{activeSubject.emoji}</span>
                        <span>{activeSubject.name}</span>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>⇄</span>
                    </button>
                )}

                {/* Streak */}
                <button
                    onClick={() => setCurrentView('progress')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 12px',
                        background: 'var(--cream-200)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--stone-800)',
                        fontFamily: 'DM Sans, sans-serif',
                    }}
                >
                    🔥 <span>{progress.streak}d</span>
                </button>

                {/* Accuracy */}
                <button
                    onClick={() => setCurrentView('progress')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 12px',
                        background: 'var(--cream-200)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--stone-800)',
                        fontFamily: 'DM Sans, sans-serif',
                    }}
                >
                    🎯 <span>{progress.accuracy}%</span>
                </button>

                {/* Bell */}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ position: 'relative', color: 'var(--stone-600)', fontSize: 16 }}
                    onClick={() => addNotification(`New ${activeSubject?.name ?? ''} content ready!`, 'info')}
                    title="Notifications"
                >
                    🔔
                    <span className="notif-dot" />
                </button>
            </div>
        </header>
    );
}
