'use client';
import { useApp, DashboardView } from '@/context/AppContext';

const NAV_ITEMS: { id: DashboardView; label: string; icon: string; section?: string }[] = [
    { id: 'home', label: 'Dashboard', icon: '🏠', section: 'MAIN' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'practice', label: 'Practice', icon: '✍️' },
    { id: 'resources', label: 'Resources', icon: '📖' },
    { id: 'ai', label: 'Personal AI', icon: '🤖', section: 'AI TOOLS' },
    { id: 'progress', label: 'Progress & Planner', icon: '📊', section: 'ANALYTICS' },
];

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
            {/* Header / Brand */}
            <div className="sidebar-header">
                <div className="sidebar-logo">🎓</div>
                {!sidebarCollapsed && (
                    <div className="sidebar-brand">EduAI</div>
                )}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 16 }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? '→' : '←'}
                </button>
            </div>

            {/* Active Subject indicator */}
            {activeSubject && (
                <div style={{
                    margin: '8px 12px 0',
                    padding: sidebarCollapsed ? '8px' : '10px 14px',
                    background: `linear-gradient(135deg, ${activeSubject.color}18, ${activeSubject.color}08)`,
                    border: `1px solid ${activeSubject.color}40`,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                }}
                    onClick={changeSubject}
                    title={sidebarCollapsed ? `Active: ${activeSubject.name} — Change Subject` : undefined}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = activeSubject.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = `${activeSubject.color}40`)}
                >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{activeSubject.emoji}</span>
                    {!sidebarCollapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>Active Subject</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {activeSubject.name}
                            </div>
                        </div>
                    )}
                    {!sidebarCollapsed && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }} title="Change subject">🔄</span>
                    )}
                </div>
            )}

            {/* Navigation */}
            <nav className="sidebar-nav" style={{ marginTop: 8 }}>
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
                            >
                                <span className="sidebar-item-icon">{item.icon}</span>
                                {!sidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        </div>
                    );
                })}

                {/* Change Subject button */}
                {!sidebarCollapsed && (
                    <>
                        <div className="sidebar-section-label" style={{ marginTop: 8 }}>SUBJECT</div>
                        <button
                            className="sidebar-item"
                            onClick={changeSubject}
                            title="Change your active subject"
                        >
                            <span className="sidebar-item-icon">🔄</span>
                            <span>Change Subject</span>
                        </button>
                    </>
                )}
                {sidebarCollapsed && (
                    <button
                        className="sidebar-item"
                        onClick={changeSubject}
                        title="Change Subject"
                    >
                        <span className="sidebar-item-icon">🔄</span>
                    </button>
                )}
            </nav>

            {/* Footer — user profile */}
            <div className="sidebar-footer">
                {!sidebarCollapsed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14 }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
                        </div>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={logout}
                            title="Logout"
                            style={{ flexShrink: 0 }}
                        >🚪</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14 }}>
                            {initials}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
