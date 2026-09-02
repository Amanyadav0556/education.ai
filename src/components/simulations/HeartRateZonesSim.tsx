'use client';
// ════════════════════════════════════════════════════════════════════════════
// HEART RATE TRAINING ZONES SIMULATOR
// Max HR (Fox formula): 220 − age
// Karvonen target HR: ((MaxHR − RestHR) × %intensity) + RestHR
// ════════════════════════════════════════════════════════════════════════════
import { useState } from 'react';

const ZONES = [
    { key: 'warmup', label: 'Warm-up', range: [0.5, 0.6], color: '#8C7466' },
    { key: 'fatburn', label: 'Fat Burn', range: [0.6, 0.7], color: '#818cf8' },
    { key: 'cardio', label: 'Cardio', range: [0.7, 0.8], color: '#4E6B57' },
    { key: 'hard', label: 'Hard', range: [0.8, 0.9], color: '#A5614A' },
    { key: 'peak', label: 'Peak / Max', range: [0.9, 1.0], color: '#8B4A35' },
] as const;

export default function HeartRateZonesSim() {
    const [age, setAge] = useState(20);
    const [restingHr, setRestingHr] = useState(70);
    const [zoneKey, setZoneKey] = useState<typeof ZONES[number]['key']>('cardio');
    const [useKarvonen, setUseKarvonen] = useState(true);

    const maxHr = 220 - age;
    const zone = ZONES.find(z => z.key === zoneKey)!;
    const [lo, hi] = zone.range;

    const targetLo = useKarvonen
        ? Math.round((maxHr - restingHr) * lo + restingHr)
        : Math.round(maxHr * lo);
    const targetHi = useKarvonen
        ? Math.round((maxHr - restingHr) * hi + restingHr)
        : Math.round(maxHr * hi);

    const markerPct = ((targetLo + targetHi) / 2 / maxHr) * 100;

    const handleReset = () => {
        setAge(20);
        setRestingHr(70);
        setZoneKey('cardio');
        setUseKarvonen(true);
    };

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
            padding: '28px 24px',
        }}>
            {/* Zone bar */}
            <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', borderRadius: 'var(--radius-pill)', overflow: 'hidden', height: 28, position: 'relative' }}>
                    {ZONES.map(z => (
                        <div key={z.key} style={{
                            flex: z.range[1] - z.range[0],
                            background: z.color,
                            opacity: z.key === zoneKey ? 1 : 0.35,
                            transition: 'opacity 0.2s',
                        }} />
                    ))}
                    <div style={{
                        position: 'absolute', top: -6, left: `${Math.max(1, Math.min(99, markerPct))}%`,
                        transform: 'translateX(-50%)', width: 2, height: 40, background: 'var(--stone-800)',
                    }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--stone-400)' }}>
                    <span>0 bpm</span>
                    <span>{maxHr} bpm (max)</span>
                </div>
            </div>

            {/* Zone selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0' }}>
                {ZONES.map(z => (
                    <button key={z.key} onClick={() => setZoneKey(z.key)} style={{
                        padding: '7px 14px', borderRadius: 'var(--radius-pill)', fontSize: 12,
                        background: zoneKey === z.key ? z.color : 'transparent',
                        color: zoneKey === z.key ? 'var(--cream-50)' : 'var(--stone-600)',
                        border: `1px solid ${zoneKey === z.key ? z.color : 'var(--border-medium)'}`,
                        cursor: 'pointer', fontWeight: zoneKey === z.key ? 600 : 400,
                    }}>{z.label} ({Math.round(z.range[0] * 100)}–{Math.round(z.range[1] * 100)}%)</button>
                ))}
            </div>

            {/* Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Age</label>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{age} yrs</span>
                    </div>
                    <input type="range" min={10} max={80} step={1} value={age}
                        onChange={e => setAge(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Resting Heart Rate</label>
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{restingHr} bpm</span>
                    </div>
                    <input type="range" min={40} max={100} step={1} value={restingHr}
                        onChange={e => setRestingHr(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--stone-600)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={useKarvonen} onChange={e => setUseKarvonen(e.target.checked)} style={{ accentColor: 'var(--stone-800)' }} />
                    Use Karvonen formula (accounts for resting HR)
                </label>
                <button onClick={handleReset} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'var(--cream-200)', color: 'var(--stone-700)',
                    border: '1px solid var(--border-medium)', cursor: 'pointer', marginLeft: 'auto',
                }}>↺ Reset</button>
            </div>

            <div style={{
                padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8,
                display: 'flex', gap: 24, flexWrap: 'wrap',
            }}>
                <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                    Max HR = 220 − age = <strong>{maxHr} bpm</strong>
                </div>
                <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                    {zone.label} target = <strong>{targetLo}–{targetHi} bpm</strong>
                </div>
            </div>
        </div>
    );
}
