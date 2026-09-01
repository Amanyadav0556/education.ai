'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
    const { login, signup, googleLogin } = useApp();
    const [mode, setMode] = useState<AuthMode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Please fill in all fields.'); return; }
        if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
        try {
            setLoading(true);
            if (mode === 'login') await login(email, password);
            else await signup(name, email, password);
        } catch { setError('Something went wrong. Please try again.'); setLoading(false); }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try { await googleLogin(); } catch { setLoading(false); }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--cream-100)',
        }}>
            {/* ── Left — Editorial Panel ──────────────────────────────── */}
            <div style={{
                background: 'var(--stone-800)',
                display: 'flex',
                flexDirection: 'column',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(ellipse 90% 60% at 20% 80%, rgba(61,84,69,0.35) 0%, transparent 60%)',
                    pointerEvents: 'none',
                }} />

                {/* Logo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 72 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--cream-50)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18,
                        }}>🎓</div>
                        <span style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 20, fontWeight: 700,
                            color: 'var(--cream-50)',
                        }}>EduAI</span>
                    </div>

                    {/* Headline */}
                    <div style={{ flex: 1 }}>
                        <div className="eyebrow" style={{ color: 'rgba(247,242,232,0.45)', marginBottom: 20 }}>
                            AI-Powered Learning
                        </div>
                        <h1 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                            fontWeight: 600,
                            lineHeight: 1.1,
                            color: 'var(--cream-50)',
                            marginBottom: 24,
                            letterSpacing: '-0.02em',
                        }}>
                            Learn smarter,<br />
                            <em style={{ fontStyle: 'italic', color: 'rgba(196,212,202,0.85)' }}>not harder.</em>
                        </h1>
                        <p style={{
                            color: 'rgba(247,242,232,0.55)',
                            fontSize: 15, lineHeight: 1.7,
                            maxWidth: 360,
                        }}>
                            Your personal AI tutor, tailored practice, and a complete learning system — all in one place.
                        </p>
                    </div>

                    {/* Feature list */}
                    <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { icon: '🎯', label: 'Subject-focused learning paths' },
                            { icon: '🤖', label: 'AI explanations on demand' },
                            { icon: '📊', label: 'Progress tracking & analytics' },
                            { icon: '✍️', label: 'Adaptive practice quizzes' },
                        ].map(f => (
                            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: 'rgba(247,242,232,0.08)',
                                    border: '1px solid rgba(247,242,232,0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 15,
                                }}>
                                    {f.icon}
                                </div>
                                <span style={{ fontSize: 13, color: 'rgba(247,242,232,0.65)', fontWeight: 400 }}>
                                    {f.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right — Auth Form ────────────────────────────────────── */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 56px',
                background: 'var(--cream-100)',
            }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="animate-fade-in">
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <h2 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            color: 'var(--stone-800)',
                            marginBottom: 8,
                        }}>
                            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            {mode === 'login' ? 'Sign in to your account' : 'Create a free account'}
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        className="btn btn-secondary w-full"
                        style={{ marginBottom: 20, gap: 12, padding: '12px 22px', borderRadius: 'var(--radius-md)' }}
                        onClick={handleGoogle}
                        disabled={loading}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4" />
                            <path d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z" fill="#34A853" />
                            <path d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" fill="#FBBC05" />
                            <path d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="divider-text" style={{ margin: '20px 0' }}>or</div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="form-input-icon">
                                    <span className="icon" style={{ fontSize: 14 }}>👤</span>
                                    <input className="form-input" type="text" placeholder="Your name" value={name}
                                        onChange={e => setName(e.target.value)} autoComplete="name" />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="form-input-icon">
                                <span className="icon" style={{ fontSize: 14 }}>✉️</span>
                                <input className="form-input" type="email" placeholder="you@example.com" value={email}
                                    onChange={e => setEmail(e.target.value)} autoComplete="email" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 24 }}>
                            <label className="form-label">Password</label>
                            <div className="form-input-icon">
                                <span className="icon" style={{ fontSize: 14 }}>🔒</span>
                                <input className="form-input" type="password" placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '10px 14px', marginBottom: 16,
                                background: 'var(--terra-100)',
                                border: '1px solid rgba(139,74,53,0.2)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 13, color: 'var(--terra-600)',
                            }}>{error}</div>
                        )}

                        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}
                            style={{ borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                            {loading ? <><span className="loading-spinner" /> Please wait...</> :
                                mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--stone-800)', fontWeight: 600, fontSize: 13,
                                textDecoration: 'underline', textUnderlineOffset: 3,
                            }}
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Mobile fallback */}
            <style>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="padding: 48px 56px"] {
            padding: 40px 24px !important;
          }
        }
      `}</style>
        </div>
    );
}
