'use client';
// Interactive Bohr Atom — click shells to excite/de-excite electrons
import { useState, useEffect, useRef } from 'react';

const SHELLS = [
    { n: 1, r: 55, maxE: 2, label: 'n=1', energy: '-13.6 eV' },
    { n: 2, r: 100, maxE: 8, label: 'n=2', energy: '-3.4 eV' },
    { n: 3, r: 145, maxE: 18, label: 'n=3', energy: '-1.5 eV' },
];

const ELECTRONS_DEFAULT = [0, 1, 2]; // which shell each electron is at

export default function BohrAtomSim() {
    const [electronShells, setElectronShells] = useState([0, 0, 1]); // 3 electrons
    const [excitedPhase, setExcitedPhase] = useState<null | { from: number, to: number, type: 'absorb' | 'emit' }>(null);
    const [photonColor, setPhotonColor] = useState('');
    const [message, setMessage] = useState('Click a shell to excite an electron');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleRef = useRef([0, Math.PI * 0.7, Math.PI * 1.4]);
    const rafRef = useRef<number>(0);

    const PHOTON_COLORS: Record<string, string> = {
        '0→1': '#ff6b35', '1→2': '#4ea8de', '2→0': '#a855f7',
        '1→0': '#ff6b35', '2→1': '#4ea8de', '0→2': '#a855f7',
    };
    const ENERGY_DIFF: Record<string, string> = {
        '0→1': '10.2 eV absorbed', '1→2': '1.9 eV absorbed', '0→2': '12.1 eV absorbed',
        '1→0': '10.2 eV emitted', '2→1': '1.9 eV emitted', '2→0': '12.1 eV emitted',
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const CX = 180; const CY = 180;

        const render = () => {
            ctx.clearRect(0, 0, 360, 360);

            // Background
            const bg = ctx.createRadialGradient(CX, CY, 20, CX, CY, 180);
            bg.addColorStop(0, '#1a0f24');
            bg.addColorStop(1, '#0a0614');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, 360, 360);

            // Draw shells
            SHELLS.forEach(shell => {
                ctx.strokeStyle = 'rgba(200,168,118,0.25)';
                ctx.lineWidth = 1;
                ctx.setLineDash([6, 4]);
                ctx.beginPath();
                ctx.arc(CX, CY, shell.r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                // Shell label
                ctx.font = '11px DM Sans, sans-serif';
                ctx.fillStyle = 'rgba(200,168,118,0.6)';
                ctx.fillText(shell.label, CX + shell.r + 4, CY - 4);
                ctx.font = '9px DM Sans, sans-serif';
                ctx.fillStyle = 'rgba(200,168,118,0.4)';
                ctx.fillText(shell.energy, CX + shell.r + 4, CY + 10);
            });

            // Nucleus
            const nucGrad = ctx.createRadialGradient(CX - 4, CY - 4, 2, CX, CY, 24);
            nucGrad.addColorStop(0, '#e8a076');
            nucGrad.addColorStop(1, '#8B4A35');
            ctx.fillStyle = nucGrad;
            ctx.beginPath();
            ctx.arc(CX, CY, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 11px DM Sans, sans-serif';
            ctx.fillStyle = '#F7F2E8';
            ctx.textAlign = 'center';
            ctx.fillText('p⁺', CX - 5, CY - 2);
            ctx.fillText('n⁰', CX + 5, CY + 10);

            // Rotate electrons
            angleRef.current = angleRef.current.map((a, i) => a + (0.008 + i * 0.003));

            // Draw electrons
            electronShells.forEach((shellIdx, ei) => {
                const shell = SHELLS[shellIdx];
                const angle = angleRef.current[ei];
                const ex = CX + shell.r * Math.cos(angle);
                const ey = CY + shell.r * Math.sin(angle);

                // Electron glow
                const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
                eg.addColorStop(0, 'rgba(78,168,222,0.8)');
                eg.addColorStop(1, 'transparent');
                ctx.fillStyle = eg;
                ctx.beginPath();
                ctx.arc(ex, ey, 10, 0, Math.PI * 2);
                ctx.fill();

                // Electron dot
                ctx.fillStyle = '#4ea8de';
                ctx.beginPath();
                ctx.arc(ex, ey, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = 'bold 7px DM Sans, sans-serif';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('e⁻', ex, ey + 3);
            });

            // Photon emission animation
            if (excitedPhase && photonColor) {
                ctx.fillStyle = photonColor;
                ctx.globalAlpha = 0.7 + 0.3 * Math.sin(Date.now() * 0.01);
                ctx.beginPath();
                ctx.arc(CX + 160, CY, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.font = '10px DM Sans, sans-serif';
                ctx.fillStyle = photonColor;
                ctx.fillText('hν', CX + 160, CY + 24);
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [electronShells, excitedPhase, photonColor]);

    const exciteElectron = (toShell: number) => {
        const fromShell = electronShells[0]; // move electron 0
        if (fromShell === toShell) return;

        const key = `${fromShell}→${toShell}`;
        const type = toShell > fromShell ? 'absorb' : 'emit';
        setExcitedPhase({ from: fromShell, to: toShell, type });
        setPhotonColor(PHOTON_COLORS[key] ?? '#ffffff');
        setMessage(`${type === 'absorb' ? '⬆ Energy absorbed' : '⬇ Photon emitted'} — ${ENERGY_DIFF[key] ?? ''}`);

        setElectronShells(prev => [toShell, prev[1], prev[2]]);

        setTimeout(() => { setExcitedPhase(null); setPhotonColor(''); }, 2000);
    };

    const reset = () => {
        setElectronShells([0, 0, 1]);
        setExcitedPhase(null);
        setPhotonColor('');
        setMessage('Click a shell to excite an electron');
        angleRef.current = [0, Math.PI * 0.7, Math.PI * 1.4];
    };

    return (
        <div style={{ background: '#0a0614', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(200,168,118,0.2)' }}>
            <div style={{ display: 'flex', gap: 0 }}>
                {/* Canvas */}
                <canvas ref={canvasRef} width={360} height={360} style={{ display: 'block', flexShrink: 0 }} />

                {/* Controls */}
                <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: '#c8a876' }}>
                        Interactive Bohr Atom
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(200,168,118,0.7)', padding: '10px 14px', background: 'rgba(200,168,118,0.08)', borderRadius: 8, lineHeight: 1.6 }}>
                        {message}
                    </div>

                    {/* Shell buttons */}
                    <div style={{ fontSize: 11, color: 'rgba(200,168,118,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Excite electron to shell
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SHELLS.map(shell => (
                            <button key={shell.n} onClick={() => exciteElectron(shell.n - 1)} style={{
                                padding: '10px 14px', borderRadius: 10,
                                background: electronShells[0] === shell.n - 1 ? 'rgba(78,168,222,0.2)' : 'rgba(200,168,118,0.06)',
                                border: `1px solid ${electronShells[0] === shell.n - 1 ? '#4ea8de' : 'rgba(200,168,118,0.2)'}`,
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: electronShells[0] === shell.n - 1 ? '#4ea8de' : '#c8a876' }}>{shell.label}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(200,168,118,0.6)', fontFamily: 'monospace' }}>{shell.energy}</span>
                                </div>
                                {electronShells[0] === shell.n - 1 && <div style={{ fontSize: 10, color: '#4ea8de', marginTop: 3 }}>● Electron here (ground state if n=1)</div>}
                            </button>
                        ))}
                    </div>

                    {/* Energy diagram */}
                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ fontSize: 11, color: 'rgba(200,168,118,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Energy Transitions
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(200,168,118,0.5)', lineHeight: 1.7 }}>
                            <div>n=1→n=2: absorb 10.2 eV (UV)</div>
                            <div>n=2→n=3: absorb 1.9 eV (visible)</div>
                            <div>n=2→n=1: emit 10.2 eV (photon)</div>
                        </div>
                    </div>

                    <button onClick={reset} style={{
                        padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: 'rgba(200,168,118,0.1)', color: '#c8a876',
                        border: '1px solid rgba(200,168,118,0.2)', cursor: 'pointer',
                    }}>↺ Reset</button>
                </div>
            </div>
        </div>
    );
}
