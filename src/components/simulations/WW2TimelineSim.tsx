'use client';
// ════════════════════════════════════════════════════════════════════════════
// INTERACTIVE HISTORY TIMELINE — World War II (illustrative exemplar)
// Prev/Next, click-to-jump, and auto-play through a sequence of key events.
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

interface TimelineEvent { year: string; title: string; description: string; }

const EVENTS: TimelineEvent[] = [
    { year: '1939', title: 'Invasion of Poland', description: 'Germany invades Poland on 1 September, prompting Britain and France to declare war two days later — the conventional start of WWII in Europe.' },
    { year: '1940', title: 'Fall of France', description: 'Germany\'s blitzkrieg overwhelms France within six weeks; Britain stands alone and endures the Battle of Britain in the skies.' },
    { year: '1941', title: 'Operation Barbarossa & Pearl Harbor', description: 'Germany invades the Soviet Union in June; Japan attacks Pearl Harbor in December, bringing the United States into the war.' },
    { year: '1942', title: 'Turning of the Tide', description: 'Allied victories at Midway (Pacific) and the start of the Battle of Stalingrad (Eastern Front) begin to shift momentum away from the Axis.' },
    { year: '1944', title: 'D-Day Landings', description: 'On 6 June, Allied forces land at Normandy, opening a Western Front and beginning the liberation of German-occupied Western Europe.' },
    { year: '1945', title: 'End of the War', description: 'Germany surrenders in May (V-E Day); after atomic bombings of Hiroshima and Nagasaki, Japan surrenders in August (V-J Day), ending the war.' },
];

export default function WW2TimelineSim() {
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (playing) {
            intervalRef.current = setInterval(() => {
                setIndex(i => {
                    if (i >= EVENTS.length - 1) {
                        setPlaying(false);
                        return i;
                    }
                    return i + 1;
                });
            }, 2200);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [playing]);

    const goto = (i: number) => {
        setPlaying(false);
        setIndex(Math.max(0, Math.min(EVENTS.length - 1, i)));
    };

    const handleReset = () => { setPlaying(false); setIndex(0); };
    const current = EVENTS[index];

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
            padding: '28px 24px',
        }}>
            {/* Node rail */}
            <div style={{ position: 'relative', marginBottom: 28, paddingTop: 10 }}>
                <div style={{
                    position: 'absolute', top: 24, left: '4%', right: '4%', height: 2,
                    background: 'var(--border-medium)',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {EVENTS.map((ev, i) => (
                        <button key={ev.year} onClick={() => goto(i)} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                            background: 'none', border: 'none', cursor: 'pointer', flex: 1,
                        }}>
                            <div style={{
                                width: i === index ? 20 : 14, height: i === index ? 20 : 14, borderRadius: '50%',
                                background: i <= index ? 'var(--terra-600)' : 'var(--cream-300)',
                                border: '2px solid var(--cream-50)',
                                boxShadow: i === index ? '0 0 0 3px var(--terra-100)' : 'none',
                                transition: 'all 0.2s',
                            }} />
                            <span style={{
                                fontSize: 11, fontWeight: i === index ? 700 : 500,
                                color: i === index ? 'var(--stone-800)' : 'var(--stone-400)',
                            }}>{ev.year}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail card */}
            <div style={{
                background: 'var(--cream-200)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', minHeight: 100,
            }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--terra-600)', letterSpacing: 0.5, marginBottom: 4 }}>
                    {current.year}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--stone-800)', marginBottom: 8, fontFamily: '"Playfair Display", serif' }}>
                    {current.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--stone-600)', lineHeight: 1.6 }}>
                    {current.description}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginTop: 18, alignItems: 'center' }}>
                <button onClick={() => goto(index - 1)} disabled={index === 0} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'var(--cream-200)', color: 'var(--stone-700)',
                    border: '1px solid var(--border-medium)', cursor: index === 0 ? 'default' : 'pointer',
                    opacity: index === 0 ? 0.5 : 1,
                }}>‹ Previous</button>
                <button onClick={() => goto(index + 1)} disabled={index === EVENTS.length - 1} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'var(--cream-200)', color: 'var(--stone-700)',
                    border: '1px solid var(--border-medium)', cursor: index === EVENTS.length - 1 ? 'default' : 'pointer',
                    opacity: index === EVENTS.length - 1 ? 0.5 : 1,
                }}>Next ›</button>
                <button onClick={() => setPlaying(p => !p)} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: playing ? 'var(--terra-100)' : 'var(--sage-100)',
                    color: playing ? 'var(--terra-600)' : 'var(--sage-600)',
                    border: `1px solid ${playing ? 'rgba(139,74,53,0.25)' : 'rgba(78,107,87,0.25)'}`,
                    cursor: 'pointer',
                }}>{playing ? '⏸ Pause' : '▶ Play'}</button>
                <button onClick={handleReset} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'var(--cream-200)', color: 'var(--stone-700)',
                    border: '1px solid var(--border-medium)', cursor: 'pointer', marginLeft: 'auto',
                }}>↺ Reset</button>
            </div>
        </div>
    );
}
