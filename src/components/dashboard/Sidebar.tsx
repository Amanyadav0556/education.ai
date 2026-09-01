'use client';
import { useApp, DashboardView } from '@/context/AppContext';

const NAV_ITEMS: { id: DashboardView; label: string; icon: string; section?: string }[] = [
    { id: 'home', label: 'Dashboard', icon: '◻', section: 'MAIN' },
    { id: 'learning', label: 'Learning', icon: '◻' },
    { id: 'practice', label: 'Practice', icon: '◻' },
    { id: 'resources', label: 'Resources', icon: '◻' },
    { id: 'ai', label: 'Personal AI', icon: '◻', section: 'TOOLS' },
    { id: 'progress', label: 'Progress', icon: '◻', section: 'INSIGHTS' },
];

const ICONS: Record<DashboardView, string> = {
    home: '⊞',
    learning: '◈',
    practice: '◇',
    resources: '◉',
    ai: '◎',
    progress: '◑',
};

export default function Sidebar() {
    const {
        currentView, setCurrentView,
        sidebarCollapsed, setSidebarCollapsed,
        user, logout,
        activeSubject, changeSubject,
    } = useApp();

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    let lastSection = '';

    return (
        <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span style={{ fontSize: 14 }}>🎓</span>
                </div>
                {!sidebarCollapsed && (
                    <span className="sidebar-brand">EduAI</span>
                )}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 14, color: 'var(--stone-500)' }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? '›' : '‹'}
                </button>
            </div>

            {/* Active Subject chip */}
            {activeSubject && (
                <div style={{ padding: '10px 10px 0' }}>
                    <button
                        onClick={changeSubject}
                        title={sidebarCollapsed ? `Active: ${activeSubject.name} — Change` : undefined}
                        style={{
                            width: '100%',
                            padding: sidebarCollapsed ? '8px' : '10px 12px',
                            background: 'var(--stone-800)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            cursor: 'pointer',
                            transition: 'opacity 0.15s',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{activeSubject.emoji}</span>
                        {!sidebarCollapsed && (
                            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(247,242,232,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                                    Active Subject
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cream-50)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {activeSubject.name}
                                </div>
                            </div>
                        )}
                        {!sidebarCollapsed && (
                            <span style={{ fontSize: 12, color: 'rgba(247,242,232,0.35)', flexShrink: 0, fontSize: '11px' }}>⇄</span>
                        )}
                    </button>
                </div>
            )}

            {/* Nav */}
            <nav className="sidebar-nav" style={{ marginTop: 6 }}>
                {NAV_ITEMS.map(item => {
                    const showSection = !sidebarCollapsed && item.section && item.section !== lastSection;
                    if (item.section) lastSection = item.section;

                    return (
                        <div key={item.id}>
                            {showSection && (
                                <div className="sidebar-section-label">{item.section}</div>
                            )}
                            <button
                                className={`sidebar-item${currentView === item.id ? ' active' : ''}`}
                                onClick={() => setCurrentView(item.id)}
                                title={sidebarCollapsed ? item.label : undefined}
                                style={{ fontSize: 12, fontWeight: currentView === item.id ? 600 : 400 }}
                            >
                                <span style={{
                                    fontSize: 10, flexShrink: 0,
                                    width: 8, height: 8,
                                    borderRadius: '50%',
                                    background: currentView === item.id ? 'var(--cream-50)' : 'var(--stone-400)',
                                    display: 'inline-block',
                                    marginRight: sidebarCollapsed ? 0 : 0,
                                    flexShrink: 0,
                                }} />
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        </div>
                    );
                })}

                {/* Change subject */}
                {!sidebarCollapsed && (
                    <>
                        <div className="sidebar-section-label">SUBJECT</div>
                        <button
                            className="sidebar-item"
                            onClick={changeSubject}
                            style={{ fontSize: 12 }}
                        >
                            <span style={{ fontSize: 10, width: 8, height: 8, borderRadius: '50%', background: 'var(--stone-400)', display: 'inline-block' }} />
                            Change Subject
                        </button>
                    </>
                )}
                {sidebarCollapsed && (
                    <button className="sidebar-item" onClick={changeSubject} title="Change Subject">
                        <span style={{ fontSize: 12 }}>⇄</span>
                    </button>
                )}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {!sidebarCollapsed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12 }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="truncate" style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-800)' }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email}
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-icon" onClick={logout} title="Sign out" style={{ flexShrink: 0, fontSize: 13 }}>
                            ↩
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: 12 }}>
                            {initials}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
