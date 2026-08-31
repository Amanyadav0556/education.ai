'use client';
import { useApp } from '@/context/AppContext';

export default function Notifications() {
    const { notifications } = useApp();

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
        }}>
            {notifications.map(n => (
                <div
                    key={n.id}
                    style={{
                        padding: '14px 20px',
                        background: n.type === 'success'
                            ? 'rgba(16,185,129,0.15)'
                            : n.type === 'warning'
                                ? 'rgba(245,158,11,0.15)'
                                : 'rgba(99,102,241,0.15)',
                        border: `1px solid ${n.type === 'success' ? 'rgba(16,185,129,0.4)' : n.type === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(99,102,241,0.4)'}`,
                        borderRadius: 'var(--radius-md)',
                        backdropFilter: 'blur(16px)',
                        maxWidth: 360,
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-elevated)',
                        animation: 'fade-in 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <span style={{ fontSize: 18 }}>
                        {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    {n.message}
                </div>
            ))}
        </div>
    );
}
