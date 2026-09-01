'use client';
import { useApp } from '@/context/AppContext';

export default function Notifications() {
    const { notifications } = useApp();

    if (notifications.length === 0) return null;

    return (
        <div className="notification-toast">
            {notifications.map(n => (
                <div key={n.id} className={`toast ${n.type}`}>
                    <span style={{ fontSize: 16 }}>
                        {n.type === 'success' ? '✓' : n.type === 'warning' ? '⚠' : 'ℹ'}
                    </span>
                    <span>{n.message}</span>
                </div>
            ))}
        </div>
    );
}
