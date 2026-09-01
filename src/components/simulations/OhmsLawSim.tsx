'use client';
// ════════════════════════════════════════════════════════════════════════════
// OHM'S LAW / AMMETER CIRCUIT SIMULATOR
// Battery — Resistor — Ammeter — Switch, series loop
// Physics: I = V / R, P = V × I
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';

const V_MIN = 0, V_MAX = 24;
const R_MIN = 5, R_MAX = 500;
const I_MAX = 5; // ammeter dial full-scale, Amps
const RESISTANCE_PRESETS = [5, 10, 25, 50, 100, 220, 500];

// Circuit loop coordinates (viewBox 0 0 600 100), shared with the flow-dot animation
const LOOP_LEFT = 50, LOOP_RIGHT = 560, LOOP_TOP = 50, LOOP_BOTTOM = 90;
const DIAL_CX = 200, DIAL_CY = 200, DIAL_R = 140;

function pointOnLoop(t: number): { x: number; y: number } {
    const w = LOOP_RIGHT - LOOP_LEFT;
    const h = LOOP_BOTTOM - LOOP_TOP;
    const perim = 2 * w + 2 * h;
    let d = ((t % 1) + 1) % 1 * perim;
    if (d < w) return { x: LOOP_LEFT + d, y: LOOP_TOP };
    d -= w;
    if (d < h) return { x: LOOP_RIGHT, y: LOOP_TOP + d };
    d -= h;
    if (d < w) return { x: LOOP_RIGHT - d, y: LOOP_BOTTOM };
    d -= w;
    return { x: LOOP_LEFT, y: LOOP_BOTTOM - d };
}

