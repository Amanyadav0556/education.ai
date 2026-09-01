'use client';
// ════════════════════════════════════════════════════════════════════════════
// GALVANOMETER SIMULATOR
// Interactive simulation: animated needle, figure of merit, circuit diagram
// Physics: θ = (NBAI) / k  — deflection proportional to current
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from 'react';

const RESISTANCE_OPTIONS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
const MAX_DEFLECTION_DEG = 135; // max needle rotation each side from center

export default function GalvanometerSim() {
    const [current, setCurrent] = useState(0);        // μA, -100 to +100
    const [resistance, setResistance] = useState(100); // Ω
    const [showCircuit, setShowCircuit] = useState(false);
    const [isRunning, setIsRunning] = useState(true);

    const needleAngle = useRef(0);    // current rendered angle (-135 to +135)
    const targetAngle = useRef(0);    // target physics angle
    const rafRef = useRef<number>(0);
    const needleRef = useRef<SVGLineElement>(null);
    const readingRef = useRef<SVGTextElement>(null);

    // Physics: deflection angle linear to current (ideal galvanometer)
    // θ = k_sens × I  where k_sens = MAX_DEFLECTION / I_max
    const k_sens = MAX_DEFLECTION_DEG / 100;
    const deflectionDeg = current * k_sens;
    const voltage_V = (current * 1e-6 * resistance).toFixed(6);
    const figureOfMerit = (current === 0) ? '∞' : (resistance / Math.abs(current)).toFixed(3);

    targetAngle.current = deflectionDeg;

    // Smooth needle animation
    useEffect(() => {
        const DIAL_CX = 200; const DIAL_CY = 210; const NEEDLE_LEN = 130;

        const animate = () => {
            if (!isRunning) { rafRef.current = requestAnimationFrame(animate); return; }

            const diff = targetAngle.current - needleAngle.current;
            // Spring damping: overshoot + settle
            needleAngle.current += diff * 0.1 + (diff > 0.5 ? diff * 0.02 : 0);

            // Clamp
            needleAngle.current = Math.max(-MAX_DEFLECTION_DEG, Math.min(MAX_DEFLECTION_DEG, needleAngle.current));

            const rad = ((needleAngle.current - 90) * Math.PI) / 180;
            const x2 = DIAL_CX + NEEDLE_LEN * Math.cos(rad);
            const y2 = DIAL_CY + NEEDLE_LEN * Math.sin(rad);

            if (needleRef.current) {
                needleRef.current.setAttribute('x2', String(x2.toFixed(2)));
                needleRef.current.setAttribute('y2', String(y2.toFixed(2)));
            }
            if (readingRef.current) {
                readingRef.current.textContent = `${current.toFixed(1)} μA`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [current, isRunning]);

    const handleReset = () => {
        setCurrent(0);
        setResistance(100);
    };

    // Build dial scale marks
    const dialMarks = () => {
        const CX = 200; const CY = 210; const R = 155;
        const marks = [];
        // -100 to +100 scale in steps of 10
        for (let n = -100; n <= 100; n += 10) {
            const t = n / 100; // -1 to +1
            const angleDeg = t * MAX_DEFLECTION_DEG - 90; // offset so 0=pointing up
            const rad = (angleDeg * Math.PI) / 180;
            const isMajor = n % 50 === 0;
            const r1 = R - (isMajor ? 18 : 10);
            const r2 = R;
            const lx1 = CX + r1 * Math.cos(rad); const ly1 = CY + r1 * Math.sin(rad);
            const lx2 = CX + r2 * Math.cos(rad); const ly2 = CY + r2 * Math.sin(rad);
            const tx = CX + (r1 - 14) * Math.cos(rad); const ty = CY + (r1 - 14) * Math.sin(rad);
            marks.push(
                <g key={n}>
                    <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={n === 0 ? '#2C2318' : '#8C7466'} strokeWidth={isMajor ? 2 : 1} />
                    {isMajor && <text x={tx} y={ty + 4} textAnchor="middle" fontSize="11" fill="#2C2318" fontFamily="DM Sans, sans-serif">{n}</text>}
                </g>
            );
        }
        return marks;
    };

    return (
        <div style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border-medium)',
            background: '#2a1f14',
            fontFamily: 'DM Sans, sans-serif',
        }}>
            {/* Lab bench background */}
            <div style={{
                background: 'linear-gradient(180deg, #3d2b1a 0%, #5c3d25 40%, #c8a876 40%, #d4b882 100%)',
                padding: '28px 28px 0',
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: 24,
            }}>
                {/* ── Control Panel ────────────────────────────────────────────── */}
                <div style={{
                    background: 'rgba(20,13,6,0.85)',
                    borderRadius: '12px 12px 0 0',
                    padding: 20,
                    color: '#F7F2E8',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(247,242,232,0.12)',
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8a876', marginBottom: 16 }}>
                        Controls
                    </div>

                    {/* Current Slider */}
                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: '#b89a6a' }}>Current (μA)</label>
                            <span style={{
                                fontFamily: 'monospace', fontSize: 14, fontWeight: 700,
                                color: current > 0 ? '#6bde8c' : current < 0 ? '#ff6b6b' : '#F7F2E8'
                            }}>
                                {current > 0 ? '+' : ''}{current.toFixed(1)}
                            </span>
                        </div>
                        <input
                            type="range" min={-100} max={100} step={0.5}
                            value={current}
                            onChange={e => setCurrent(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#c8a876' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8a6e4a', marginTop: 2 }}>
                            <span>-100 μA</span><span>0</span><span>+100 μA</span>
                        </div>
                    </div>

                    {/* Resistance */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontSize: 12, color: '#b89a6a', display: 'block', marginBottom: 8 }}>Resistance (Ω)</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {[100, 200, 500, 1000, 2000, 5000].map(r => (
                                <button key={r} onClick={() => setResistance(r)} style={{
                                    padding: '4px 8px', fontSize: 11, borderRadius: 6,
                                    background: resistance === r ? '#c8a876' : 'rgba(247,242,232,0.08)',
                                    color: resistance === r ? '#2a1f14' : '#b89a6a',
                                    border: `1px solid ${resistance === r ? '#c8a876' : 'rgba(247,242,232,0.15)'}`,
                                    cursor: 'pointer', fontWeight: resistance === r ? 700 : 400,
                                }}>
                                    {r >= 1000 ? `${r / 1000}k` : r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live readings */}
                    <div style={{
                        background: 'rgba(0,0,0,0.4)',
                        borderRadius: 8,
                        padding: '12px 14px',
                        marginBottom: 14,
                        border: '1px solid rgba(200,168,118,0.2)',
                    }}>
                        <div style={{ fontSize: 10, color: '#8a6e4a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Readings
                        </div>
                        {[
                            ['Deflection', `${deflectionDeg.toFixed(1)}°`],
                            ['Voltage', `${voltage_V} V`],
                            ['Figure of Merit', `${figureOfMerit} Ω/μA`],
                            ['Resistance', `${resistance.toLocaleString()} Ω`],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 11, color: '#b89a6a' }}>{k}</span>
                                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#e8d4a8', fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Show circuit toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <input type="checkbox" id="show-circuit" checked={showCircuit}
                            onChange={e => setShowCircuit(e.target.checked)}
                            style={{ accentColor: '#c8a876', width: 14, height: 14 }} />
                        <label htmlFor="show-circuit" style={{ fontSize: 12, color: '#b89a6a', cursor: 'pointer' }}>
                            Show circuit diagram
                        </label>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={handleReset} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: 'rgba(247,242,232,0.1)', color: '#F7F2E8',
                            border: '1px solid rgba(247,242,232,0.2)', cursor: 'pointer',
                        }}>↺ Reset</button>
                        <button onClick={() => setCurrent(c => Math.min(100, c + 10))} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: '#c8a876', color: '#2a1f14',
                            border: 'none', cursor: 'pointer',
                        }}>+10μA</button>
                    </div>
                </div>

                {/* ── Galvanometer Visual ──────────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 24 }}>
                    {/* Main galvanometer SVG */}
                    <div style={{
                        background: '#1a1209',
                        borderRadius: 16,
                        padding: '16px 20px 10px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                        border: '2px solid #3d2b1a',
                        position: 'relative',
                    }}>
                        {/* Terminals on top */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <div style={{ width: 14, height: 20, background: 'linear-gradient(#ff4444,#cc0000)', borderRadius: 3 }} />
                                <span style={{ fontSize: 9, color: '#ff6b6b' }}>+</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#8a6e4a', alignSelf: 'center', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                GALVANOMETER
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <div style={{ width: 14, height: 20, background: 'linear-gradient(#888,#555)', borderRadius: 3 }} />
                                <span style={{ fontSize: 9, color: '#888' }}>−</span>
                            </div>
                        </div>

                        {/* Meter face */}
                        <div style={{
                            background: 'radial-gradient(circle at 50% 60%, #f9f6ef, #e8e0d0)',
                            borderRadius: '50% 50% 10px 10px',
                            padding: 4,
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                        }}>
                            <svg width="400" height="260" viewBox="0 0 400 260">
                                {/* Meter background */}
                                <ellipse cx="200" cy="210" rx="195" ry="185" fill="#f5f0e8" />

                                {/* Colored scale zones */}
                                {/* Negative zone */}
                                <path d={`M 200 210 L ${200 + 155 * Math.cos((-MAX_DEFLECTION_DEG - 90) * Math.PI / 180)} ${210 + 155 * Math.sin((-MAX_DEFLECTION_DEG - 90) * Math.PI / 180)} A 155 155 0 0 1 ${200 + 155 * Math.cos((-45 - 90) * Math.PI / 180)} ${210 + 155 * Math.sin((-45 - 90) * Math.PI / 180)} Z`}
                                    fill="rgba(239,68,68,0.08)" />
                                {/* Positive zone */}
                                <path d={`M 200 210 L ${200 + 155 * Math.cos((45 - 90) * Math.PI / 180)} ${210 + 155 * Math.sin((45 - 90) * Math.PI / 180)} A 155 155 0 0 1 ${200 + 155 * Math.cos((MAX_DEFLECTION_DEG - 90) * Math.PI / 180)} ${210 + 155 * Math.sin((MAX_DEFLECTION_DEG - 90) * Math.PI / 180)} Z`}
                                    fill="rgba(34,197,94,0.08)" />

                                {/* Scale marks */}
                                {dialMarks()}

                                {/* Scale label */}
                                <text x="200" y="185" textAnchor="middle" fontSize="11" fill="#8C7466" fontFamily="DM Sans, sans-serif">μA</text>

                                {/* Center hub */}
                                <circle cx="200" cy="210" r="8" fill="#c8a876" />
                                <circle cx="200" cy="210" r="4" fill="#2a1f14" />

                                {/* The needle */}
                                <line
                                    ref={needleRef as React.RefObject<SVGLineElement>}
                                    id="galv-needle"
                                    x1="200" y1="210"
                                    x2="200" y2="80"
                                    stroke="#cc2222"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />

                                {/* Live current readout */}
                                <rect x="140" y="216" width="120" height="22" rx="4" fill="#1a1209" />
                                <text
                                    ref={readingRef as React.RefObject<SVGTextElement>}
                                    x="200" y="231"
                                    textAnchor="middle"
                                    fontSize="12"
                                    fill="#00e89b"
                                    fontFamily="monospace"
                                    fontWeight="700"
                                >
                                    {current.toFixed(1)} μA
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Formula display */}
                    <div style={{
                        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        {[
                            { label: 'θ = k × I', desc: 'Deflection formula' },
                            { label: `k = ${k_sens.toFixed(2)} °/μA`, desc: 'Sensitivity' },
                        ].map(f => (
                            <div key={f.label} style={{
                                padding: '8px 16px', background: 'rgba(200,168,118,0.12)',
                                borderRadius: 8, border: '1px solid rgba(200,168,118,0.25)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#c8a876' }}>{f.label}</div>
                                <div style={{ fontSize: 10, color: '#8a6e4a', marginTop: 2 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Circuit Diagram panel */}
            {showCircuit && (
                <div style={{ background: '#1a1209', padding: '16px 28px', borderTop: '1px solid rgba(200,168,118,0.15)' }}>
                    <div style={{ fontSize: 11, color: '#8a6e4a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Circuit Diagram
                    </div>
                    <svg width="100%" height="100" viewBox="0 0 600 100">
                        {/* Battery */}
                        <line x1="50" y1="50" x2="100" y2="50" stroke="#c8a876" strokeWidth="2" />
                        <line x1="100" y1="30" x2="100" y2="70" stroke="#c8a876" strokeWidth="3" />
                        <line x1="110" y1="40" x2="110" y2="60" stroke="#c8a876" strokeWidth="2" />
                        <line x1="110" y1="50" x2="180" y2="50" stroke="#c8a876" strokeWidth="2" />
                        <text x="75" y="25" textAnchor="middle" fontSize="11" fill="#8a6e4a">Battery</text>
                        {/* Resistor */}
                        <rect x="180" y="38" width="100" height="24" rx="4" fill="none" stroke="#c8a876" strokeWidth="2" />
                        <text x="230" y="52" textAnchor="middle" fontSize="11" fill="#c8a876" fontFamily="monospace">{resistance} Ω</text>
                        <text x="230" y="25" textAnchor="middle" fontSize="11" fill="#8a6e4a">R</text>
                        {/* Wire */}
                        <line x1="280" y1="50" x2="380" y2="50" stroke="#c8a876" strokeWidth="2" />
                        {/* Galvanometer (circle with G) */}
                        <circle cx="420" cy="50" r="28" fill="none" stroke="#c8a876" strokeWidth="2" />
                        <text x="420" y="55" textAnchor="middle" fontSize="16" fill="#c8a876" fontWeight="700">G</text>
                        <text x="420" y="25" textAnchor="middle" fontSize="11" fill="#8a6e4a">Galvanometer</text>
                        <line x1="448" y1="50" x2="540" y2="50" stroke="#c8a876" strokeWidth="2" />
                        {/* Return wire */}
                        <line x1="540" y1="50" x2="540" y2="90" stroke="#c8a876" strokeWidth="2" />
                        <line x1="540" y1="90" x2="50" y2="90" stroke="#c8a876" strokeWidth="2" />
                        <line x1="50" y1="90" x2="50" y2="50" stroke="#c8a876" strokeWidth="2" />
                        {/* Current arrow */}
                        <text x="300" y="40" textAnchor="middle" fontSize="11" fill="#6bde8c">→ I = {current.toFixed(1)} μA</text>
                    </svg>
                </div>
            )}

            {/* Footer */}
            <div style={{
                background: '#140d06', padding: '10px 28px',
                borderTop: '1px solid rgba(200,168,118,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ fontSize: 11, color: '#6b5234' }}>
                    Interactive Galvanometer Simulation · Physics AI Lab
                </div>
                <div style={{ fontSize: 11, color: '#8a6e4a' }}>
                    θ = {deflectionDeg.toFixed(1)}° · V = {voltage_V} V
                </div>
            </div>
        </div>
    );
}
