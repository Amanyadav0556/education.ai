'use client';
// ════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TENSE EXPLORER
// Pick a time (Past/Present/Future) × aspect (Simple/Continuous/Perfect/
// Perfect Continuous) and see the formula + a live example sentence.
// ════════════════════════════════════════════════════════════════════════════
import { useState } from 'react';

type TimeKey = 'Past' | 'Present' | 'Future';
type AspectKey = 'Simple' | 'Continuous' | 'Perfect' | 'Perfect Continuous';

interface TenseEntry { formula: string; sentence: string; highlight: string; }

const TENSES: Record<TimeKey, Record<AspectKey, TenseEntry>> = {
    Past: {
        Simple: { formula: 'Subject + V2', sentence: 'She played the piano yesterday.', highlight: 'played' },
        Continuous: { formula: 'Subject + was/were + V-ing', sentence: 'She was playing the piano when I called.', highlight: 'was playing' },
        Perfect: { formula: 'Subject + had + V3', sentence: 'She had played the piano before the show began.', highlight: 'had played' },
        'Perfect Continuous': { formula: 'Subject + had been + V-ing', sentence: 'She had been playing the piano for an hour before we arrived.', highlight: 'had been playing' },
    },
    Present: {
        Simple: { formula: 'Subject + V1(+s/es)', sentence: 'She plays the piano every evening.', highlight: 'plays' },
        Continuous: { formula: 'Subject + am/is/are + V-ing', sentence: 'She is playing the piano right now.', highlight: 'is playing' },
        Perfect: { formula: 'Subject + has/have + V3', sentence: 'She has played the piano since childhood.', highlight: 'has played' },
        'Perfect Continuous': { formula: 'Subject + has/have been + V-ing', sentence: 'She has been playing the piano for two hours.', highlight: 'has been playing' },
    },
    Future: {
        Simple: { formula: 'Subject + will + V1', sentence: 'She will play the piano at the concert.', highlight: 'will play' },
        Continuous: { formula: 'Subject + will be + V-ing', sentence: 'She will be playing the piano at 6 pm tomorrow.', highlight: 'will be playing' },
        Perfect: { formula: 'Subject + will have + V3', sentence: 'She will have played the piano for ten years by next June.', highlight: 'will have played' },
        'Perfect Continuous': { formula: 'Subject + will have been + V-ing', sentence: 'She will have been playing the piano for ten years by next June.', highlight: 'will have been playing' },
    },
};

const TIMES: TimeKey[] = ['Past', 'Present', 'Future'];
const ASPECTS: AspectKey[] = ['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'];

function renderHighlighted(sentence: string, highlight: string) {
    const idx = sentence.indexOf(highlight);
    if (idx === -1) return sentence;
    return (
        <>
            {sentence.slice(0, idx)}
            <strong style={{ color: 'var(--terra-600)', background: 'var(--terra-100)', padding: '1px 4px', borderRadius: 4 }}>
                {highlight}
            </strong>
            {sentence.slice(idx + highlight.length)}
        </>
    );
}

export default function TenseTimelineSim() {
    const [time, setTime] = useState<TimeKey>('Present');
    const [aspect, setAspect] = useState<AspectKey>('Simple');

    const entry = TENSES[time][aspect];
    const timeIndex = TIMES.indexOf(time);

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
            padding: '28px 24px',
        }}>
            {/* Timeline slider (Past — Present — Future) */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
                <div style={{ position: 'absolute', top: 11, left: '8%', right: '8%', height: 2, background: 'var(--border-medium)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {TIMES.map((t, i) => (
                        <button key={t} onClick={() => setTime(t)} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                            background: 'none', border: 'none', cursor: 'pointer', flex: 1,
                        }}>
                            <div style={{
                                width: t === time ? 22 : 14, height: t === time ? 22 : 14, borderRadius: '50%',
                                background: t === time ? 'var(--sage-600)' : (i < timeIndex ? 'var(--sage-200)' : 'var(--cream-300)'),
                                border: '2px solid var(--cream-50)',
                                boxShadow: t === time ? '0 0 0 3px var(--sage-100)' : 'none',
                                transition: 'all 0.2s',
                            }} />
                            <span style={{ fontSize: 13, fontWeight: t === time ? 700 : 500, color: t === time ? 'var(--stone-800)' : 'var(--stone-400)' }}>{t}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Aspect selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {ASPECTS.map(a => (
                    <button key={a} onClick={() => setAspect(a)} style={{
                        padding: '7px 14px', borderRadius: 'var(--radius-pill)', fontSize: 12,
                        background: aspect === a ? 'var(--stone-800)' : 'transparent',
                        color: aspect === a ? 'var(--cream-50)' : 'var(--stone-600)',
                        border: `1px solid ${aspect === a ? 'var(--stone-800)' : 'var(--border-medium)'}`,
                        cursor: 'pointer', fontWeight: aspect === a ? 600 : 400,
                    }}>{a}</button>
                ))}
            </div>

            {/* Result card */}
            <div style={{ background: 'var(--cream-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage-600)', letterSpacing: 0.5, marginBottom: 6 }}>
                    {time.toUpperCase()} · {aspect.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--stone-800)', marginBottom: 12 }}>
                    {entry.formula}
                </div>
                <div style={{ fontSize: 15, color: 'var(--stone-700)', lineHeight: 1.6 }}>
                    “{renderHighlighted(entry.sentence, entry.highlight)}”
                </div>
            </div>
        </div>
    );
}
