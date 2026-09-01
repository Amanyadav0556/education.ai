'use client';
// ════════════════════════════════════════════════════════════════════════════
// PENDULUM / SIMPLE HARMONIC MOTION SIMULATOR
// Physics: T = 2π√(L/g), θ(t) = θ0·cos(ωt)·e^(-kt), ω = √(g/L)
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

const CANVAS_W = 700;
const CANVAS_H = 380;
const PIVOT_X = CANVAS_W / 2;
const PIVOT_Y = 40;
const PX_PER_M = 130;

const GRAVITY_PRESETS: { label: string; value: number }[] = [
    { label: 'Earth', value: 9.8 },
    { label: 'Moon', value: 1.62 },
    { label: 'Mars', value: 3.71 },
];

export default function PendulumSim() {
    const [length, setLength] = useState(1.0);      // m
    const [amplitude, setAmplitude] = useState(20);  // degrees
    const [gravity, setGravity] = useState(9.8);     // m/s^2
    const [damping, setDamping] = useState(false);
    const [running, setRunning] = useState(true);

    const timeRef = useRef(0);
    const lastTsRef = useRef(0);
    const rafRef = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleReadoutRef = useRef<HTMLSpanElement>(null);
    const timeReadoutRef = useRef<HTMLSpanElement>(null);

    const lengthRef = useRef(length);
    const amplitudeRef = useRef(amplitude);
    const gravityRef = useRef(gravity);
    const dampingRef = useRef(damping);
    const runningRef = useRef(running);
    lengthRef.current = length;
    amplitudeRef.current = amplitude;
    gravityRef.current = gravity;
    dampingRef.current = damping;
    runningRef.current = running;

    const omega = Math.sqrt(gravity / length);
    const period = (2 * Math.PI) / omega;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = (ts: number) => {
            const dt = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 1000, 0.05) : 0.016;
            lastTsRef.current = ts;
            if (runningRef.current) timeRef.current += dt;

            const t = timeRef.current;
            const w = Math.sqrt(gravityRef.current / lengthRef.current);
            const theta0 = (amplitudeRef.current * Math.PI) / 180;
            const decay = dampingRef.current ? Math.exp(-0.12 * t) : 1;
            const theta = theta0 * Math.cos(w * t) * decay;

            if (angleReadoutRef.current) angleReadoutRef.current.textContent = `${((theta * 180) / Math.PI).toFixed(1)}°`;
            if (timeReadoutRef.current) timeReadoutRef.current.textContent = `${t.toFixed(1)}`;

            const stringLenPx = lengthRef.current * PX_PER_M;
            const bobX = PIVOT_X + stringLenPx * Math.sin(theta);
            const bobY = PIVOT_Y + stringLenPx * Math.cos(theta);

            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

            // Sky
            const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
            sky.addColorStop(0, '#eef2ee');
            sky.addColorStop(1, '#f7f2e8');
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            // Ceiling mount
            ctx.fillStyle = '#524035';
            ctx.fillRect(PIVOT_X - 40, PIVOT_Y - 14, 80, 14);
            for (let hx = PIVOT_X - 34; hx <= PIVOT_X + 34; hx += 12) {
                ctx.beginPath();
                ctx.moveTo(hx, PIVOT_Y - 14);
                ctx.lineTo(hx - 6, PIVOT_Y);
                ctx.strokeStyle = '#8C7466';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Swing-range dashed arc
            const maxLenPx = stringLenPx;
            ctx.strokeStyle = 'rgba(140,116,102,0.35)';
            ctx.setLineDash([4, 5]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(PIVOT_X, PIVOT_Y, maxLenPx, Math.PI / 2 - theta0 - 0.15, Math.PI / 2 + theta0 + 0.15);
            ctx.stroke();
            ctx.setLineDash([]);

            // Vertical reference line
            ctx.strokeStyle = 'rgba(140,116,102,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(PIVOT_X, PIVOT_Y);
            ctx.lineTo(PIVOT_X, PIVOT_Y + maxLenPx + 20);
            ctx.stroke();

            // String
            ctx.strokeStyle = '#2C2318';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(PIVOT_X, PIVOT_Y);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // Pivot
            ctx.fillStyle = '#2C2318';
            ctx.beginPath();
            ctx.arc(PIVOT_X, PIVOT_Y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Bob
            const bobGrad = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 18);
            bobGrad.addColorStop(0, '#B87333');
            bobGrad.addColorStop(1, '#8B4A35');
            ctx.fillStyle = bobGrad;
            ctx.beginPath();
            ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#2C2318';
            ctx.lineWidth = 1;
            ctx.stroke();

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const handleReset = () => {
        setLength(1.0);
        setAmplitude(20);
        setGravity(9.8);
        setDamping(false);
        setRunning(true);
        timeRef.current = 0;
    };

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
        }}>
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} style={{ width: '100%', display: 'block' }} />

            <div style={{ padding: '20px 24px', borderTop: '2px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Length (L)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{length.toFixed(2)} m</span>
                        </div>
                        <input type="range" min={0.2} max={2.5} step={0.05} value={length}
                            onChange={e => setLength(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Amplitude (θ₀)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{amplitude}°</span>
                        </div>
                        <input type="range" min={5} max={60} step={1} value={amplitude}
                            onChange={e => setAmplitude(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Gravity:</span>
                        {GRAVITY_PRESETS.map(g => (
                            <button key={g.label} onClick={() => setGravity(g.value)} style={{
                                padding: '5px 12px', borderRadius: 'var(--radius-pill)', fontSize: 12,
                                background: gravity === g.value ? 'var(--stone-800)' : 'transparent',
                                color: gravity === g.value ? 'var(--cream-50)' : 'var(--stone-600)',
                                border: `1px solid ${gravity === g.value ? 'var(--stone-800)' : 'var(--border-medium)'}`,
                                cursor: 'pointer', fontWeight: gravity === g.value ? 600 : 400,
                            }}>{g.label} ({g.value})</button>
                        ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--stone-600)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={damping} onChange={e => setDamping(e.target.checked)} style={{ accentColor: 'var(--stone-800)' }} />
                        Damping
                    </label>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button onClick={() => setRunning(r => !r)} style={{
                            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: running ? 'var(--terra-100)' : 'var(--sage-100)',
                            color: running ? 'var(--terra-600)' : 'var(--sage-600)',
                            border: `1px solid ${running ? 'rgba(139,74,53,0.25)' : 'rgba(78,107,87,0.25)'}`,
                            cursor: 'pointer',
                        }}>{running ? '⏸ Pause' : '▶ Resume'}</button>
                        <button onClick={handleReset} style={{
                            padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: 'var(--cream-200)', color: 'var(--stone-700)',
                            border: '1px solid var(--border-medium)', cursor: 'pointer',
                        }}>↺ Reset</button>
                    </div>
                </div>

                <div style={{
                    padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8,
                    display: 'flex', gap: 24, flexWrap: 'wrap',
                }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        T = 2π√(L/g) = <strong>{period.toFixed(2)} s</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        ω = <strong>{omega.toFixed(2)}</strong> rad/s
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        θ(t) = <strong><span ref={angleReadoutRef}>{amplitude.toFixed(1)}°</span></strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        t = <strong><span ref={timeReadoutRef}>0.0</span></strong> s
                    </div>
                </div>
            </div>
        </div>
    );
}
