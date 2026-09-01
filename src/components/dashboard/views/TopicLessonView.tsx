'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TopicLesson, GeneratedVisual } from '@/lib/ai/types';
import { useApp } from '@/context/AppContext';
import { classifySimulation } from '@/lib/simulations/classifier';
import SimulationViewer from '@/components/simulations/SimulationViewer';
import StepSimulator from '@/components/simulations/StepSimulator';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
    topic: string;
    chapter: string;
    subjectId: string;
    subjectName: string;
    subjectEmoji: string;
    onBack: () => void;
    onPractice?: () => void;
    onAsk?: () => void;
    topicCompleted?: boolean;
    topicWeak?: boolean;
}

type LoadStage =
    | 'idle'
    | 'understanding'
    | 'retrieving'
    | 'generating'
    | 'validating'
    | 'visual_generating'
    | 'complete'
    | 'error';

const STAGE_MESSAGES: Record<LoadStage, string> = {
    idle: '',
    understanding: 'Understanding topic context...',
    retrieving: 'Finding reliable learning material...',
    generating: 'Creating your personalised lesson...',
    validating: 'Checking facts and accuracy...',
    visual_generating: 'Creating visual learning pages...',
    complete: 'Lesson ready!',
    error: 'Something went wrong.',
};

const STAGE_PROGRESS: Record<LoadStage, number> = {
    idle: 0,
    understanding: 10,
    retrieving: 25,
    generating: 50,
    validating: 70,
    visual_generating: 88,
    complete: 100,
    error: 0,
};

// ── Subcomponents ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--stone-800)',
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>{title}</h2>
            {children}
        </div>
    );
}

function FormulaBox({ formula, meaning, variables }: {
    formula: string;
    meaning: string;
    variables: { symbol: string; meaning: string; unit?: string }[];
}) {
    return (
        <div style={{
            padding: '16px 20px',
            background: 'var(--stone-800)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 12,
        }}>
            <div style={{
                fontFamily: 'monospace',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--cream-50)',
                marginBottom: 8,
                letterSpacing: '0.04em',
            }}>{formula}</div>
            <div style={{ fontSize: 13, color: 'rgba(247,242,232,0.65)', marginBottom: 10 }}>{meaning}</div>
            {variables.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {variables.map(v => (
                        <span key={v.symbol} style={{
                            padding: '3px 10px',
                            background: 'rgba(247,242,232,0.1)',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: 11,
                            color: 'rgba(247,242,232,0.75)',
                        }}>
                            <strong style={{ color: 'var(--cream-50)' }}>{v.symbol}</strong> = {v.meaning}{v.unit ? ` (${v.unit})` : ''}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function ConceptCard({ title, explanation }: { title: string; explanation: string }) {
    return (
        <div style={{
            padding: '14px 18px',
            background: 'var(--cream-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--stone-800)',
        }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: 'var(--stone-800)' }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explanation}</div>
        </div>
    );
}

function StepCard({ step, title, explanation }: { step: number; title: string; explanation: string }) {
    return (
        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--stone-800)',
                color: 'var(--cream-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, flexShrink: 0,
                fontFamily: 'Playfair Display, serif',
            }}>{step}</div>
            <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: 'var(--stone-800)' }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explanation}</div>
            </div>
        </div>
    );
}

// ── Visual Carousel ───────────────────────────────────────────────────────────

function VisualCarousel({ visuals }: { visuals: GeneratedVisual[] }) {
    const [current, setCurrent] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const visual = visuals[current];
    if (!visual) return null;

    return (
        <Section title="🖼️ Visual Learning">
            <div style={{
                background: 'var(--cream-50)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
            }}>
                {/* Visual header */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}>
                    <span style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 15, fontWeight: 600,
                        flex: 1, color: 'var(--stone-800)',
                    }}>{visual.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {current + 1} / {visuals.length}
                    </span>
                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 12 }}
                        title="Fullscreen"
                    >⛶</button>
                </div>

                {/* SVG Visual */}
                <div
                    style={{
                        padding: fullscreen ? 0 : '20px',
                        background: '#F2EDE4',
                        display: 'flex',
                        justifyContent: 'center',
                        position: fullscreen ? 'fixed' : 'relative',
                        inset: fullscreen ? 0 : undefined,
                        zIndex: fullscreen ? 1000 : undefined,
                        alignItems: fullscreen ? 'center' : undefined,
                        backdropFilter: fullscreen ? 'blur(8px)' : undefined,
                    }}
                    onClick={fullscreen ? () => setFullscreen(false) : undefined}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: fullscreen ? '80vw' : '100%',
                            maxHeight: fullscreen ? '80vh' : undefined,
                        }}
                        dangerouslySetInnerHTML={{ __html: visual.svgContent }}
                    />
                </div>

                {/* Caption */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                }}>
                    <span style={{ fontWeight: 500, color: 'var(--stone-800)' }}>Learning objective:</span>{' '}
                    {visual.learningObjective}
                    {visual.caption && (
                        <div style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            👀 Notice: {visual.caption}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={current === 0}
                        onClick={() => setCurrent(c => c - 1)}
                    >← Previous</button>

                    {/* Dots */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        {visuals.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                style={{
                                    width: i === current ? 20 : 8, height: 8,
                                    borderRadius: 4,
                                    background: i === current ? 'var(--stone-800)' : 'var(--border-medium)',
                                    border: 'none', cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    padding: 0,
                                }}
                            />
                        ))}
                    </div>

                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={current === visuals.length - 1}
                        onClick={() => setCurrent(c => c + 1)}
                    >Next →</button>
                </div>
            </div>
        </Section>
    );
}

