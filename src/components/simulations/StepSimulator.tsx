'use client';
// ════════════════════════════════════════════════════════════════════════════
// STEP SIMULATOR — generic, subject-agnostic discrete step-through walkthrough
// Renders from TopicLesson.steps — works identically for any subject (a
// biological process, a historical chain of events, an algorithm, a physics
// procedure) with zero topic/subject conditionals inside this component.
//
// Discrete/logical content, not continuous physics — driven by a timer, not
// requestAnimationFrame (there is no physical state to integrate between steps).
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';
import { Step } from '@/lib/ai/types';

interface Props {
    steps: Step[];
    topic: string;
    autoPlayIntervalMs?: number;
}

export default function StepSimulator({ steps, topic, autoPlayIntervalMs = 3500 }: Props) {
    const [current, setCurrent] = useState(0);
    const [playing, setPlaying] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const atEnd = current === steps.length - 1;

    useEffect(() => {
        if (!playing || atEnd) return;
        timerRef.current = setInterval(() => {
            setCurrent(c => {
                if (c >= steps.length - 1) {
                    setPlaying(false);
                    return c;
                }
                return c + 1;
            });
        }, autoPlayIntervalMs);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [playing, atEnd, steps.length, autoPlayIntervalMs]);

    if (!steps || steps.length === 0) return null;
    const step = steps[current];

    const handlePlayPause = () => {
        if (atEnd) { setCurrent(0); setPlaying(true); return; }
        setPlaying(p => !p);
    };
    const handleStepForward = () => { setPlaying(false); setCurrent(c => Math.min(c + 1, steps.length - 1)); };
    const handleStepBack = () => { setPlaying(false); setCurrent(c => Math.max(c - 1, 0)); };
    const handleReset = () => { setPlaying(false); setCurrent(0); };

    return (
        <div aria-label={`Step-by-step walkthrough for ${topic}`} style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
        }}>
            {/* Progress rail */}
            <div style={{ padding: '24px 24px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {steps.map((s, i) => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
                        <button
                            onClick={() => { setPlaying(false); setCurrent(i); }}
                            title={s.title}
                            style={{
                                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                                fontFamily: 'Playfair Display, serif',
                                background: i === current ? 'var(--stone-800)' : i < current ? 'var(--sage-100)' : 'var(--cream-200)',
                                color: i === current ? 'var(--cream-50)' : i < current ? 'var(--sage-600)' : 'var(--text-muted)',
                                border: i === current ? '2px solid var(--stone-800)' : '1px solid var(--border-medium)',
                                transition: 'all 0.2s',
                            }}
                        >{i < current ? '✓' : s.step}</button>
                        {i < steps.length - 1 && (
                            <div style={{
                                flex: 1, height: 2, margin: '0 4px',
                                background: i < current ? 'var(--sage-200)' : 'var(--border-subtle)',
                                transition: 'background 0.2s',
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Current step card */}
            <div style={{ padding: '8px 24px 20px' }}>
                <div style={{
                    padding: '20px 22px', background: 'var(--sage-100)', border: '1px solid var(--sage-200)',
                    borderRadius: 'var(--radius-lg)', minHeight: 92,
                }}>
                    <div className="eyebrow" style={{ color: 'var(--sage-600)', marginBottom: 8 }}>
                        Step {step.step} of {steps.length}
                    </div>
                    <div style={{
                        fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600,
                        color: 'var(--stone-800)', marginBottom: 8,
                    }}>{step.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{step.explanation}</div>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                padding: '14px 24px', borderTop: '1px solid var(--border-subtle)',
                display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
            }}>
                <button onClick={handleStepBack} disabled={current === 0} className="btn btn-secondary btn-sm">← Back</button>
                <button onClick={handlePlayPause} className="btn btn-primary btn-sm" style={{ minWidth: 90 }}>
                    {playing ? '⏸ Pause' : atEnd ? '↺ Replay' : '▶ Play'}
                </button>
                <button onClick={handleStepForward} disabled={atEnd} className="btn btn-secondary btn-sm">Next →</button>
                <button onClick={handleReset} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>↺ Reset</button>
            </div>
        </div>
    );
}
