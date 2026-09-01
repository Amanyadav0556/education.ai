'use client';
import { useApp } from '@/context/AppContext';
import TopicLessonView from './TopicLessonView';

// ── Breadcrumb helper ──────────────────────────────────────────────────────────

function Crumb({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >{label}</button>
    );
}

// ─ Main Component ─────────────────────────────────────────────────────────────

export default function LearningView() {
    const {
        activeSubject,
        changeSubject,
        learningSubject, setLearningSubject,
        selectedChapter, setSelectedChapter,
        selectedTopic, setSelectedTopic,
    } = useApp();

    // The "current" subject for learning drill-down is always the activeSubject.
    // learningSubject is used to track drill-down state without overriding activeSubject.
    const subject = activeSubject;

    if (!subject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No subject selected</h2>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const clearDrilldown = () => {
        setSelectedTopic(null);
        setSelectedChapter(null);
        setLearningSubject(null);
    };

    // ── Topic View — Full AI Lesson ───────────────────────────────────────────
    if (selectedTopic && selectedChapter) {
        return (
            <TopicLessonView
                topic={selectedTopic.title}
                chapter={selectedChapter.title}
                subjectId={subject.id}
                subjectName={subject.name}
                subjectEmoji={subject.emoji}
                topicCompleted={selectedTopic.completed}
                topicWeak={selectedTopic.weak}
                onBack={() => setSelectedTopic(null)}
                onPractice={() => {
                    setSelectedTopic(null);
                    setSelectedChapter(null);
                }}
                onAsk={() => {
                    setSelectedTopic(null);
                    setSelectedChapter(null);
                }}
            />
        );
    }

    // ── Chapter View ──────────────────────────────────────────────────────────
    if (selectedChapter) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                    <Crumb label={`${subject.emoji} ${subject.name}`} onClick={() => setSelectedChapter(null)} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>›</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>{selectedChapter.title}</span>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <h1 className="heading-xl" style={{ marginBottom: 6 }}>{selectedChapter.title}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedChapter.topics.length} topics · {selectedChapter.topics.filter(t => t.completed).length} completed
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedChapter.topics.map((topic, i) => (
                        <div
                            key={topic.id}
                            className="glass-card"
                            style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
                            onClick={() => setSelectedTopic(topic)}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                                background: topic.completed ? 'var(--grad-success)' : topic.weak ? 'rgba(239,68,68,0.2)' : `${subject.color}20`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                            }}>
                                {topic.completed ? '✅' : topic.weak ? '⚠️' : i + 1}
                            </div>
                            <div style={{ flex: 1 }}>
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

    // ── Subject Chapter List ───────────────────────────────────────────────────
    const completedChapters = subject.chapters.filter(c => c.completed).length;
    const totalTopics = subject.chapters.reduce((a, c) => a + c.topics.length, 0);
    const completedTopics = subject.chapters.reduce((a, c) => a + c.topics.filter(t => t.completed).length, 0);

    return (
        <div>
            {/* Subject Header */}
            <div style={{
                padding: '28px',
                background: `linear-gradient(135deg, ${subject.color}18, transparent)`,
                border: `1px solid ${subject.color}30`,
                borderRadius: 'var(--radius-xl)',
                marginBottom: 28,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: subject.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, flexShrink: 0,
                        boxShadow: `0 6px 20px ${subject.color}50`,
                    }}>{subject.emoji}</div>
                    <div style={{ flex: 1 }}>
                        <h1 className="heading-xl" style={{ marginBottom: 8 }}>{subject.name}</h1>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span className="badge badge-primary">{subject.chapters.length} Chapters</span>
                            <span className="badge badge-success">{completedChapters} Completed</span>
                            <span className="badge badge-purple">Mastery: {subject.mastery}%</span>
                            <span className="badge badge-primary">{completedTopics}/{totalTopics} Topics Done</span>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: 480 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Overall Progress</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{subject.progress}%</span>
                    </div>
                    <div className="progress-container" style={{ height: 8 }}>
                        <div className="progress-bar" style={{ width: `${subject.progress}%`, background: subject.gradient }} />
                    </div>
                </div>
            </div>

            <h2 className="heading-md" style={{ marginBottom: 16 }}>Chapters</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {subject.chapters.map((chapter, i) => {
                    const done = chapter.topics.filter(t => t.completed).length;
                    const pct = Math.round((done / chapter.topics.length) * 100);
                    return (
                        <div
                            key={chapter.id}
                            className="glass-card"
                            style={{ padding: '20px 24px', cursor: 'pointer', animationDelay: `${i * 0.08}s` }}
                            onClick={() => setSelectedChapter(chapter)}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                                    background: chapter.completed ? 'var(--grad-success)' : subject.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 22, opacity: chapter.completed ? 1 : 0.85,
                                }}>
                                    {chapter.completed ? '✅' : i + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <h3 style={{ fontWeight: 700, fontSize: 15 }}>{chapter.title}</h3>
                                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{done}/{chapter.topics.length} topics ›</span>
                                    </div>
                                    <div className="progress-container" style={{ height: 4, marginBottom: 10 }}>
                                        <div className="progress-bar" style={{ width: `${pct}%`, background: subject.gradient }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {chapter.topics.slice(0, 3).map(t => (
                                            <span key={t.id} style={{
                                                fontSize: 11, color: 'var(--text-muted)',
                                                background: 'rgba(255,255,255,0.04)',
                                                padding: '2px 8px', borderRadius: 100,
                                            }}>{t.title}</span>
                                        ))}
                                        {chapter.topics.length > 3 && (
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{chapter.topics.length - 3} more</span>
                                        )}
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
