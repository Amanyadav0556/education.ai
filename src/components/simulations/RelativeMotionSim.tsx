'use client';
// ════════════════════════════════════════════════════════════════════════════
// RELATIVE MOTION SIMULATOR
// Two objects moving on a track — adjust velocities, switch reference frame
// Physics: v_rel = v_B - v_A
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

type Frame = 'ground' | 'A' | 'B';

const TRACK_W = 700;
const TRACK_H = 160;
const GROUND_Y = 110;
const OBJ_SIZE = 36;

// Physics engine: positions update based on velocities each frame
interface ObjState { pos: number; color: string; label: string; emoji: string }

export default function RelativeMotionSim() {
    const [velA, setVelA] = useState(3);   // m/s
    const [velB, setVelB] = useState(-2);  // m/s
    const [frame, setFrame] = useState<Frame>('ground');
    const [running, setRunning] = useState(true);
    const [trailA, setTrailA] = useState<number[]>([]);
    const [trailB, setTrailB] = useState<number[]>([]);

    const posARef = useRef(150);
    const posBRef = useRef(500);
    const lastTimeRef = useRef<number>(0);
    const rafRef = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const velARef = useRef(velA);
    const velBRef = useRef(velB);
    const frameRef = useRef(frame);
    const runningRef = useRef(running);

    velARef.current = velA;
    velBRef.current = velB;
    frameRef.current = frame;
    runningRef.current = running;

    const relVelocity = velB - velA;
    const relVelFromA = velB - velA;  // B relative to A
    const relVelFromB = velA - velB;  // A relative to B

    // Physics + render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const SCALE = 40; // pixels per m/s per second
        const BOUNDS = TRACK_W - OBJ_SIZE;

        let localPosA = posARef.current;
        let localPosB = posBRef.current;

        const render = (ts: number) => {
            const dt = lastTimeRef.current ? Math.min((ts - lastTimeRef.current) / 1000, 0.05) : 0.016;
            lastTimeRef.current = ts;

            if (runningRef.current) {
                // Ground frame positions
                localPosA += velARef.current * SCALE * dt;
                localPosB += velBRef.current * SCALE * dt;

                // Wrap around track edges
                if (localPosA > BOUNDS + OBJ_SIZE) localPosA = -OBJ_SIZE;
                if (localPosA < -OBJ_SIZE) localPosA = BOUNDS + OBJ_SIZE;
                if (localPosB > BOUNDS + OBJ_SIZE) localPosB = -OBJ_SIZE;
                if (localPosB < -OBJ_SIZE) localPosB = BOUNDS + OBJ_SIZE;
                posARef.current = localPosA;
                posBRef.current = localPosB;
            }

            // Compute display positions based on reference frame
            let dispA = localPosA;
            let dispB = localPosB;
            let bgOffset = 0;

            if (frameRef.current === 'A') {
                // Shift everything so A is stationary at center
                const offset = TRACK_W / 2 - localPosA;
                dispA = localPosA + offset;
                dispB = localPosB + offset;
                bgOffset = -localPosA; // background moves opposite
            } else if (frameRef.current === 'B') {
                const offset = TRACK_W / 2 - localPosB;
                dispA = localPosA + offset;
                dispB = localPosB + offset;
                bgOffset = -localPosB;
            }

            // ── Draw ────────────────────────────────────────────────────────────────
            ctx.clearRect(0, 0, TRACK_W, TRACK_H);

            // Sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y - 10);
            skyGrad.addColorStop(0, '#c8dce8');
            skyGrad.addColorStop(1, '#e8f4f0');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, TRACK_W, GROUND_Y - 10);

            // Ground / road
            ctx.fillStyle = '#7a6550';
            ctx.fillRect(0, GROUND_Y - 10, TRACK_W, TRACK_H - GROUND_Y + 10);
            // Road surface
            ctx.fillStyle = '#5a4a38';
            ctx.fillRect(0, GROUND_Y - 4, TRACK_W, 6);
            // Road markings (reference frame scrolling)
            ctx.strokeStyle = '#c8a876';
            ctx.setLineDash([30, 20]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y - 1);
            ctx.lineTo(TRACK_W, GROUND_Y - 1);
            ctx.stroke();
            ctx.setLineDash([]);

            // Scrolling grid lines (show relative motion of background)
            const gridOff = ((bgOffset * 0.3) % 80 + 80) % 80;
            ctx.strokeStyle = 'rgba(200,168,118,0.2)';
            ctx.lineWidth = 1;
            for (let gx = gridOff - 80; gx < TRACK_W + 80; gx += 80) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, GROUND_Y - 10);
                ctx.stroke();
            }

            // ── Draw Person A ────────────────────────────────────────────────────
            drawPerson(ctx, dispA, GROUND_Y - OBJ_SIZE, '#2D6A8F', 'A', velARef.current);
            // ── Draw Person B ────────────────────────────────────────────────────
            drawPerson(ctx, dispB, GROUND_Y - OBJ_SIZE, '#8B4A35', 'B', velBRef.current);

            // ── Relative velocity arrow ──────────────────────────────────────────
            if (Math.abs(relVelFromA) > 0.1 && frameRef.current !== 'ground') {
                const stationary = frameRef.current === 'A' ? dispA : dispB;
                const moving = frameRef.current === 'A' ? dispB : dispA;
                const relV = frameRef.current === 'A' ? relVelFromA : relVelFromB;

                ctx.strokeStyle = '#6bde8c';
                ctx.lineWidth = 2;
                ctx.fillStyle = '#6bde8c';
                ctx.font = '11px DM Sans, sans-serif';
                ctx.fillText(`v_rel = ${relV.toFixed(1)} m/s`, TRACK_W / 2 - 50, 18);
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReset = () => {
        posARef.current = 150;
        posBRef.current = 500;
        setVelA(3);
        setVelB(-2);
        setFrame('ground');
    };

    return (
        <div style={{
            background: 'var(--cream-50)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            fontFamily: 'DM Sans, sans-serif',
        }}>
            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={TRACK_W}
                height={TRACK_H}
                style={{ width: '100%', display: 'block', cursor: 'crosshair' }}
            />

            {/* Controls */}
            <div style={{ padding: '20px 24px', borderTop: '2px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 20 }}>

                    {/* Person A controls */}
                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                            padding: '6px 12px', background: 'rgba(45,106,143,0.1)',
                            borderRadius: 8, border: '1px solid rgba(45,106,143,0.25)',
                        }}>
                            <span style={{ fontSize: 18 }}>🧑</span>
                            <span style={{ fontWeight: 700, color: '#2D6A8F', fontSize: 14 }}>Person A</span>
                            <span style={{
                                marginLeft: 'auto', fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                                color: velA > 0 ? '#2D6A8F' : velA < 0 ? '#8B4A35' : 'var(--text-muted)',
                            }}>{velA > 0 ? '→' : velA < 0 ? '←' : '⏸'} {Math.abs(velA).toFixed(1)} m/s</span>
                        </div>
                        <input type="range" min={-10} max={10} step={0.5} value={velA}
                            onChange={e => setVelA(Number(e.target.value))} style={{ width: '100%', accentColor: '#2D6A8F' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                            <span>←10</span><span style={{ color: 'var(--stone-600)', fontWeight: 600 }}>0</span><span>10→</span>
                        </div>
                    </div>

                    {/* Relative Velocity display */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Relative Velocity
                        </div>
                        <div style={{
                            padding: '10px 18px',
                            background: Math.abs(relVelocity) < 0.5 ? 'var(--sage-100)' : 'var(--stone-800)',
                            borderRadius: 10, textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: 'var(--cream-50)' }}>
                                {relVelocity > 0 ? '+' : ''}{relVelocity.toFixed(1)} m/s
                            </div>
                            <div style={{ fontSize: 9, color: 'rgba(247,242,232,0.5)', marginTop: 2 }}>B relative to A</div>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            v<sub>B</sub> − v<sub>A</sub> = {velB.toFixed(1)} − ({velA.toFixed(1)}) = {relVelocity.toFixed(1)}
                        </div>
                    </div>

                    {/* Person B controls */}
                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                            padding: '6px 12px', background: 'rgba(139,74,53,0.1)',
                            borderRadius: 8, border: '1px solid rgba(139,74,53,0.25)',
                        }}>
                            <span style={{ fontSize: 18 }}>🏃</span>
                            <span style={{ fontWeight: 700, color: '#8B4A35', fontSize: 14 }}>Person B</span>
                            <span style={{
                                marginLeft: 'auto', fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
                                color: velB > 0 ? '#2D6A8F' : velB < 0 ? '#8B4A35' : 'var(--text-muted)',
                            }}>{velB > 0 ? '→' : velB < 0 ? '←' : '⏸'} {Math.abs(velB).toFixed(1)} m/s</span>
                        </div>
                        <input type="range" min={-10} max={10} step={0.5} value={velB}
                            onChange={e => setVelB(Number(e.target.value))} style={{ width: '100%', accentColor: '#8B4A35' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                            <span>←10</span><span style={{ color: 'var(--stone-600)', fontWeight: 600 }}>0</span><span>10→</span>
                        </div>
                    </div>
                </div>

                {/* Reference Frame + Actions */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Reference Frame:</div>
                    {([['ground', 'Ground 🌍'], ['A', 'Person A 🧑'], ['B', 'Person B 🏃']] as const).map(([f, label]) => (
                        <button key={f} onClick={() => setFrame(f)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                            background: frame === f ? 'var(--stone-800)' : 'transparent',
                            color: frame === f ? 'var(--cream-50)' : 'var(--stone-600)',
                            border: `1px solid ${frame === f ? 'var(--stone-800)' : 'var(--border-medium)'}`,
                            cursor: 'pointer', fontSize: 12, fontWeight: frame === f ? 600 : 400,
                            transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}

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

                {/* Physics equations */}
                <div style={{
                    marginTop: 16,
                    padding: '12px 16px',
                    background: 'var(--cream-200)',
                    borderRadius: 8,
                    display: 'flex', gap: 24, flexWrap: 'wrap',
                }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        v<sub>B/A</sub> = v<sub>B</sub> − v<sub>A</sub> = <strong>{relVelFromA.toFixed(1)}</strong> m/s
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        v<sub>A/B</sub> = v<sub>A</sub> − v<sub>B</sub> = <strong>{relVelFromB.toFixed(1)}</strong> m/s
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        {Math.abs(relVelocity) < 0.1 ? '🟢 Both moving at same velocity (stationary relative to each other)' :
                            relVelocity > 0 ? '→ B moving away from A (positive relative velocity)' :
                                '← B moving toward A (negative relative velocity)'}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Person drawing helper ──────────────────────────────────────────────────────

function drawPerson(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string, vel: number) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x + OBJ_SIZE / 2, y + OBJ_SIZE + 4, OBJ_SIZE / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(x + OBJ_SIZE * 0.3, y + OBJ_SIZE * 0.35, OBJ_SIZE * 0.4, OBJ_SIZE * 0.5);

    // Head
    ctx.beginPath();
    ctx.arc(x + OBJ_SIZE / 2, y + OBJ_SIZE * 0.22, OBJ_SIZE * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#d4a276';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Velocity arrow
    if (Math.abs(vel) > 0.2) {
        const arrowLen = Math.min(Math.abs(vel) * 6, 50);
        const dir = vel > 0 ? 1 : -1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + OBJ_SIZE / 2, y + OBJ_SIZE * 0.5);
        ctx.lineTo(x + OBJ_SIZE / 2 + dir * arrowLen, y + OBJ_SIZE * 0.5);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x + OBJ_SIZE / 2 + dir * arrowLen, y + OBJ_SIZE * 0.5);
        ctx.lineTo(x + OBJ_SIZE / 2 + dir * (arrowLen - 8), y + OBJ_SIZE * 0.5 - 5);
        ctx.lineTo(x + OBJ_SIZE / 2 + dir * (arrowLen - 8), y + OBJ_SIZE * 0.5 + 5);
        ctx.closePath();
        ctx.fill();
    }

    // Label chip
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + 2, y - 22, 34, 18, 5);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 19, y - 9);

    // Speed label
    ctx.font = '10px DM Sans, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(`${vel > 0 ? '+' : ''}${vel.toFixed(1)}`, x + OBJ_SIZE / 2, y + OBJ_SIZE + 16);
}
