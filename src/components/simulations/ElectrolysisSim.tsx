'use client';
// ════════════════════════════════════════════════════════════════════════════
// ELECTROLYSIS OF WATER SIMULATOR
// 2H2O → 2H2 (cathode) + O2 (anode) — Faraday's law: n = It / (z·F)
// Gas volumes shown are time-accelerated for visualization (electrolysis at
// household currents produces gas far too slowly to animate in real time).
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

const CANVAS_W = 700;
const CANVAS_H = 380;
const FARADAY = 96485; // C/mol
const MOLAR_VOLUME_ML = 24000; // mL/mol at room temperature & pressure
const TIME_ACCEL = 250; // simulated seconds per real second

const TANK = { x: 120, y: 90, w: 460, h: 230 };
const CATHODE_X = TANK.x + TANK.w * 0.33; // H2, twice the bubble rate
const ANODE_X = TANK.x + TANK.w * 0.67;   // O2

interface Bubble { x: number; y: number; r: number; speed: number; wobble: number; }

export default function ElectrolysisSim() {
    const [voltage, setVoltage] = useState(12);
    const [current, setCurrent] = useState(2);
    const [running, setRunning] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const lastTsRef = useRef(0);
    const elapsedRef = useRef(0); // accelerated seconds
    const currentRef = useRef(current);
    const runningRef = useRef(running);
    currentRef.current = current;
    runningRef.current = running;

    const cathodeBubbles = useRef<Bubble[]>([]);
    const anodeBubbles = useRef<Bubble[]>([]);
    const spawnAccRef = useRef({ h2: 0, o2: 0 });

    const [readout, setReadout] = useState({ time: 0, h2: 0, o2: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = (ts: number) => {
            const dtReal = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 1000, 0.05) : 0.016;
            lastTsRef.current = ts;
            const I = currentRef.current;

            if (runningRef.current) {
                elapsedRef.current += dtReal * TIME_ACCEL;
                const dtSim = dtReal * TIME_ACCEL;

                // Faraday's law: electrons per second = I/F ; H2 needs 2e-, O2 needs 4e-
                spawnAccRef.current.h2 += (I / FARADAY / 2) * dtSim * 40; // scaled for visible bubble rate
                spawnAccRef.current.o2 += (I / FARADAY / 4) * dtSim * 40;

                while (spawnAccRef.current.h2 >= 1) {
                    spawnAccRef.current.h2 -= 1;
                    cathodeBubbles.current.push({
                        x: CATHODE_X + (Math.random() - 0.5) * 14, y: TANK.y + TANK.h - 10,
                        r: 2 + Math.random() * 2.5, speed: 30 + Math.random() * 20, wobble: Math.random() * Math.PI * 2,
                    });
                }
                while (spawnAccRef.current.o2 >= 1) {
                    spawnAccRef.current.o2 -= 1;
                    anodeBubbles.current.push({
                        x: ANODE_X + (Math.random() - 0.5) * 14, y: TANK.y + TANK.h - 10,
                        r: 2 + Math.random() * 2.5, speed: 30 + Math.random() * 20, wobble: Math.random() * Math.PI * 2,
                    });
                }
            }

            // advance + cull bubbles
            for (const list of [cathodeBubbles.current, anodeBubbles.current]) {
                for (const b of list) {
                    b.y -= b.speed * dtReal;
                    b.wobble += dtReal * 3;
                }
            }
            cathodeBubbles.current = cathodeBubbles.current.filter(b => b.y > TANK.y + 20);
            anodeBubbles.current = anodeBubbles.current.filter(b => b.y > TANK.y + 20);

            // Faraday-law totals for readout
            const molesElectrons = (I * elapsedRef.current) / FARADAY;
            const h2Ml = (molesElectrons / 2) * MOLAR_VOLUME_ML;
            const o2Ml = (molesElectrons / 4) * MOLAR_VOLUME_ML;
            setReadout({ time: elapsedRef.current, h2: h2Ml, o2: o2Ml });

            // ── draw ──
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
            ctx.fillStyle = '#FDFAF5';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            // water tank
            ctx.fillStyle = 'rgba(96,123,105,0.18)';
            ctx.strokeStyle = '#524035';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(TANK.x, TANK.y, TANK.w, TANK.h, 8);
            ctx.fill();
            ctx.stroke();

            // collection tubes (inverted, above electrodes)
            const drawTube = (cx: number, fillFrac: number, color: string) => {
                const tw = 34, th = 90, ty = TANK.y - th + 20;
                ctx.strokeStyle = '#3D3025';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(cx - tw / 2, ty, tw, th);
                const fillH = Math.min(th - 6, (th - 6) * fillFrac);
                ctx.fillStyle = color;
                ctx.fillRect(cx - tw / 2 + 3, ty + (th - 6 - fillH) + 3, tw - 6, fillH);
            };
            drawTube(CATHODE_X, Math.min(1, h2Ml / 8), 'rgba(129,140,248,0.5)');
            drawTube(ANODE_X, Math.min(1, o2Ml / 8), 'rgba(217,119,87,0.45)');

            // electrodes
            ctx.strokeStyle = '#2C2318';
            ctx.lineWidth = 4;
            [CATHODE_X, ANODE_X].forEach(x => {
                ctx.beginPath();
                ctx.moveTo(x, TANK.y + 20);
                ctx.lineTo(x, TANK.y + TANK.h - 10);
                ctx.stroke();
            });

            // bubbles
            const drawBubbles = (list: Bubble[], color: string) => {
                ctx.fillStyle = color;
                for (const b of list) {
                    const x = b.x + Math.sin(b.wobble) * 3;
                    ctx.beginPath();
                    ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            };
            drawBubbles(cathodeBubbles.current, 'rgba(129,140,248,0.85)');
            drawBubbles(anodeBubbles.current, 'rgba(217,119,87,0.85)');

            // labels
            ctx.fillStyle = '#2C2318';
            ctx.font = '600 13px "DM Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('H₂ (Cathode −)', CATHODE_X, TANK.y + TANK.h + 22);
            ctx.fillText('O₂ (Anode +)', ANODE_X, TANK.y + TANK.h + 22);

            // battery symbol + wires
            ctx.strokeStyle = '#524035';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(CATHODE_X, TANK.y - 70); ctx.lineTo(CATHODE_X, TANK.y - 22);
            ctx.moveTo(ANODE_X, TANK.y - 70); ctx.lineTo(ANODE_X, TANK.y - 22);
            ctx.moveTo(CATHODE_X, TANK.y - 70); ctx.lineTo(ANODE_X, TANK.y - 70);
            ctx.stroke();
            const midX = (CATHODE_X + ANODE_X) / 2;
            ctx.fillStyle = '#FDFAF5';
            ctx.fillRect(midX - 16, TANK.y - 82, 32, 24);
            ctx.strokeRect(midX - 16, TANK.y - 82, 32, 24);
            ctx.fillStyle = '#2C2318';
            ctx.font = '700 11px monospace';
            ctx.fillText(`${voltage}V`, midX, TANK.y - 66);

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voltage]);

    const handleReset = () => {
        setVoltage(12);
        setCurrent(2);
        setRunning(true);
        elapsedRef.current = 0;
        spawnAccRef.current = { h2: 0, o2: 0 };
        cathodeBubbles.current = [];
        anodeBubbles.current = [];
        setReadout({ time: 0, h2: 0, o2: 0 });
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
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Voltage (V)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{voltage} V</span>
                        </div>
                        <input type="range" min={2} max={24} step={1} value={voltage}
                            onChange={e => setVoltage(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Current (I)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{current.toFixed(1)} A</span>
                        </div>
                        <input type="range" min={0.5} max={5} step={0.1} value={current}
                            onChange={e => setCurrent(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <button onClick={() => setRunning(r => !r)} style={{
                        padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: running ? 'var(--terra-100)' : 'var(--sage-100)',
                        color: running ? 'var(--terra-600)' : 'var(--sage-600)',
                        border: `1px solid ${running ? 'rgba(139,74,53,0.25)' : 'rgba(78,107,87,0.25)'}`,
                        cursor: 'pointer',
                    }}>{running ? '⏸ Pause' : '▶ Start'}</button>
                    <button onClick={handleReset} style={{
                        padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'var(--cream-200)', color: 'var(--stone-700)',
                        border: '1px solid var(--border-medium)', cursor: 'pointer',
                    }}>↺ Reset</button>
                </div>

                <div style={{
                    padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8,
                    display: 'flex', gap: 24, flexWrap: 'wrap',
                }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        n = It/zF · H₂ = <strong>{readout.h2.toFixed(2)} mL</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        O₂ = <strong>{readout.o2.toFixed(2)} mL</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        H₂:O₂ ratio ≈ <strong>2:1</strong>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--stone-400)' }}>
                        (time accelerated ×{TIME_ACCEL} for visualization)
                    </div>
                </div>
            </div>
        </div>
    );
}
