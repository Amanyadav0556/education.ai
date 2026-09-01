'use client';
// ════════════════════════════════════════════════════════════════════════════
// PROJECTILE MOTION SIMULATOR
// Physics: x(t) = v0·cosθ·t, y(t) = v0·sinθ·t − ½gt²
// Range = v0²sin(2θ)/g, MaxHeight = v0²sin²θ/(2g), TimeOfFlight = 2v0·sinθ/g
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

const CANVAS_W = 700;
const CANVAS_H = 380;
const GROUND_Y = 330;
const LAUNCH_X = 50;
const GRAVITY = 9.8;

export default function ProjectileSim() {
    const [v0, setV0] = useState(25);      // m/s
    const [angleDeg, setAngleDeg] = useState(45);
    const [running, setRunning] = useState(true);
    const [showTrail, setShowTrail] = useState(true);

    const timeRef = useRef(0);
    const lastTsRef = useRef(0);
    const trailRef = useRef<{ x: number; y: number }[]>([]);
    const rafRef = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const readoutRef = useRef<HTMLSpanElement>(null);

    const v0Ref = useRef(v0);
    const angleRef = useRef(angleDeg);
    const runningRef = useRef(running);
    const showTrailRef = useRef(showTrail);
    v0Ref.current = v0;
    angleRef.current = angleDeg;
    runningRef.current = running;
    showTrailRef.current = showTrail;

    const theta = (angleDeg * Math.PI) / 180;
    const range = (v0 * v0 * Math.sin(2 * theta)) / GRAVITY;
    const maxHeight = (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * GRAVITY);
    const timeOfFlight = (2 * v0 * Math.sin(theta)) / GRAVITY;

    // Reset trail + time when launch parameters change
    useEffect(() => {
        trailRef.current = [];
        timeRef.current = 0;
    }, [v0, angleDeg]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const render = (ts: number) => {
            const dt = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 1000, 0.033) : 0.016;
            lastTsRef.current = ts;

            const th = (angleRef.current * Math.PI) / 180;
            const v = v0Ref.current;
            const tof = (2 * v * Math.sin(th)) / GRAVITY;
            const rng = (v * v * Math.sin(2 * th)) / GRAVITY;
            const mh = (v * v * Math.sin(th) * Math.sin(th)) / (2 * GRAVITY);

            if (runningRef.current) {
                timeRef.current += dt;
                if (timeRef.current > tof) { timeRef.current = 0; trailRef.current = []; }
            }
            const t = timeRef.current;

            const scaleX = (CANVAS_W - LAUNCH_X - 40) / Math.max(rng, 1);
            const scaleY = (GROUND_Y - 40) / Math.max(mh, 1);
            const scale = Math.min(scaleX, scaleY, 45);

            const xm = v * Math.cos(th) * t;
            const ym = v * Math.sin(th) * t - 0.5 * GRAVITY * t * t;
            const px = LAUNCH_X + xm * scale;
            const py = GROUND_Y - Math.max(0, ym) * scale;

            if (showTrailRef.current && runningRef.current) {
                trailRef.current.push({ x: px, y: py });
                if (trailRef.current.length > 400) trailRef.current.shift();
            }

            // ── Draw ──────────────────────────────────────────────────────────
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
            const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
            sky.addColorStop(0, '#e8f0ea');
            sky.addColorStop(1, '#f7f2e8');
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

            // Ground
            ctx.fillStyle = '#8C7466';
            ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
            ctx.strokeStyle = '#524035';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y);
            ctx.lineTo(CANVAS_W, GROUND_Y);
            ctx.stroke();

            // Predicted dashed trajectory (recomputed live from current v0/angle)
            ctx.strokeStyle = 'rgba(45,106,143,0.4)';
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let i = 0; i <= 60; i++) {
                const tt = (tof * i) / 60;
                const xx = LAUNCH_X + v * Math.cos(th) * tt * scale;
                const yy = GROUND_Y - Math.max(0, v * Math.sin(th) * tt - 0.5 * GRAVITY * tt * tt) * scale;
                if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Real trail (actual traversed path)
            if (showTrailRef.current && trailRef.current.length > 1) {
                ctx.strokeStyle = '#8B4A35';
                ctx.lineWidth = 2;
                ctx.beginPath();
                trailRef.current.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
                ctx.stroke();
            }

            // Launch angle indicator
            ctx.strokeStyle = 'rgba(139,74,53,0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(LAUNCH_X, GROUND_Y);
            ctx.lineTo(LAUNCH_X + 40, GROUND_Y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(LAUNCH_X, GROUND_Y, 30, -th, 0);
            ctx.stroke();

            // Projectile marker
            ctx.fillStyle = '#B87333';
            ctx.beginPath();
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#2C2318';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Launch point
            ctx.fillStyle = '#2C2318';
            ctx.beginPath();
            ctx.arc(LAUNCH_X, GROUND_Y, 4, 0, Math.PI * 2);
            ctx.fill();

            if (readoutRef.current) {
                const vx = v * Math.cos(th);
                const vy = v * Math.sin(th) - GRAVITY * t;
                readoutRef.current.textContent =
                    `x = ${xm.toFixed(1)}m  y = ${Math.max(0, ym).toFixed(1)}m  t = ${t.toFixed(2)}s  vx = ${vx.toFixed(1)}m/s  vy = ${vy.toFixed(1)}m/s`;
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const handleReset = () => {
        setV0(25);
        setAngleDeg(45);
        setRunning(true);
        setShowTrail(true);
        timeRef.current = 0;
        trailRef.current = [];
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
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Launch Speed (v₀)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{v0} m/s</span>
                        </div>
                        <input type="range" min={5} max={50} step={1} value={v0}
                            onChange={e => setV0(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Launch Angle (θ)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{angleDeg}°</span>
                        </div>
                        <input type="range" min={5} max={85} step={1} value={angleDeg}
                            onChange={e => setAngleDeg(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--stone-600)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={showTrail} onChange={e => setShowTrail(e.target.checked)} style={{ accentColor: 'var(--stone-800)' }} />
                        Show trail
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

                <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace', marginBottom: 12 }}>
                    <span ref={readoutRef}>x = 0.0m  y = 0.0m  t = 0.00s  vx = 0.0m/s  vy = 0.0m/s</span>
                </div>

                <div style={{
                    padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8,
                    display: 'flex', gap: 24, flexWrap: 'wrap',
                }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        Range = <strong style={{ fontFamily: 'monospace' }}>{range.toFixed(1)} m</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        Max Height = <strong style={{ fontFamily: 'monospace' }}>{maxHeight.toFixed(1)} m</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        Time of Flight = <strong style={{ fontFamily: 'monospace' }}>{timeOfFlight.toFixed(2)} s</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
