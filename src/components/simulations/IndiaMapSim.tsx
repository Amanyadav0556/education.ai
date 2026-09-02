'use client';
// Leaflet touches `window` at import time, so the real map must be client-only
// with SSR disabled — see node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md
import dynamic from 'next/dynamic';

const IndiaMapInner = dynamic(() => import('./IndiaMapInner'), {
    ssr: false,
    loading: () => (
        <div style={{
            height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', color: 'var(--stone-400)', fontSize: 13,
        }}>
            Loading map…
        </div>
    ),
});

export default function IndiaMapSim() {
    return <IndiaMapInner />;
}
