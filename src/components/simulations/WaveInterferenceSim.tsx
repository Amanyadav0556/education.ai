'use client';
// ════════════════════════════════════════════════════════════════════════════
// WAVE INTERFERENCE SIMULATOR — two coherent point sources (ripple-tank style)
// Physics: constructive Δr = nλ, destructive Δr = (n + ½)λ
// Renders into a small off-screen buffer + upscales, so per-frame cost stays
// low regardless of the on-screen canvas size.
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

const DISPLAY_W = 620;
const DISPLAY_H = 280;
const SCALE = 4; // buffer is DISPLAY / SCALE pixels — recomputing trig per buffer pixel is cheap
const BUF_W = Math.round(DISPLAY_W / SCALE);
const BUF_H = Math.round(DISPLAY_H / SCALE);

const SOURCE_X_DISPLAY = 70;
const OBSERVER_X_DISPLAY = 520;

type ViewMode = 'waves' | 'intensity';

export default function WaveInterferenceSim() {
    const [wavelength, setWavelength] = useState(40); // display px
    const [separation, setSeparation] = useState(120); // display px
    const [running, setRunning] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('waves');
    const [observerY, setObserverY] = useState(0); // offset from centerline, display px

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bufferRef = useRef<HTMLCanvasElement | null>(null);
    const r1GridRef = useRef<Float32Array>(new Float32Array(0));
    const r2GridRef = useRef<Float32Array>(new Float32Array(0));
    const phaseRef = useRef(0);
    const rafRef = useRef<number>(0);
    const observerReadoutRef = useRef<HTMLSpanElement>(null);

    const wavelengthRef = useRef(wavelength);
    const runningRef = useRef(running);
    const viewModeRef = useRef(viewMode);
    const observerYRef = useRef(observerY);
    wavelengthRef.current = wavelength;
    runningRef.current = running;
    viewModeRef.current = viewMode;
    observerYRef.current = observerY;

    // Recompute the static r1/r2 distance grids whenever source separation changes
    useEffect(() => {
        const r1 = new Float32Array(BUF_W * BUF_H);
        const r2 = new Float32Array(BUF_W * BUF_H);
        const sx = SOURCE_X_DISPLAY / SCALE;
        const sy1 = (DISPLAY_H / 2 - separation / 2) / SCALE;
        const sy2 = (DISPLAY_H / 2 + separation / 2) / SCALE;

        for (let y = 0; y < BUF_H; y++) {
            for (let x = 0; x < BUF_W; x++) {
                const i = y * BUF_W + x;
                r1[i] = Math.hypot(x - sx, y - sy1) * SCALE;
                r2[i] = Math.hypot(x - sx, y - sy2) * SCALE;
            }
        }
        r1GridRef.current = r1;
        r2GridRef.current = r2;
    }, [separation]);

    useEffect(() => {
        const buffer = document.createElement('canvas');
        buffer.width = BUF_W;
        buffer.height = BUF_H;
        bufferRef.current = buffer;
        const bufCtx = buffer.getContext('2d');
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!bufCtx || !canvas || !ctx) return;

        ctx.imageSmoothingEnabled = true;

        const render = () => {
            if (runningRef.current) phaseRef.current += 0.12;

            const img = bufCtx.createImageData(BUF_W, BUF_H);
            const r1Grid = r1GridRef.current;
            const r2Grid = r2GridRef.current;
            const k = (2 * Math.PI) / Math.max(wavelengthRef.current, 1);
            const phase = phaseRef.current;
            const mode = viewModeRef.current;

            for (let i = 0; i < BUF_W * BUF_H; i++) {
                let v: number;
                if (mode === 'intensity') {
                    // time-averaged intensity ∝ cos²(k·Δr/2) — static fringe pattern
                    const dr = r2Grid[i] - r1Grid[i];
                    v = Math.pow(Math.cos((k * dr) / 2), 2); // 0..1
                } else {
                    const amp = Math.cos(k * r1Grid[i] - phase) + Math.cos(k * r2Grid[i] - phase);
                    v = (amp + 2) / 4; // -2..2 -> 0..1
                }
                const p = i * 4;
                if (mode === 'intensity') {
                    const c = Math.round(v * 255);
                    img.data[p] = c; img.data[p + 1] = Math.round(v * 220 + 20); img.data[p + 2] = Math.round(v * 180 + 40);
                } else {
                    // diverging blue (trough) -> cream (node) -> terra (crest)
                    if (v > 0.5) {
                        const t = (v - 0.5) * 2;
                        img.data[p] = Math.round(232 + t * (139 - 232));
                        img.data[p + 1] = Math.round(237 + t * (74 - 237));
                        img.data[p + 2] = Math.round(231 + t * (53 - 231));
                    } else {
                        const t = 1 - v * 2;
                        img.data[p] = Math.round(232 + t * (45 - 232));
                        img.data[p + 1] = Math.round(237 + t * (106 - 237));
                        img.data[p + 2] = Math.round(231 + t * (143 - 231));
                    }
                }
                img.data[p + 3] = 255;
            }
            bufCtx.putImageData(img, 0, 0);

            ctx.clearRect(0, 0, DISPLAY_W, DISPLAY_H);
            ctx.drawImage(buffer, 0, 0, BUF_W, BUF_H, 0, 0, DISPLAY_W, DISPLAY_H);

            // Sources
            const sy1 = DISPLAY_H / 2 - separation / 2;
            const sy2 = DISPLAY_H / 2 + separation / 2;
            [sy1, sy2].forEach(sy => {
                ctx.fillStyle = '#2C2318';
                ctx.beginPath();
                ctx.arc(SOURCE_X_DISPLAY, sy, 5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Observer marker + path-difference readout
            const oy = DISPLAY_H / 2 + observerYRef.current;
            const r1o = Math.hypot(OBSERVER_X_DISPLAY - SOURCE_X_DISPLAY, oy - sy1);
            const r2o = Math.hypot(OBSERVER_X_DISPLAY - SOURCE_X_DISPLAY, oy - sy2);
            const dr = r2o - r1o;
            const n = dr / wavelengthRef.current;
            const frac = n - Math.round(n);
            let verdict = 'Intermediate';
            if (Math.abs(frac) < 0.12) verdict = 'Constructive (bright)';
            else if (Math.abs(Math.abs(frac) - 0.5) < 0.12) verdict = 'Destructive (dark)';

            ctx.strokeStyle = '#2C2318';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(OBSERVER_X_DISPLAY - 8, oy);
            ctx.lineTo(OBSERVER_X_DISPLAY + 8, oy);
            ctx.moveTo(OBSERVER_X_DISPLAY, oy - 8);
            ctx.lineTo(OBSERVER_X_DISPLAY, oy + 8);
            ctx.stroke();

            if (observerReadoutRef.current) {
                observerReadoutRef.current.textContent = `Δr = ${dr.toFixed(1)}px ≈ ${n.toFixed(2)}λ — ${verdict}`;
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
    }, [separation]);

    const handleReset = () => {
        setWavelength(40);
        setSeparation(120);
        setObserverY(0);
        setRunning(true);
    };

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
        }}>
            <canvas ref={canvasRef} width={DISPLAY_W} height={DISPLAY_H} style={{ width: '100%', display: 'block', cursor: 'pointer' }}
                onClick={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleY = DISPLAY_H / rect.height;
                    const y = (e.clientY - rect.top) * scaleY;
                    setObserverY(Math.max(-DISPLAY_H / 2 + 10, Math.min(DISPLAY_H / 2 - 10, y - DISPLAY_H / 2)));
                }}
                title="Click to move the observer point" />

            <div style={{ padding: '20px 24px', borderTop: '2px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Wavelength (λ)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{wavelength}px</span>
                        </div>
                        <input type="range" min={20} max={100} step={1} value={wavelength}
                            onChange={e => setWavelength(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>Source Separation (d)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{separation}px</span>
                        </div>
                        <input type="range" min={50} max={300} step={5} value={separation}
                            onChange={e => setSeparation(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>View:</div>
                    {([['waves', 'Wavefronts'], ['intensity', 'Intensity Field']] as const).map(([m, label]) => (
                        <button key={m} onClick={() => setViewMode(m)} style={{
                            padding: '6px 14px', borderRadius: 'var(--radius-pill)',
                            background: viewMode === m ? 'var(--stone-800)' : 'transparent',
                            color: viewMode === m ? 'var(--cream-50)' : 'var(--stone-600)',
                            border: `1px solid ${viewMode === m ? 'var(--stone-800)' : 'var(--border-medium)'}`,
                            cursor: 'pointer', fontSize: 12, fontWeight: viewMode === m ? 600 : 400,
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

                <div style={{ padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', marginBottom: 6 }}>
                        Click the canvas to move the <strong>observer point</strong> (crosshair) up or down.
                    </div>
                    <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--stone-800)', fontWeight: 600 }}>
                        <span ref={observerReadoutRef}>Δr = 0.0px ≈ 0.00λ — Constructive (bright)</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                        Constructive: Δr = nλ &nbsp;·&nbsp; Destructive: Δr = (n + ½)λ
                    </div>
                </div>
            </div>
        </div>
    );
}