// ── Loading Screen ────────────────────────────────────────────────────────────

function LoadingScreen({ stage }: { stage: LoadStage }) {
    const progress = STAGE_PROGRESS[stage];
    const message = STAGE_MESSAGES[stage];

    return (
        <div style={{
            padding: '60px 40px',
            background: 'var(--cream-50)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'var(--stone-800)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, margin: '0 auto 24px',
            }}>🤖</div>

            <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem', fontWeight: 600,
                color: 'var(--stone-800)', marginBottom: 8,
            }}>Generating Your Lesson</h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                {message}
            </p>

            {/* Progress bar */}
            <div style={{ maxWidth: 300, margin: '0 auto 12px', height: 4, background: 'var(--cream-300)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${progress}%`,
                    background: 'var(--stone-800)',
                    borderRadius: 100,
                    transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                }} />
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{progress}%</div>

            {/* Stage indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
                {(['understanding', 'retrieving', 'generating', 'validating', 'visual_generating'] as LoadStage[]).map(s => (
                    <div key={s} style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: 10,
                        fontWeight: 500,
                        background: STAGE_PROGRESS[s] <= progress ? 'var(--stone-800)' : 'var(--cream-200)',
                        color: STAGE_PROGRESS[s] <= progress ? 'var(--cream-50)' : 'var(--text-muted)',
                        transition: 'all 0.3s',
                        textTransform: 'capitalize',
                    }}>
                        {STAGE_PROGRESS[s] <= progress ? '✓ ' : ''}{s.replace('_', ' ')}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Feedback Bar ──────────────────────────────────────────────────────────────

function FeedbackBar({ lessonId }: { lessonId: string }) {
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const sendFeedback = async (helpful: boolean, detail?: string) => {
        setSending(true);
        try {
            await fetch('/api/ai/lesson-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, helpful, detail }),
            });
        } catch { /* silent */ } finally {
            setSent(true);
            setSending(false);
        }
    };

    if (sent) return (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>
            ✓ Thank you for your feedback!
        </div>
    );

    return (
        <div style={{
            padding: '20px 24px',
            background: 'var(--cream-200)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
        }}>
            <p style={{ fontWeight: 500, marginBottom: 14, color: 'var(--stone-800)', fontSize: 14 }}>
                Was this explanation helpful?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
                <button className="btn btn-primary btn-sm" onClick={() => sendFeedback(true)} disabled={sending}>👍 Yes</button>
                <button className="btn btn-secondary btn-sm" onClick={() => sendFeedback(false)} disabled={sending}>👎 No</button>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                    ['too_difficult', 'Too difficult'],
                    ['too_simple', 'Too simple'],
                    ['visual_didnt_help', "Visual didn't help"],
                    ['need_more_examples', 'Need more examples'],
                ].map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => sendFeedback(false, val)}
                        disabled={sending}
                        style={{
                            padding: '4px 12px',
                            background: 'transparent',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: 11,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--stone-800)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                    >{label}</button>
                ))}
            </div>
        </div>
    );
}

// ── Main TopicLessonView ──────────────────────────────────────────────────────

