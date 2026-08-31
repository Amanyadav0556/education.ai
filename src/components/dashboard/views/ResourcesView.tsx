'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

type ResourceTab = 'notes' | 'pdfs' | 'videos' | 'flashcards';

// ─── Mock data per subject ────────────────────────────────────────────────────

function getNotes(subjectName: string) {
    return [
        { id: '1', title: `${subjectName} Core Concepts`, date: 'Sep 1', preview: `Key concepts and formulas for ${subjectName}. Essential definitions, theorems, and worked examples...`, tags: ['formulas', 'concepts'] },
        { id: '2', title: `${subjectName} Quick Reference`, date: 'Aug 28', preview: `Quick reference sheet for ${subjectName}. Important rules, patterns, and methods summarized...`, tags: ['revision', 'summary'] },
    ];
}

function getPdfs(subjectName: string) {
    return [
        { id: '1', title: `${subjectName} NCERT Textbook`, size: '3.2 MB', pages: 48 },
        { id: '2', title: `${subjectName} Formula Handbook`, size: '1.1 MB', pages: 18 },
        { id: '3', title: `${subjectName} Past Papers`, size: '2.6 MB', pages: 36 },
    ];
}

function getVideos(subjectName: string) {
    return [
        { id: '1', title: `Introduction to ${subjectName}`, duration: '18:32', views: '12.4K' },
        { id: '2', title: `${subjectName} Core Concepts Explained`, duration: '24:10', views: '8.7K' },
        { id: '3', title: `${subjectName} Problem Solving Techniques`, duration: '31:20', views: '6.1K' },
    ];
}

function getFlashcards(subjectName: string) {
    return [
        { id: '1', front: `What is the fundamental principle of ${subjectName}?`, back: `The fundamental principle of ${subjectName} involves systematic analysis and application of core theorems. Mastery requires understanding both theory and application through practice.` },
        { id: '2', front: `Name a key formula used in ${subjectName}.`, back: `Key formulas in ${subjectName} serve as tools for solving problems. Learning formulas in context—understanding their derivation—leads to deeper mastery.` },
        { id: '3', front: `What is the most common mistake students make in ${subjectName}?`, back: `The most common mistake is memorizing without understanding. Always connect new concepts to what you already know and test yourself with practice problems.` },
    ];
}

// ─── Flashcard Component ─────────────────────────────────────────────────────

