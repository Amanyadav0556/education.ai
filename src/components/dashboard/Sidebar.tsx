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
    const { currentView, setCurrentView, sidebarCollapsed, setSidebarCollapsed, user, logout } = useApp();

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    let lastSection = '';

    return (
        <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-logo">🎓</div>
                {!sidebarCollapsed && (
                    <div className="sidebar-brand">EduAI</div>
                )}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ marginLeft: 'auto', flexShrink: 0 }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? '→' : '←'}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
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
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {!sidebarCollapsed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 14 }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, truncate: true }}
                                className="truncate">{user?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.class}</div>
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
