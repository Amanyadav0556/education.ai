'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const CLASSES = ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'College - 1st Year', 'College - 2nd Year', 'College - 3rd Year'];

const ALL_SUBJECTS = [
    { id: 'physics', name: 'Physics', emoji: '⚡', desc: 'Mechanics, Thermodynamics, Electromagnetism' },
    { id: 'mathematics', name: 'Mathematics', emoji: '📐', desc: 'Calculus, Algebra, Geometry, Statistics' },
    { id: 'chemistry', name: 'Chemistry', emoji: '🧪', desc: 'Organic, Inorganic, Physical Chemistry' },
    { id: 'history', name: 'History', emoji: '📜', desc: 'Ancient, Medieval, Modern World History' },
    { id: 'geography', name: 'Geography', emoji: '🌍', desc: 'Physical Geography, Maps, Climate' },
    { id: 'english', name: 'English', emoji: '📝', desc: 'Grammar, Literature, Writing Skills' },
    { id: 'sports', name: 'Sports & PE', emoji: '🏃', desc: 'Physical Fitness, Sports Science, Health' },
    { id: 'other', name: 'Other', emoji: '🌟', desc: 'Computer Science, Art, Music, and more' },
];

type Step = 'welcome' | 'info' | 'subjects' | 'done';

export default function OnboardingPage() {
    const { user, completeOnboarding } = useApp();
    const [step, setStep] = useState<Step>('welcome');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSubject = (id: string) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleFinish = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        completeOnboarding({ class: selectedClass, subjects: selectedSubjects });
    };

    const steps = ['welcome', 'info', 'subjects', 'done'];
    const stepIndex = steps.indexOf(step);

    return (
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 1 }}>
                {/* Progress */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Setting up your profile</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Step {stepIndex + 1} of {steps.length}</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
                    </div>
                </div>

                <div className="glass-card animate-fade-in" style={{ padding: 40 }}>
                    {/* Welcome Step */}
                    {step === 'welcome' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 72, marginBottom: 24 }}>👋</div>
                            <h1 className="heading-xl" style={{ marginBottom: 16 }}>
                                Welcome, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
                                Let's personalize your learning experience. We'll set up your profile so our AI can create the perfect study plan just for you.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                                {[
                                    { icon: '🤖', title: 'AI-Powered', desc: 'Personalized to your level' },
                                    { icon: '📊', title: 'Track Progress', desc: 'See your growth daily' },
                                    { icon: '🎯', title: 'Targeted Practice', desc: 'Focus on weak areas' },
                                    { icon: '🔥', title: 'Stay Motivated', desc: 'Streaks & achievements' },
                                ].map(f => (
                                    <div key={f.title} style={{
                                        padding: '16px',
                                        background: 'rgba(99,102,241,0.06)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'left',
                                    }}>
                                        <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.title}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary btn-lg w-full" onClick={() => setStep('info')}>
                                Let's Get Started →
                            </button>
                        </div>
                    )}

                    {/* Info Step */}
                    {step === 'info' && (
                        <div>
                            <h1 className="heading-xl" style={{ marginBottom: 8 }}>Your Academic Level</h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
                                What class or grade are you currently in?
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                                {CLASSES.map(cls => (
                                    <button
                                        key={cls}
                                        onClick={() => setSelectedClass(cls)}
                                        style={{
                                            padding: '14px 18px',
                                            background: selectedClass === cls ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${selectedClass === cls ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            color: selectedClass === cls ? 'var(--primary-300)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontWeight: selectedClass === cls ? 600 : 400,
                                            fontSize: 14,
                                            transition: 'all 0.15s',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {cls}
                                        {selectedClass === cls && <span style={{ fontSize: 18 }}>✓</span>}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-secondary" onClick={() => setStep('welcome')}>← Back</button>
                                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep('subjects')} disabled={!selectedClass}>
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Subjects Step */}
                    {step === 'subjects' && (
                        <div>
                            <h1 className="heading-xl" style={{ marginBottom: 8 }}>Select Your Subjects</h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
                                Choose the subjects you're studying. You can always add more later.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                                {ALL_SUBJECTS.map(sub => {
                                    const selected = selectedSubjects.includes(sub.id);
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => toggleSubject(sub.id)}
                                            style={{
                                                padding: '16px',
                                                background: selected ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${selected ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.15s',
                                                position: 'relative',
                                            }}
                                        >
                                            {selected && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    width: 20,
                                                    height: 20,
                                                    background: 'var(--grad-primary)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 11,
                                                    color: 'white',
                                                }}>✓</span>
                                            )}
                                            <div style={{ fontSize: 28, marginBottom: 8 }}>{sub.emoji}</div>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: selected ? 'var(--primary-300)' : 'var(--text-primary)', marginBottom: 4 }}>{sub.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{sub.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-secondary" onClick={() => setStep('info')}>← Back</button>
                                <button
                                    className="btn btn-primary btn-lg"
                                    style={{ flex: 1 }}
                                    onClick={() => setStep('done')}
                                    disabled={selectedSubjects.length === 0}
                                >
                                    {selectedSubjects.length > 0 ? `Continue with ${selectedSubjects.length} subjects →` : 'Select at least one →'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Done Step */}
                    {step === 'done' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
                            <h1 className="heading-xl" style={{ marginBottom: 16 }}>You're all set!</h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.7 }}>
                                Your personalized learning dashboard is ready. Our AI has analyzed your profile and prepared a customized study plan for you.
                            </p>
                            <div style={{
                                padding: '20px',
                                background: 'rgba(99,102,241,0.08)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 32,
                                textAlign: 'left',
                            }}>
                                <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>📋</span> Your Profile Summary
                                </div>
                                <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div>👤 <strong style={{ color: 'var(--text-primary)' }}>Name:</strong> {user?.name}</div>
                                    <div>🎓 <strong style={{ color: 'var(--text-primary)' }}>Class:</strong> {selectedClass}</div>
                                    <div>📚 <strong style={{ color: 'var(--text-primary)' }}>Subjects:</strong> {selectedSubjects.length} subjects selected</div>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-lg w-full" onClick={handleFinish} disabled={loading}>
                                {loading ? <><span className="loading-spinner" /> Setting up your dashboard...</> : '🚀 Go to Dashboard'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