export default function OhmsLawSim() {
    const [voltage, setVoltage] = useState(5);
    const [resistance, setResistance] = useState(100);
    const [switchOn, setSwitchOn] = useState(true);
    const [animateFlow, setAnimateFlow] = useState(true);

    const current = switchOn ? voltage / resistance : 0; // Amps
    const power = voltage * current; // Watts

    const needleAngleRef = useRef(180); // degrees: 180 = left (0 A) .. 0 = right (I_MAX)
    const flowPhaseRef = useRef(0);
    const rafRef = useRef<number>(0);
    const needleRef = useRef<SVGLineElement>(null);
    const readingRef = useRef<SVGTextElement>(null);
    const dotsGroupRef = useRef<SVGGElement>(null);

    const currentRef = useRef(current);
    currentRef.current = current;
    const animateFlowRef = useRef(animateFlow);
    animateFlowRef.current = animateFlow;

    useEffect(() => {
        const animate = () => {
            const t = Math.max(0, Math.min(1, currentRef.current / I_MAX));
            const targetAngle = 180 - t * 180;
            const diff = targetAngle - needleAngleRef.current;
            needleAngleRef.current += diff * 0.12;

            const rad = (needleAngleRef.current * Math.PI) / 180;
            const nx = DIAL_CX + (DIAL_R - 20) * Math.cos(rad);
            const ny = DIAL_CY - (DIAL_R - 20) * Math.sin(rad);
            if (needleRef.current) {
                needleRef.current.setAttribute('x2', nx.toFixed(2));
                needleRef.current.setAttribute('y2', ny.toFixed(2));
            }
            if (readingRef.current) {
                readingRef.current.textContent = `${currentRef.current.toFixed(2)} A`;
            }

            if (animateFlowRef.current && currentRef.current > 0.001) {
                flowPhaseRef.current = (flowPhaseRef.current + currentRef.current * 0.015) % 1;
            }
            if (dotsGroupRef.current) {
                const dots = dotsGroupRef.current.children;
                for (let i = 0; i < dots.length; i++) {
                    const t2 = (flowPhaseRef.current + i / dots.length) % 1;
                    const pt = pointOnLoop(t2);
                    (dots[i] as SVGCircleElement).setAttribute('cx', pt.x.toFixed(1));
                    (dots[i] as SVGCircleElement).setAttribute('cy', pt.y.toFixed(1));
                    (dots[i] as SVGCircleElement).setAttribute('opacity', currentRef.current > 0.001 ? '0.9' : '0');
                }
            }

            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    const handleReset = () => {
        setVoltage(5);
        setResistance(100);
        setSwitchOn(true);
    };

    const dialMarks = () => {
        const marks = [];
        for (let n = 0; n <= I_MAX; n += 1) {
            const t = n / I_MAX;
            const angleDeg = 180 - t * 180;
            const rad = (angleDeg * Math.PI) / 180;
            const r1 = DIAL_R - 16, r2 = DIAL_R;
            const x1 = DIAL_CX + r1 * Math.cos(rad), y1 = DIAL_CY - r1 * Math.sin(rad);
            const x2 = DIAL_CX + r2 * Math.cos(rad), y2 = DIAL_CY - r2 * Math.sin(rad);
            const tx = DIAL_CX + (r1 - 16) * Math.cos(rad), ty = DIAL_CY - (r1 - 16) * Math.sin(rad);
            marks.push(
                <g key={n}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2C2318" strokeWidth={2} />
                    <text x={tx} y={ty + 4} textAnchor="middle" fontSize="11" fill="#2C2318" fontFamily="DM Sans, sans-serif">{n}</text>
                </g>
            );
        }
        return marks;
    };

    return (
        <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            border: '1px solid var(--border-medium)', background: '#1a1209',
            fontFamily: 'DM Sans, sans-serif',
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, padding: '24px 24px 0' }}>
                {/* Controls */}
                <div style={{
                    background: 'rgba(20,13,6,0.85)', borderRadius: 12, padding: 20, color: '#F7F2E8',
                    border: '1px solid rgba(247,242,232,0.12)',
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c8a876', marginBottom: 16 }}>
                        Controls
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: '#b89a6a' }}>Voltage (V)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#6bde8c' }}>{voltage.toFixed(1)} V</span>
                        </div>
                        <input type="range" min={V_MIN} max={V_MAX} step={0.5} value={voltage}
                            onChange={e => setVoltage(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#c8a876' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8a6e4a', marginTop: 2 }}>
                            <span>0 V</span><span>{V_MAX} V</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label style={{ fontSize: 12, color: '#b89a6a' }}>Resistance (Ω)</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#e8d4a8' }}>{resistance} Ω</span>
                        </div>
                        <input type="range" min={R_MIN} max={R_MAX} step={5} value={resistance}
                            onChange={e => setResistance(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#c8a876' }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                            {RESISTANCE_PRESETS.map(r => (
                                <button key={r} onClick={() => setResistance(r)} style={{
                                    padding: '4px 8px', fontSize: 11, borderRadius: 6,
                                    background: resistance === r ? '#c8a876' : 'rgba(247,242,232,0.08)',
                                    color: resistance === r ? '#2a1f14' : '#b89a6a',
                                    border: `1px solid ${resistance === r ? '#c8a876' : 'rgba(247,242,232,0.15)'}`,
                                    cursor: 'pointer', fontWeight: resistance === r ? 700 : 400,
                                }}>{r}Ω</button>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '12px 14px', marginBottom: 14,
                        border: '1px solid rgba(200,168,118,0.2)',
                    }}>
                        <div style={{ fontSize: 10, color: '#8a6e4a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Readings</div>
                        {[
                            ['Current (I)', `${current.toFixed(3)} A`],
                            ['Power (P)', `${power.toFixed(2)} W`],
                            ['Voltage (V)', `${voltage.toFixed(1)} V`],
                            ['Resistance (R)', `${resistance} Ω`],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 11, color: '#b89a6a' }}>{k}</span>
                                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#e8d4a8', fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <input type="checkbox" id="ohm-flow" checked={animateFlow} onChange={e => setAnimateFlow(e.target.checked)}
                            style={{ accentColor: '#c8a876', width: 14, height: 14 }} />
                        <label htmlFor="ohm-flow" style={{ fontSize: 12, color: '#b89a6a', cursor: 'pointer' }}>Animate current flow</label>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setSwitchOn(s => !s)} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: switchOn ? '#3d6b4e' : '#6b3d3d', color: '#F7F2E8',
                            border: 'none', cursor: 'pointer',
                        }}>{switchOn ? '● Switch ON' : '○ Switch OFF'}</button>
                        <button onClick={handleReset} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: 'rgba(247,242,232,0.1)', color: '#F7F2E8',
                            border: '1px solid rgba(247,242,232,0.2)', cursor: 'pointer',
                        }}>↺ Reset</button>
                    </div>
                </div>

                {/* Ammeter dial */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingBottom: 24 }}>
                    <div style={{
                        background: '#1a1209', borderRadius: 16, padding: '16px 20px 10px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                        border: '2px solid #3d2b1a',
                    }}>
                        <div style={{ textAlign: 'center', fontSize: 10, color: '#8a6e4a', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                            AMMETER
                        </div>
                        <div style={{
                            background: 'radial-gradient(circle at 50% 55%, #f9f6ef, #e8e0d0)',
                            borderRadius: '50% 50% 10px 10px', padding: 4,
                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                        }}>
                            <svg width="400" height="230" viewBox="0 0 400 230">
                                <ellipse cx={DIAL_CX} cy={DIAL_CY} rx="190" ry="180" fill="#f5f0e8" />
                                <path d={`M ${DIAL_CX - DIAL_R} ${DIAL_CY} A ${DIAL_R} ${DIAL_R} 0 0 1 ${DIAL_CX + DIAL_R} ${DIAL_CY}`}
                                    fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="16" />
                                {dialMarks()}
                                <text x={DIAL_CX} y={DIAL_CY - 30} textAnchor="middle" fontSize="11" fill="#8C7466" fontFamily="DM Sans, sans-serif">Amperes</text>
                                <circle cx={DIAL_CX} cy={DIAL_CY} r="8" fill="#c8a876" />
                                <circle cx={DIAL_CX} cy={DIAL_CY} r="4" fill="#2a1f14" />
                                <line ref={needleRef} x1={DIAL_CX} y1={DIAL_CY} x2={DIAL_CX - (DIAL_R - 20)} y2={DIAL_CY} stroke="#cc2222" strokeWidth="2.5" strokeLinecap="round" />
                                <rect x={DIAL_CX - 60} y={DIAL_CY + 6} width="120" height="22" rx="4" fill="#1a1209" />
                                <text ref={readingRef} x={DIAL_CX} y={DIAL_CY + 21} textAnchor="middle" fontSize="12" fill="#00e89b" fontFamily="monospace" fontWeight="700">
                                    {current.toFixed(2)} A
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[{ label: 'I = V / R', desc: "Ohm's Law" }, { label: 'P = V × I', desc: 'Power' }].map(f => (
                            <div key={f.label} style={{
                                padding: '8px 16px', background: 'rgba(200,168,118,0.12)', borderRadius: 8,
                                border: '1px solid rgba(200,168,118,0.25)', textAlign: 'center',
                            }}>
                                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#c8a876' }}>{f.label}</div>
                                <div style={{ fontSize: 10, color: '#8a6e4a', marginTop: 2 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Circuit diagram with animated current dots */}
            <div style={{ background: '#1a1209', padding: '16px 28px', borderTop: '1px solid rgba(200,168,118,0.15)' }}>
                <div style={{ fontSize: 11, color: '#8a6e4a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Circuit Diagram
                </div>
                <svg width="100%" height="120" viewBox="0 0 600 100">
                    {/* Battery symbol, inline on top wire */}
                    <line x1={LOOP_LEFT} y1={LOOP_TOP} x2="100" y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />
                    <line x1="100" y1={LOOP_TOP - 20} x2="100" y2={LOOP_TOP + 20} stroke="#c8a876" strokeWidth={3} />
                    <line x1="110" y1={LOOP_TOP - 10} x2="110" y2={LOOP_TOP + 10} stroke="#c8a876" strokeWidth={2} />
                    <line x1="110" y1={LOOP_TOP} x2="180" y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />
                    <text x="75" y={LOOP_TOP - 24} fontSize="11" fill="#8a6e4a">+ Battery {voltage.toFixed(1)}V</text>

                    {/* Resistor */}
                    <rect x="180" y={LOOP_TOP - 14} width="90" height="28" rx="4" fill="none" stroke="#c8a876" strokeWidth={2} />
                    <text x="225" y={LOOP_TOP + 5} textAnchor="middle" fontSize="11" fill="#c8a876" fontFamily="monospace">{resistance}Ω</text>
                    <text x="225" y={LOOP_TOP - 22} textAnchor="middle" fontSize="10" fill="#8a6e4a">R</text>
                    <line x1="270" y1={LOOP_TOP} x2="360" y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />

                    {/* Ammeter symbol */}
                    <circle cx="390" cy={LOOP_TOP} r="22" fill="none" stroke="#c8a876" strokeWidth={2} />
                    <text x="390" y={LOOP_TOP + 6} textAnchor="middle" fontSize="15" fill="#c8a876" fontWeight="700">A</text>
                    <line x1="412" y1={LOOP_TOP} x2="470" y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />

                    {/* Switch */}
                    <circle cx="480" cy={LOOP_TOP} r="3" fill={switchOn ? '#6bde8c' : '#ff6b6b'} />
                    <circle cx="510" cy={LOOP_TOP} r="3" fill={switchOn ? '#6bde8c' : '#ff6b6b'} />
                    <line x1="480" y1={LOOP_TOP} x2={switchOn ? 508 : 502} y2={switchOn ? LOOP_TOP : LOOP_TOP - 14}
                        stroke={switchOn ? '#6bde8c' : '#ff6b6b'} strokeWidth={2} />
                    <text x="495" y={LOOP_TOP - 22} textAnchor="middle" fontSize="10" fill="#8a6e4a">Switch</text>
                    <line x1="510" y1={LOOP_TOP} x2={LOOP_RIGHT} y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />

                    {/* Right, bottom, left wires closing the loop */}
                    <line x1={LOOP_RIGHT} y1={LOOP_TOP} x2={LOOP_RIGHT} y2={LOOP_BOTTOM} stroke="#c8a876" strokeWidth={2} />
                    <line x1={LOOP_RIGHT} y1={LOOP_BOTTOM} x2={LOOP_LEFT} y2={LOOP_BOTTOM} stroke="#c8a876" strokeWidth={2} />
                    <line x1={LOOP_LEFT} y1={LOOP_BOTTOM} x2={LOOP_LEFT} y2={LOOP_TOP} stroke="#c8a876" strokeWidth={2} />

                    {/* Animated current-flow dots */}
                    <g ref={dotsGroupRef}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <circle key={i} r="4" fill="#6bde8c" opacity="0" />
                        ))}
                    </g>
                </svg>
            </div>

            <div style={{
                background: '#140d06', padding: '10px 28px', borderTop: '1px solid rgba(200,168,118,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ fontSize: 11, color: '#6b5234' }}>Interactive Ammeter Simulation · Physics AI Lab</div>
                <div style={{ fontSize: 11, color: '#8a6e4a' }}>I = {current.toFixed(2)} A · P = {power.toFixed(2)} W</div>
            </div>
        </div>
    );
}
