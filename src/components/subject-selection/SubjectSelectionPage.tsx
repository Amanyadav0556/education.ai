'use client';
import { useState } from 'react';
import { useApp, SUBJECTS_DATA } from '@/context/AppContext';

const SUBJECT_OPTIONS = [
    ...SUBJECTS_DATA.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, gradient: s.gradient, color: s.color, desc: getDesc(s.id) })),
    { id: 'other', name: 'Other', emoji: '🌟', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: '#8b5cf6', desc: 'Computer Science, Art, Music, and more' },
];

function getDesc(id: string): string {
    const map: Record<string, string> = {
        physics: 'Mechanics, Thermodynamics, Electricity',
        mathematics: 'Calculus, Algebra, Probability',
        chemistry: 'Organic, Inorganic, Physical Chemistry',
        history: 'Ancient, Medieval & Modern History',
        geography: 'Physical Geography, Maps, Climate',
        english: 'Grammar, Literature, Writing Skills',
        sports: 'Fitness, Sports Science, Health',
    };
    return map[id] ?? '';
}

export default function SubjectSelectionPage() {
    const { selectSubject, user, authState } = useApp();
    const [selected, setSelected] = useState<string | null>(null);
    const [customSubject, setCustomSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isOther = selected === 'other';
    const canContinue = selected !== null && (!isOther || customSubject.trim().length >= 2);

    const handleContinue = async () => {
        if (!canContinue) return;
        if (isOther && customSubject.trim().length < 2) {
            setError('Please enter a valid subject name (at least 2 characters).');
            return;
        }
        setError('');
        setLoading(true);
        // Simulate a brief save delay for polish
        await new Promise(r => setTimeout(r, 600));
        selectSubject(selected!, isOther ? customSubject.trim() : undefined);
    };

    return (
        <div
            className="page-container"
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}
        >
            {/* Background orbs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div style={{ width: '100%', maxWidth: 780, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 44 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 18,
                            background: 'var(--grad-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 32,
                            boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
                        }}>🎓</div>
                    </div>

                    {user && (
                        <div className="badge badge-primary" style={{ marginBottom: 16, fontSize: 13 }}>
                            👋 Hi, {user.name.split(' ')[0]}!
                        </div>
                    )}

                    <h1 className="heading-display" style={{ marginBottom: 12 }}>
                        Choose Your{' '}
                        <span className="text-gradient">Subject</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 460, margin: '0 auto' }}>
                        What would you like to learn today?
                    </p>
                </div>

                {/* Subject Grid */}
                <div
                    className="stagger-children"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 16,
                        marginBottom: 32,
                    }}
                >
                    {SUBJECT_OPTIONS.map(sub => {
                        const isSelected = selected === sub.id;
                        return (
                            <button
                                key={sub.id}
                                id={`subject-${sub.id}`}
                                onClick={() => { setSelected(sub.id); setError(''); }}
                                aria-pressed={isSelected}
                                style={{
                                    padding: '22px 16px 18px',
                                    background: isSelected
                                        ? `linear-gradient(135deg, ${sub.color}22, ${sub.color}10)`
                                        : 'var(--bg-card)',
                                    border: `2px solid ${isSelected ? sub.color : 'var(--border-subtle)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: isSelected ? `0 6px 28px ${sub.color}35` : 'none',
                                    transform: isSelected ? 'translateY(-3px) scale(1.02)' : 'none',
                                    outline: 'none',
                                }}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(sub.id); } }}
                                onMouseEnter={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = sub.color + '80';
                                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 18px ${sub.color}25`;
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                                        (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {/* Selected checkmark */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        background: sub.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        color: 'white',
                                        fontWeight: 700,
                                        animation: 'scale-in 0.2s ease',
                                        boxShadow: `0 2px 8px ${sub.color}60`,
                                    }}>✓</div>
                                )}

                                {/* Gradient glow bar at top when selected */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 3,
                                        background: sub.gradient,
                                        borderRadius: '8px 8px 0 0',
                                    }} />
                                )}

                                <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>{sub.emoji}</div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    marginBottom: 6,
                                    color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)',
                                }}>{sub.name}</div>
                                <div style={{
                                    fontSize: 11,
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.4,
                                }}>{sub.desc}</div>
                            </button>
                        );
                    })}
                </div>

                {/* Other — custom input */}
                {isOther && (
                    <div
                        className="animate-fade-in"
                        style={{
                            marginBottom: 28,
                            padding: '20px 24px',
                            background: 'rgba(139,92,246,0.08)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <label className="form-label" style={{ marginBottom: 10, display: 'block', color: 'var(--text-secondary)', fontSize: 14 }}>
                            🌟 Enter your subject name
                        </label>
                        <input
                            id="custom-subject-input"
                            type="text"
                            className="form-input"
                            placeholder="e.g. Computer Science, Art, Biology..."
                            value={customSubject}
                            onChange={e => { setCustomSubject(e.target.value); setError(''); }}
                            maxLength={60}
                            autoFocus
                            style={{ fontSize: 15 }}
                        />
                        {customSubject.trim().length > 0 && customSubject.trim().length < 2 && (
                            <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 6 }}>Please enter at least 2 characters.</p>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '10px 16px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: '#fca5a5',
                        fontSize: 13,
                        marginBottom: 20,
                    }}>{error}</div>
                )}

                {/* Continue button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <button
                        id="continue-btn"
                        className="btn btn-primary btn-lg"
                        onClick={handleContinue}
                        disabled={!canContinue || loading}
                        style={{
                            width: '100%',
                            maxWidth: 340,
                            opacity: canContinue ? 1 : 0.45,
                            cursor: canContinue ? 'pointer' : 'not-allowed',
                            fontSize: 16,
                            padding: '15px 32px',
                        }}
                    >
                        {loading
                            ? <><span className="loading-spinner" /> Setting up your dashboard...</>
                            : selected
                                ? `Continue with ${selected === 'other' && customSubject.trim() ? customSubject.trim() : selected !== 'other' ? SUBJECT_OPTIONS.find(s => s.id === selected)?.name : 'Other'} →`
                                : 'Select a subject to continue'}
                    </button>

                    {selected && (
                        <p className="animate-fade-in" style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                            You can change your subject anytime from the sidebar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
