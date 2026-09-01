'use client';
import { useState } from 'react';
import { useApp, SUBJECTS_DATA } from '@/context/AppContext';

const SUBJECT_OPTIONS = [
    ...SUBJECTS_DATA.map(s => ({ id: s.id, name: s.name, emoji: s.emoji, color: s.color, desc: getDesc(s.id) })),
    { id: 'other', name: 'Other', emoji: '🌟', color: '#3D5445', desc: 'Computer Science, Art, Music, and more' },
];

function getDesc(id: string): string {
    const map: Record<string, string> = {
        physics: 'Mechanics, Thermodynamics, Electricity',
        mathematics: 'Calculus, Algebra, Probability',
        chemistry: 'Organic, Inorganic, Physical Chemistry',
        history: 'Ancient, Medieval & Modern History',
        geography: 'Physical Geography, Maps, Climate',
        english: 'Grammar, Literature, Writing Skills',
        sports: 'Physical Fitness, Sports Science',
    };
    return map[id] ?? '';
}

export default function SubjectSelectionPage() {
    const { selectSubject, user } = useApp();
    const [selected, setSelected] = useState<string | null>(null);
    const [customSubject, setCustomSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isOther = selected === 'other';
    const canContinue = selected !== null && (!isOther || customSubject.trim().length >= 2);

    const handleContinue = async () => {
        if (!canContinue) return;
        if (isOther && customSubject.trim().length < 2) {
            setError('Please enter a valid subject name.');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        selectSubject(selected!, isOther ? customSubject.trim() : undefined);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--cream-100)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
        }}>
            {/* Decorative bg */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(224,213,192,0.45) 0%, transparent 60%)',
                zIndex: 0,
            }} />

            <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 18px',
                            background: 'var(--stone-800)',
                            borderRadius: 'var(--radius-pill)',
                            color: 'var(--cream-50)',
                        }}>
                            <span style={{ fontSize: 15 }}>🎓</span>
                            <span style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: 15, fontWeight: 600,
                            }}>EduAI</span>
                        </div>
                    </div>

                    {user && (
                        <div className="eyebrow" style={{ marginBottom: 14 }}>
                            Welcome, {user.name.split(' ')[0]}
                        </div>
                    )}

                    <h1 className="heading-display" style={{ marginBottom: 14 }}>
                        Choose your <em>subject</em>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
                        Pick the subject you want to master today. Everything — your lessons, practice, and AI tutor — will be tailored around it.
                    </p>
                </div>

                {/* Subject Grid */}
                <div
                    className="stagger-children"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                        gap: 12,
                        marginBottom: 28,
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
                                    padding: '20px 14px 16px',
                                    background: isSelected ? 'var(--stone-800)' : 'var(--cream-50)',
                                    border: `1px solid ${isSelected ? 'var(--stone-800)' : 'var(--border-medium)'}`,
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: 'all 0.2s var(--ease-out)',
                                    outline: 'none',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                                    transform: isSelected ? 'translateY(-3px)' : 'none',
                                }}
                                onMouseEnter={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--stone-800)';
                                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-sm)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isSelected) {
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-medium)';
                                        (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <div style={{ fontSize: 36, marginBottom: 10, lineHeight: 1 }}>{sub.emoji}</div>
                                <div style={{
                                    fontWeight: 600, fontSize: 13,
                                    marginBottom: 5,
                                    color: isSelected ? 'var(--cream-50)' : 'var(--stone-800)',
                                    fontFamily: 'DM Sans, sans-serif',
                                }}>{sub.name}</div>
                                <div style={{
                                    fontSize: 10, lineHeight: 1.4,
                                    color: isSelected ? 'rgba(247,242,232,0.55)' : 'var(--stone-400)',
                                }}>{sub.desc}</div>
                                {isSelected && (
                                    <div style={{
                                        marginTop: 10,
                                        width: 22, height: 22,
                                        borderRadius: '50%',
                                        background: 'var(--cream-50)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700,
                                        color: 'var(--stone-800)',
                                        margin: '10px auto 0',
                                    }}>✓</div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Other — custom input */}
                {isOther && (
                    <div
                        className="animate-fade-in"
                        style={{
                            marginBottom: 24,
                            padding: '20px 24px',
                            background: 'var(--cream-50)',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <label className="form-label" style={{ marginBottom: 10 }}>
                            Enter your subject name
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
                        />
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '10px 16px', marginBottom: 16,
                        background: 'var(--terra-100)',
                        border: '1px solid rgba(139,74,53,0.2)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--terra-600)', fontSize: 13,
                    }}>{error}</div>
                )}

                {/* Continue */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <button
                        id="continue-btn"
                        className="btn btn-primary btn-lg"
                        onClick={handleContinue}
                        disabled={!canContinue || loading}
                        style={{ minWidth: 280, borderRadius: 'var(--radius-md)' }}
                    >
                        {loading
                            ? <><span className="loading-spinner" /> Setting up your dashboard...</>
                            : selected
                                ? `Continue with ${selected === 'other' && customSubject.trim() ? customSubject.trim() : selected !== 'other' ? SUBJECT_OPTIONS.find(s => s.id === selected)?.name : 'Other'} →`
                                : 'Select a subject to continue'}
                    </button>

                    {selected && (
                        <p className="animate-fade-in" style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                            You can change your subject anytime from the sidebar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
