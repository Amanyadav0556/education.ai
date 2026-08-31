'use client';
import { useApp } from '@/context/AppContext';

const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Dashboard', subtitle: "Here's your learning overview" },
    learning: { title: '📚 Learning', subtitle: 'Subjects, chapters & AI explanations' },
    practice: { title: '✍️ Practice', subtitle: 'Quizzes, questions & difficulty levels' },
    resources: { title: '📖 Resources', subtitle: 'Notes, PDFs, videos & flashcards' },
    ai: { title: '🤖 Personal AI', subtitle: 'Your 24/7 AI tutor & mentor' },
    progress: { title: '📊 Progress & Planner', subtitle: 'Track your mastery and plan your studies' },
};

export default function Topbar({ marginLeft }: { marginLeft: number }) {
    const { currentView, user, progress, setCurrentView, addNotification } = useApp();
    const info = VIEW_TITLES[currentView] || VIEW_TITLES.home;

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <header
            className="topbar"
            style={{ left: marginLeft }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                {currentView === 'home' ? (
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {greeting}, {user?.name?.split(' ')[0]}! 👋
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{info.subtitle}</div>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{info.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{info.subtitle}</div>
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Streak */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: 100,
                        cursor: 'pointer',
                    }}
                    onClick={() => setCurrentView('progress')}
                >
                    <span>🔥</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fcd34d' }}>{progress.streak} day streak</span>
                </div>

                {/* Accuracy */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: 100,
                        cursor: 'pointer',
                    }}
                    onClick={() => setCurrentView('progress')}
                >
                    <span>🎯</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-300)' }}>{progress.accuracy}% Accuracy</span>
                </div>

                {/* Notification Bell */}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ position: 'relative' }}
                    onClick={() => addNotification('You have 3 new practice questions ready!', 'info')}
                    title="Notifications"
                >
                    🔔
                    <span className="notif-dot" />
                </button>

                {/* Search */}
                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                    🔍 Search
                </button>
            </div>
        </header>
    );
}