function FlashcardPanel({ subjectName }: { subjectName: string }) {
    const cards = getFlashcards(subjectName);
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const total = cards.length;
    const card = cards[current];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Card {current + 1} of {total}</span>
                <span className="badge badge-primary">{subjectName}</span>
            </div>

            <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(!flipped)} style={{ marginBottom: 24 }}>
                <div className="flashcard-inner" style={{ minHeight: 240 }}>
                    <div className="flashcard-front" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 240 }}>
                        <div style={{ fontSize: 36, marginBottom: 16 }}>🤔</div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.5 }}>{card.front}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Click to reveal answer</p>
                    </div>
                    <div className="flashcard-back" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 240, background: 'rgba(99,102,241,0.08)', borderColor: 'var(--primary-500)' }}>
                        <div style={{ fontSize: 36, marginBottom: 16 }}>💡</div>
                        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)' }}>{card.back}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => { setCurrent((c) => (c - 1 + total) % total); setFlipped(false); }}>← Prev</button>
                <button className="btn btn-secondary" onClick={() => setFlipped(f => !f)}>{flipped ? '🔄 Question' : '💡 Answer'}</button>
                <button className="btn btn-primary" onClick={() => { setCurrent((c) => (c + 1) % total); setFlipped(false); }}>Next →</button>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ResourcesView() {
    const { activeSubject, changeSubject } = useApp();
    const [activeTab, setActiveTab] = useState<ResourceTab>('notes');

    if (!activeSubject) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📖</div>
                <h2 className="heading-xl" style={{ marginBottom: 12 }}>No subject selected</h2>
                <button className="btn btn-primary btn-lg" onClick={changeSubject}>Choose a Subject →</button>
            </div>
        );
    }

    const notes = getNotes(activeSubject.name);
    const pdfs = getPdfs(activeSubject.name);
    const videos = getVideos(activeSubject.name);

    return (
        <div>
            {/* Header with active subject */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{
                    width: 48, height: 48, borderRadius: 13,
                    background: activeSubject.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    boxShadow: `0 4px 14px ${activeSubject.color}40`,
                }}>{activeSubject.emoji}</div>
                <div>
                    <h1 className="heading-xl">{activeSubject.name} Resources</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Notes, PDFs, videos and flashcards</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="tab-list" style={{ marginBottom: 28, maxWidth: 480 }}>
                {(['notes', 'pdfs', 'videos', 'flashcards'] as ResourceTab[]).map(t => (
                    <button key={t} className={`tab-item${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t === 'notes' ? '📝 Notes' : t === 'pdfs' ? '📄 PDFs' : t === 'videos' ? '🎥 Videos' : '🃏 Flashcards'}
                    </button>
                ))}
            </div>

            {/* Notes */}
            {activeTab === 'notes' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 className="heading-md">📝 {activeSubject.name} Notes</h2>
                        <button className="btn btn-primary btn-sm">+ New Note</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {notes.map(note => (
                            <div key={note.id} className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{note.title}</h3>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                            <span className="badge badge-primary">📚 {activeSubject.name}</span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{note.date}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="btn btn-ghost btn-sm">✏️ Edit</button>
                                        <button className="btn btn-ghost btn-sm">🗑️</button>
                                    </div>
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{note.preview}</p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    {note.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: 11, padding: '2px 10px', background: 'rgba(99,102,241,0.1)', borderRadius: 100, color: 'var(--primary-300)' }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PDFs */}
            {activeTab === 'pdfs' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 className="heading-md">📄 {activeSubject.name} Study Materials</h2>
                        <button className="btn btn-primary btn-sm">⬆️ Upload PDF</button>
                    </div>
                    <div className="grid-2">
                        {pdfs.map(pdf => (
                            <div key={pdf.id} className="glass-card" style={{ padding: '20px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{
                                        width: 48, height: 60, flexShrink: 0,
                                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                                    }}>📄</div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{pdf.title}</h3>
                                        <span className="badge badge-primary" style={{ display: 'inline-block', marginBottom: 4 }}>{activeSubject.name}</span>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pdf.pages} pages · {pdf.size}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>📖 Read</button>
                                    <button className="btn btn-secondary btn-sm">⬇️ Download</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Videos */}
            {activeTab === 'videos' && (
                <div>
                    <h2 className="heading-md" style={{ marginBottom: 16 }}>🎥 {activeSubject.name} Video Lessons</h2>
                    <div className="grid-2">
                        {videos.map(video => (
                            <div key={video.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                                <div style={{
                                    height: 160,
                                    background: `linear-gradient(135deg, ${activeSubject.color}25, ${activeSubject.color}10)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                                }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                                        backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)',
                                    }}>▶️</div>
                                    <div style={{ position: 'absolute', bottom: 10, right: 10 }} className="badge badge-primary">⏱ {video.duration}</div>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{video.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="badge badge-primary">{activeSubject.name}</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>👁 {video.views} views</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Flashcards */}
            {activeTab === 'flashcards' && (
                <div className="grid-2" style={{ gap: 28 }}>
                    <div>
                        <h2 className="heading-md" style={{ marginBottom: 20 }}>🃏 {activeSubject.name} Flashcards</h2>
                        <FlashcardPanel subjectName={activeSubject.name} />
                    </div>
                    <div>
                        <h2 className="heading-md" style={{ marginBottom: 16 }}>📚 All Flashcards</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {getFlashcards(activeSubject.name).map((card, i) => (
                                <div key={card.id} style={{ padding: '14px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>Card {i + 1}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{card.front}</div>
                                        </div>
                                        <span className="badge badge-primary">{activeSubject.name}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>+ Add Flashcard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
