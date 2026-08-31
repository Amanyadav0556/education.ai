'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

type AuthTab = 'login' | 'signup';

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
    );
}

export default function AuthPage() {
    const { login, signup, googleLogin } = useApp();
    const [tab, setTab] = useState<AuthTab>('login');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    // Login form
    const [loginEmail, setLoginEmail] = useState('student@edu.ai');
    const [loginPassword, setLoginPassword] = useState('password123');

    // Signup form
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirm, setSignupConfirm] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) { setError('Please fill in all fields'); return; }
        setError('');
        setLoading(true);
        try {
            await login(loginEmail, loginPassword);
        } catch { setError('Invalid credentials. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signupName || !signupEmail || !signupPassword) { setError('Please fill in all fields'); return; }
        if (signupPassword !== signupConfirm) { setError('Passwords do not match'); return; }
        if (signupPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        setError('');
        setLoading(true);
        try {
            await signup(signupName, signupEmail, signupPassword);
        } catch { setError('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        setError('');
        try { await googleLogin(); }
        catch { setError('Google login failed. Please try again.'); }
        finally { setGoogleLoading(false); }
    };

    return (
        <div className="page-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Background Orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            {/* Left Panel – Hero */}
            <div className="auth-hero" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 48px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative grid */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                }} />

                <div className="animate-fade-in" style={{ position: 'relative', maxWidth: 480, textAlign: 'center' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: 20,
                            background: 'var(--grad-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 36,
                            boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
                            animation: 'pulse-glow 3s infinite',
                        }}>🎓</div>
                    </div>

                    <div className="heading-display" style={{ marginBottom: 16 }}>
                        Learn Smarter with{' '}
                        <span className="text-gradient">AI-Powered</span>{' '}
                        Education
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, marginBottom: 48 }}>
                        Master any subject with personalized AI explanations, adaptive quizzes, and your own AI tutor — available 24/7.
                    </p>

                    {/* Feature Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
                        {[
                            { icon: '🤖', label: 'Personal AI Tutor' },
                            { icon: '📊', label: 'Progress Tracking' },
                            { icon: '✍️', label: 'Adaptive Quizzes' },
                            { icon: '📚', label: '7+ Subjects' },
                            { icon: '🔥', label: 'Daily Streaks' },
                            { icon: '📖', label: 'Smart Resources' },
                        ].map(f => (
                            <div key={f.label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 100,
                                fontSize: 13,
                                color: 'var(--text-secondary)',
                            }}>
                                <span>{f.icon}</span>
                                <span>{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
                        {[
                            { value: '10K+', label: 'Students' },
                            { value: '7', label: 'Subjects' },
                            { value: '98%', label: 'Success Rate' },
                        ].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <div className="heading-lg text-gradient" style={{ marginBottom: 2 }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel – Auth Form */}
            <div style={{
                width: '100%',
                maxWidth: 460,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 32px',
                background: 'rgba(10, 15, 30, 0.6)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid var(--border-subtle)',
                position: 'relative',
                zIndex: 1,
            }}>
                <div style={{ width: '100%', maxWidth: 380 }} className="animate-fade-in">
                    {/* Brand */}
                    <div style={{ marginBottom: 32, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontFamily: 'Outfit', fontWeight: 800 }}>
                            <span className="text-gradient">EduAI</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                            {tab === 'login' ? 'Welcome back! Continue your learning journey.' : 'Start your AI-powered learning journey today.'}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tab-list" style={{ marginBottom: 28 }}>
                        <button className={`tab-item${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
                            Sign In
                        </button>
                        <button className={`tab-item${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>
                            Sign Up
                        </button>
                    </div>

                    {/* Google Login */}
                    <button className="btn btn-secondary w-full" style={{ marginBottom: 20, padding: '12px' }} onClick={handleGoogle} disabled={googleLoading}>
                        {googleLoading ? <span className="loading-spinner" /> : <GoogleIcon />}
                        Continue with Google
                    </button>

                    <div className="divider-text">or continue with email</div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: '10px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: '#fca5a5',
                            fontSize: 13,
                            marginBottom: 16,
                        }}>{error}</div>
                    )}

                    {/* Login Form */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="form-input-icon">
                                    <span className="icon">📧</span>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="you@example.com"
                                        value={loginEmail}
                                        onChange={e => setLoginEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Your password"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary-400)', fontSize: 13, cursor: 'pointer' }}>
                                    Forgot password?
                                </button>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                                {loading ? <><span className="loading-spinner" /> Signing in...</> : '🚀 Sign In'}
                            </button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {tab === 'signup' && (
                        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="form-input-icon">
                                    <span className="icon">👤</span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Your full name"
                                        value={signupName}
                                        onChange={e => setSignupName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="form-input-icon">
                                    <span className="icon">📧</span>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="you@example.com"
                                        value={signupEmail}
                                        onChange={e => setSignupEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Min. 6 characters"
                                        value={signupPassword}
                                        onChange={e => setSignupPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="form-input-icon">
                                    <span className="icon">🔒</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirm your password"
                                        value={signupConfirm}
                                        onChange={e => setSignupConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                                {loading ? <><span className="loading-spinner" /> Creating account...</> : '🎓 Create Account'}
                            </button>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .auth-hero { display: none !important; }
        }
      `}</style>
        </div>
    );
}
