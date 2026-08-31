'use client';
import { useState } from 'react';
import { useApp, Subject, Chapter, Topic } from '@/context/AppContext';

function TopicExplanation({ topic, subject }: { topic: Topic; subject: Subject }) {
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [shown, setShown] = useState(false);

    const generateExplanation = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500));
        setExplanation(`🎓 **AI Explanation: ${topic.title}**\n\nHere's a comprehensive breakdown of this topic:\n\n**Core Concept:**\n${topic.title} is a fundamental concept in ${subject.name} that forms the basis for advanced understanding. The key principles involve systematic analysis and application of formulas.\n\n**Key Points:**\n• ${topic.title} follows from first principles\n• Mathematical derivation involves step-by-step reasoning\n• Real-world applications are numerous\n• Common mistakes to avoid: rushing through basics\n\n**Example Problem:**\nLet's say we have a scenario involving ${topic.title}. We can solve it by applying the core formula and substituting known values. The answer helps us understand the physical meaning.\n\n**Remember:** Practice is key! Try at least 5 problems on this topic.`);
        setLoading(false);
        setShown(true);
    };

    return (
        <div style={{ marginTop: 16 }}>
            {!shown ? (
                <button
                    className="btn btn-primary"
                    onClick={generateExplanation}
                    disabled={loading}
                >
                    {loading ? <><span className="loading-spinner" /> Generating AI Explanation...</> : '🤖 Get AI Explanation'}
                </button>
            ) : (
                <div style={{
                    padding: '20px',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 'var(--radius-lg)',
                    animation: 'fade-in 0.4s ease',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 24 }}>🤖</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary-300)' }}>AI Explanation</span>
                        <span style={{ marginLeft: 'auto' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShown(false)}>✕</button>
                        </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {explanation}
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm">📌 Save Note</button>
                        <button className="btn btn-secondary btn-sm">🎯 Practice This</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function LearningView() {
    const { subjects, selectedSubject, setSelectedSubject, selectedChapter, setSelectedChapter, selectedTopic, setSelectedTopic } = useApp();

    // Drill-down: Subject → Chapter → Topic → Explanation
    if (selectedTopic && selectedSubject) {
        return (
            <div>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: 'var(--text-muted)' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSelectedTopic(null); setSelectedChapter(null); setSelectedSubject(null); }}>📚 Subjects</button>
                    <span>›</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSelectedTopic(null); setSelectedChapter(null); }}>{selectedSubject.emoji} {selectedSubject.name}</button>
                    <span>›</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedTopic(null)}>{selectedChapter?.title}</button>
                    <span>›</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedTopic.title}</span>
                </div>

                <div style={{
                    padding: '28px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ fontSize: 36 }}>{selectedSubject.emoji}</div>
                        <div>
                            <h1 className="heading-xl">{selectedTopic.title}</h1>
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{selectedSubject.name} · {selectedChapter?.title}</div>
                        </div>
                        {selectedTopic.weak && <span className="badge badge-danger" style={{ marginLeft: 'auto' }}>⚠️ Weak Area</span>}
                        {selectedTopic.completed && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>✅ Completed</span>}
                    </div>

                    <div className="divider" />

                    <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
                        This topic covers the fundamental concepts of <strong>{selectedTopic.title}</strong> within {selectedSubject.name}.
                        Mastering this will help you solve related problems in exams and understand advanced topics.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
                        <div className="badge badge-primary">📚 {selectedSubject.name}</div>
                        <div className="badge badge-primary">📖 {selectedChapter?.title}</div>
                        <div className={`badge ${selectedTopic.completed ? 'badge-success' : 'badge-warning'}`}>
                            {selectedTopic.completed ? '✅ Completed' : '🔄 In Progress'}
                        </div>
                    </div>

                    <TopicExplanation topic={selectedTopic} subject={selectedSubject} />
                </div>
            </div>
        );
    }

    if (selectedChapter && selectedSubject) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: 'var(--text-muted)' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setSelectedChapter(null); setSelectedSubject(null); }}>📚 Subjects</button>
                    <span>›</span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedChapter(null)}>{selectedSubject.emoji} {selectedSubject.name}</button>
                    <span>›</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedChapter.title}</span>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h1 className="heading-xl" style={{ marginBottom: 8 }}>{selectedChapter.title}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{selectedChapter.topics.length} topics · {selectedChapter.topics.filter(t => t.completed).length} completed</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedChapter.topics.map((topic, i) => (
                        <div
                            key={topic.id}
                            className="glass-card"
                            style={{
                                padding: '18px 20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                animationDelay: `${i * 0.07}s`,
                            }}
                            onClick={() => setSelectedTopic(topic)}
                        >
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: topic.completed ? 'var(--grad-success)' : topic.weak ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                flexShrink: 0,
                            }}>
                                {topic.completed ? '✅' : topic.weak ? '⚠️' : `${i + 1}`}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{topic.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {topic.completed ? 'Completed' : topic.weak ? 'Needs practice' : 'Not started'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                {topic.weak && <span className="badge badge-danger">Weak</span>}
                                <span style={{ color: 'var(--text-muted)' }}>›</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (selectedSubject) {
        const completedChapters = selectedSubject.chapters.filter(c => c.completed).length;
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: 'var(--text-muted)' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedSubject(null)}>📚 Subjects</button>
                    <span>›</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedSubject.emoji} {selectedSubject.name}</span>
                </div>

                <div style={{
                    padding: '28px',
                    background: `linear-gradient(135deg, ${selectedSubject.color}20, transparent)`,
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 24,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ fontSize: 56 }}>{selectedSubject.emoji}</div>
                        <div style={{ flex: 1 }}>
                            <h1 className="heading-xl">{selectedSubject.name}</h1>
                            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                                <span className="badge badge-primary">{selectedSubject.chapters.length} Chapters</span>
                                <span className="badge badge-success">{completedChapters} Completed</span>
                                <span className="badge badge-purple">Mastery: {selectedSubject.mastery}%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Overall Progress</span>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedSubject.progress}%</span>
                        </div>
                        <div className="progress-container" style={{ height: 8 }}>
                            <div className="progress-bar" style={{ width: `${selectedSubject.progress}%`, background: selectedSubject.gradient }} />
                        </div>
                    </div>
                </div>

                <h2 className="heading-md" style={{ marginBottom: 16 }}>Chapters</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {selectedSubject.chapters.map((chapter, i) => {
                        const completedTopics = chapter.topics.filter(t => t.completed).length;
                        return (
                            <div
                                key={chapter.id}
                                className="glass-card"
                                style={{
                                    padding: '20px 24px',
                                    cursor: 'pointer',
                                    animationDelay: `${i * 0.08}s`,
                                }}
                                onClick={() => setSelectedChapter(chapter)}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: chapter.completed ? 'var(--grad-success)' : selectedSubject.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 22,
                                        flexShrink: 0,
                                        opacity: chapter.completed ? 1 : 0.8,
                                    }}>
                                        {chapter.completed ? '✅' : `${i + 1}`}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <h3 style={{ fontWeight: 700, fontSize: 15 }}>{chapter.title}</h3>
                                            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{completedTopics}/{chapter.topics.length} topics ›</span>
                                        </div>
                                        <div className="progress-container" style={{ height: 4, marginBottom: 10 }}>
                                            <div className="progress-bar" style={{ width: `${(completedTopics / chapter.topics.length) * 100}%`, background: selectedSubject.gradient }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {chapter.topics.slice(0, 3).map(t => (
                                                <span key={t.id} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 100 }}>
                                                    {t.title}
                                                </span>
                                            ))}
                                            {chapter.topics.length > 3 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{chapter.topics.length - 3} more</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Subject List
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="heading-xl" style={{ marginBottom: 8 }}>Your Subjects</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Select a subject to explore chapters, topics, and AI explanations</p>
            </div>

            <div className="grid-3 stagger-children">
                {subjects.map(sub => {
                    const totalTopics = sub.chapters.reduce((acc, c) => acc + c.topics.length, 0);
                    const completedTopics = sub.chapters.reduce((acc, c) => acc + c.topics.filter(t => t.completed).length, 0);

                    return (
                        <div
                            key={sub.id}
                            className="subject-card"
                            onClick={() => setSelectedSubject(sub)}
                            style={{
                                borderColor: 'var(--border-subtle)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = sub.color;
                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${sub.color}30`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
                                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: 14,
                                background: sub.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 28,
                                marginBottom: 16,
                                boxShadow: `0 4px 16px ${sub.color}40`,
                            }}>
                                {sub.emoji}
                            </div>
                            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{sub.name}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                                {sub.chapters.length} chapters · {totalTopics} topics
                            </p>
                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completedTopics}/{totalTopics} topics done</span>
                                    <span style={{ fontSize: 12, fontWeight: 600 }}>{sub.progress}%</span>
                                </div>
                                <div className="progress-container" style={{ height: 4 }}>
                                    <div className="progress-bar" style={{ width: `${sub.progress}%`, background: sub.gradient }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <span className="badge badge-purple">Mastery {sub.mastery}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
