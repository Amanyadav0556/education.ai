'use client';
// ════════════════════════════════════════════════════════════════════════════
// QUADRATIC EQUATION GRAPHER — live y = ax² + bx + c
// Pure function of (a, b, c) — no animation loop needed, redraws on slider change
// ════════════════════════════════════════════════════════════════════════════
import { useState, useMemo } from 'react';

const W = 600;
const H = 420;
const PLOT_LEFT = 60, PLOT_RIGHT = 560, PLOT_TOP = 30, PLOT_BOTTOM = 380;
const X_MIN = -10, X_MAX = 10;

export default function QuadraticGrapherSim() {
    const [a, setA] = useState(1);
    const [b, setB] = useState(-3);
    const [c, setC] = useState(2);

    const f = (x: number) => a * x * x + b * x + c;

    const { yMin, yMax, curvePoints, vertex, roots, discriminant, axisOfSymmetry } = useMemo(() => {
        const samples: number[] = [];
        for (let i = 0; i <= 100; i++) {
            const x = X_MIN + ((X_MAX - X_MIN) * i) / 100;
            samples.push(f(x));
        }
        let yLo = Math.min(...samples);
        let yHi = Math.max(...samples);
        if (yHi - yLo < 1) { yLo -= 5; yHi += 5; }
        const pad = (yHi - yLo) * 0.15;
        yLo -= pad; yHi += pad;

        const vx = -b / (2 * a);
        const vy = f(vx);
        const D = b * b - 4 * a * c;
        let rootVals: number[] = [];
        if (D >= 0) {
            const sq = Math.sqrt(D);
            rootVals = [(-b - sq) / (2 * a), (-b + sq) / (2 * a)];
        }

        return {
            yMin: yLo, yMax: yHi,
            curvePoints: samples,
            vertex: { x: vx, y: vy },
            roots: rootVals,
            discriminant: D,
            axisOfSymmetry: vx,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [a, b, c]);

    const xToPx = (x: number) => PLOT_LEFT + ((x - X_MIN) / (X_MAX - X_MIN)) * (PLOT_RIGHT - PLOT_LEFT);
    const yToPx = (y: number) => PLOT_BOTTOM - ((y - yMin) / (yMax - yMin)) * (PLOT_BOTTOM - PLOT_TOP);

    const curvePath = curvePoints.map((y, i) => {
        const x = X_MIN + ((X_MAX - X_MIN) * i) / 100;
        return `${xToPx(x).toFixed(1)},${yToPx(y).toFixed(1)}`;
    }).join(' ');

    const xAxisY = yToPx(Math.max(yMin, Math.min(yMax, 0)));
    const yAxisX = xToPx(Math.max(X_MIN, Math.min(X_MAX, 0)));

    const handleReset = () => { setA(1); setB(-3); setC(2); };

    return (
        <div style={{
            background: 'var(--cream-50)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif',
        }}>
            <div style={{ background: '#F2EDE4', padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 600 }}>
                    <rect width={W} height={H} fill="#F2EDE4" />

                    {/* Gridlines */}
                    {Array.from({ length: 21 }, (_, i) => X_MIN + i).filter(x => x % 2 === 0).map(x => (
                        <line key={`vx${x}`} x1={xToPx(x)} y1={PLOT_TOP} x2={xToPx(x)} y2={PLOT_BOTTOM} stroke="#2C2318" strokeOpacity={0.06} />
                    ))}

                    {/* Axes */}
                    {xAxisY >= PLOT_TOP && xAxisY <= PLOT_BOTTOM && (
                        <line x1={PLOT_LEFT} y1={xAxisY} x2={PLOT_RIGHT} y2={xAxisY} stroke="#524035" strokeWidth={2} />
                    )}
                    {yAxisX >= PLOT_LEFT && yAxisX <= PLOT_RIGHT && (
                        <line x1={yAxisX} y1={PLOT_TOP} x2={yAxisX} y2={PLOT_BOTTOM} stroke="#524035" strokeWidth={2} />
                    )}
                    <text x={PLOT_RIGHT + 4} y={xAxisY + 4} fontSize={13} fill="#524035" fontFamily="DM Sans, sans-serif">x</text>
                    <text x={yAxisX - 6} y={PLOT_TOP - 8} fontSize={13} fill="#524035" fontFamily="DM Sans, sans-serif">y</text>

                    {/* Axis of symmetry */}
                    {axisOfSymmetry >= X_MIN && axisOfSymmetry <= X_MAX && (
                        <line x1={xToPx(axisOfSymmetry)} y1={PLOT_TOP} x2={xToPx(axisOfSymmetry)} y2={PLOT_BOTTOM}
                            stroke="#2D6A8F" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
                    )}

                    {/* Parabola */}
                    <polyline points={curvePath} fill="none" stroke="#4E6B57" strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Roots */}
                    {roots.map((r, i) => (
                        r >= X_MIN && r <= X_MAX ? (
                            <g key={i}>
                                <line x1={xToPx(r)} y1={yToPx(0)} x2={xToPx(r)} y2={xAxisY} stroke="#8B4A35" strokeDasharray="3 3" strokeWidth={1} />
                                <circle cx={xToPx(r)} cy={xAxisY} r={5} fill="#8B4A35" />
                                <text x={xToPx(r)} y={xAxisY + 20} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8B4A35" fontFamily="DM Sans, sans-serif">{r.toFixed(2)}</text>
                            </g>
                        ) : null
                    ))}

                    {/* Vertex */}
                    {vertex.x >= X_MIN && vertex.x <= X_MAX && (
                        <g>
                            <circle cx={xToPx(vertex.x)} cy={yToPx(vertex.y)} r={5} fill="#B87333" />
                            <text x={xToPx(vertex.x) + 10} y={yToPx(vertex.y) - 8} fontSize={11} fontWeight={600} fill="#B87333" fontFamily="DM Sans, sans-serif">
                                Vertex ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
                            </text>
                        </g>
                    )}

                    <text x={W / 2} y={20} textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize={16} fontWeight={600} fill="#2C2318">
                        y = {a}x² {b >= 0 ? '+' : '−'} {Math.abs(b)}x {c >= 0 ? '+' : '−'} {Math.abs(c)}
                    </text>
                </svg>
            </div>

            <div style={{ padding: '20px 24px', borderTop: '2px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 16 }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>a</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{a.toFixed(1)}</span>
                        </div>
                        <input type="range" min={-5} max={5} step={0.1} value={a}
                            onChange={e => { const v = Number(e.target.value); setA(Math.abs(v) < 0.1 ? (v < 0 ? -0.1 : 0.1) : v); }}
                            style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>b</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{b.toFixed(1)}</span>
                        </div>
                        <input type="range" min={-10} max={10} step={0.1} value={b}
                            onChange={e => setB(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-600)' }}>c</label>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--stone-800)' }}>{c.toFixed(1)}</span>
                        </div>
                        <input type="range" min={-10} max={10} step={0.1} value={c}
                            onChange={e => setC(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--stone-800)' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                    <button onClick={handleReset} style={{
                        padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'var(--cream-200)', color: 'var(--stone-700)',
                        border: '1px solid var(--border-medium)', cursor: 'pointer',
                    }}>↺ Reset</button>
                </div>

                <div style={{
                    padding: '12px 16px', background: 'var(--cream-200)', borderRadius: 8,
                    display: 'flex', gap: 20, flexWrap: 'wrap',
                }}>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        D = b² − 4ac = <strong>{discriminant.toFixed(2)}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        Roots: <strong style={{ fontFamily: 'monospace' }}>
                            {discriminant > 0 ? `${roots[0].toFixed(2)}, ${roots[1].toFixed(2)}` :
                                discriminant === 0 ? `${roots[0].toFixed(2)} (double root)` :
                                    `${(-b / (2 * a)).toFixed(2)} ± ${(Math.sqrt(-discriminant) / (2 * a)).toFixed(2)}i (complex)`}
                        </strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)' }}>
                        Vertex: <strong style={{ fontFamily: 'monospace' }}>({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--stone-600)', fontFamily: 'monospace' }}>
                        x = (−b ± √(b²−4ac)) / 2a
                    </div>
                </div>
            </div>
        </div>
    );
}