export default function TopicLessonView({
    topic, chapter, subjectId, subjectName, subjectEmoji,
    onBack, onPractice, onAsk, topicCompleted, topicWeak,
}: Props) {
    const { user } = useApp();
    const [stage, setStage] = useState<LoadStage>('idle');
    const [lesson, setLesson] = useState<TopicLesson | null>(null);
    const [visuals, setVisuals] = useState<GeneratedVisual[]>([]);
    const [error, setError] = useState('');

    const simMatch = useMemo(() => classifySimulation(topic, chapter, subjectName), [topic, chapter, subjectName]);

    const generateLesson = useCallback(async () => {
        setError('');
        setLesson(null);
        setVisuals([]);

        setStage('understanding');
        await sleep(400);
        setStage('retrieving');
        await sleep(500);
        setStage('generating');

        try {
            const res = await fetch('/api/ai/topic-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subjectName,
                    subjectId,
                    chapter,
                    topic,
                    userLevel: 'beginner',
                }),
            });

            setStage('validating');
            await sleep(300);

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? 'Generation failed');
            }

            const data = await res.json();
            setStage('visual_generating');
            await sleep(400);

            setLesson(data.lesson);
            setVisuals(data.visuals ?? []);
            setStage('complete');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to generate lesson');
            setStage('error');
        }
    }, [topic, chapter, subjectId, subjectName]);

    // Auto-generate on mount
    useEffect(() => {
        generateLesson();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topic, chapter, subjectId]);

    const isLoading = !['complete', 'error', 'idle'].includes(stage);

    return (
        <div className="animate-fade-in">
            {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                <button onClick={onBack} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 13, padding: 0,
                    fontFamily: 'DM Sans, sans-serif',
                }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--stone-800)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >{subjectEmoji} {subjectName}</button>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>›</span>
                <button onClick={onBack} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 13, padding: 0,
                    fontFamily: 'DM Sans, sans-serif',
                }}>{chapter}</button>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>›</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--stone-800)', fontFamily: 'DM Sans, sans-serif' }}>{topic}</span>
                {lesson?.metadata.cached && <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--sage-100)', color: 'var(--sage-600)', borderRadius: 100, border: '1px solid var(--sage-200)' }}>cached</span>}
            </div>

            {/* ── Topic Header ──────────────────────────────────────────────── */}
            <div style={{
                padding: '24px 28px',
                background: 'var(--stone-800)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(ellipse 70% 80% at 90% 50%, rgba(61,84,69,0.25) 0%, transparent 60%)',
                }} />
                <div style={{ position: 'relative' }}>
                    <div className="eyebrow" style={{ color: 'rgba(247,242,232,0.4)', marginBottom: 10 }}>
                        {subjectName} · {chapter}
                    </div>
                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 600,
                        color: 'var(--cream-50)',
                        marginBottom: 12,
                        letterSpacing: '-0.015em',
                    }}>{topic}</h1>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {lesson && (
                            <>
                                <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(247,242,232,0.1)', color: 'rgba(247,242,232,0.65)', borderRadius: 100 }}>
                                    {lesson.category.replace(/_/g, ' ')}
                                </span>
                                <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(61,84,69,0.4)', color: 'rgba(196,212,202,0.9)', borderRadius: 100 }}>
                                    {Math.round(lesson.metadata.confidence * 100)}% confidence
                                </span>
                                <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(247,242,232,0.06)', color: 'rgba(247,242,232,0.45)', borderRadius: 100 }}>
                                    {lesson.metadata.source === 'hybrid' ? '🔍 AI + Knowledge Base' : '🤖 AI Generated'}
                                </span>
                            </>
                        )}
                        {topicWeak && <span className="badge badge-warning">⚠ Weak Area</span>}
                        {topicCompleted && <span className="badge badge-success">✓ Completed</span>}
                    </div>
                </div>
            </div>

            {/* ── Loading ──────────────────────────────────────────────────────── */}
            {isLoading && <LoadingScreen stage={stage} />}

            {/* ── Error ────────────────────────────────────────────────────────── */}
            {stage === 'error' && (
                <div style={{
                    padding: '24px', background: 'var(--terra-100)',
                    border: '1px solid rgba(139,74,53,0.2)', borderRadius: 'var(--radius-xl)',
                    textAlign: 'center', marginBottom: 24,
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                    <p style={{ color: 'var(--terra-600)', marginBottom: 16, fontSize: 14 }}>{error}</p>
                    <button className="btn btn-primary" onClick={generateLesson}>↺ Try Again</button>
                </div>
            )}

            {/* ── Lesson Content ───────────────────────────────────────────────── */}
            {lesson && stage === 'complete' && (
                <div>
                    {/* Definition */}
                    <Section title="📖 Definition">
                        <div style={{
                            padding: '18px 22px',
                            background: 'var(--cream-50)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            borderLeft: '4px solid var(--stone-800)',
                            fontSize: 15, lineHeight: 1.75,
                            color: 'var(--stone-800)',
                            fontFamily: 'Playfair Display, serif',
                            fontStyle: 'italic',
                        }}>
                            {lesson.definition}
                        </div>
                    </Section>

                    {/* Simple Explanation */}
                    <Section title="💡 Simple Explanation">
                        <div style={{
                            padding: '18px 22px',
                            background: 'var(--sage-100)',
                            border: '1px solid var(--sage-200)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: 14, lineHeight: 1.8,
                            color: 'var(--stone-700)',
                        }}>
                            {lesson.simpleExplanation}
                        </div>
                    </Section>

                    {/* Detailed Theory */}
                    {lesson.detailedTheory.length > 0 && (
                        <Section title="📚 Detailed Theory">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {lesson.detailedTheory.map((para, i) => (
                                    <div key={i} style={{
                                        fontSize: 14, lineHeight: 1.8,
                                        color: 'var(--text-secondary)',
                                        padding: '14px 18px',
                                        background: 'var(--cream-50)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: 'var(--radius-md)',
                                    }}>{para}</div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Key Concepts */}
                    {lesson.keyConcepts.length > 0 && (
                        <Section title="🔑 Key Concepts">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                                {lesson.keyConcepts.map((c, i) => (
                                    <ConceptCard key={i} title={c.title} explanation={c.explanation} />
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Formulas */}
                    {lesson.formulas.length > 0 && (
                        <Section title="⚗️ Formulas & Equations">
                            {lesson.formulas.map((f, i) => (
                                <FormulaBox key={i} formula={f.formula} meaning={f.meaning} variables={f.variables} />
                            ))}
                        </Section>
                    )}

                    {/* Components */}
                    {lesson.components && lesson.components.length > 0 && (
                        <Section title="🔧 Components / Materials">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                                {lesson.components.map((c, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px',
                                        background: 'var(--cream-50)',
                                        border: '1px solid var(--border-subtle)',
                                        borderRadius: 'var(--radius-md)',
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: 'var(--stone-800)' }}>{c.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.purpose}</div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Steps */}
                    {lesson.steps && lesson.steps.length > 0 && (
                        <Section title="📋 Step-by-Step Process">
                            {lesson.steps.map(s => (
                                <StepCard key={s.step} step={s.step} title={s.title} explanation={s.explanation} />
                            ))}
                        </Section>
                    )}

                    {/* Visual Learning */}
                    {visuals.length > 0 && <VisualCarousel visuals={visuals} />}

                    {/* Interactive Simulation (if matched) */}
                    {simMatch.id !== 'none' && (
                        <Section title={`🔬 Interactive Lab: ${simMatch.label}`}>
                            <SimulationViewer simId={simMatch.id} />
                        </Section>
                    )}

                    {/* Interactive step walkthrough — subject-agnostic, works for any topic with a sequence */}
                    {lesson.steps && lesson.steps.length >= 2 && (
                        <Section title="🔄 Interactive Walkthrough">
                            <StepSimulator steps={lesson.steps} topic={topic} />
                        </Section>
                    )}

                    {/* Real World Example */}
                    <Section title="🌍 Real-World Example">
                        <div style={{
                            padding: '18px 22px',
                            background: 'var(--cream-50)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            fontSize: 14, lineHeight: 1.8,
                            color: 'var(--stone-700)',
                        }}>
                            {lesson.example}
                        </div>
                    </Section>

                    {/* Key Takeaways */}
                    <Section title="✅ Key Takeaways">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {lesson.keyTakeaways.map((t, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: 12,
                                    padding: '12px 16px',
                                    background: 'var(--cream-50)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: 'var(--stone-800)',
                                        color: 'var(--cream-50)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1,
                                    }}>{i + 1}</div>
                                    <span style={{ fontSize: 14, color: 'var(--stone-700)', lineHeight: 1.6 }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Action buttons */}
                    <div style={{
                        display: 'flex', gap: 12, flexWrap: 'wrap',
                        padding: '20px 0', borderTop: '1px solid var(--border-subtle)',
                        marginBottom: 24,
                    }}>
                        <button className="btn btn-primary" onClick={onAsk} style={{ gap: 8 }}>
                            🤖 Ask Personal AI
                        </button>
                        <button className="btn btn-secondary" onClick={onPractice}>
                            ✍️ Practice This Topic
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={generateLesson} style={{ marginLeft: 'auto', fontSize: 12 }}>
                            ↺ Regenerate Lesson
                        </button>
                    </div>

                    {/* Feedback */}
                    <FeedbackBar lessonId={lesson.metadata.cacheKey} />
                </div>
            )}
        </div>
    );
}

function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}
