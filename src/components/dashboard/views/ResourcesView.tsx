'use client';
import { useState } from 'react';

const NOTES = [
    { id: '1', title: "Newton's Laws Summary", subject: 'Physics', date: 'Sep 1', preview: "Three fundamental laws: Inertia, F=ma, Action-Reaction. Key formulas: F=ma, p=mv, W=Fd...", tags: ['mechanics', 'formulas'] },
    { id: '2', title: "Integration Techniques", subject: 'Mathematics', date: 'Aug 30', preview: "Substitution, integration by parts, partial fractions. ∫sin(x)dx=-cos(x)+C...", tags: ['calculus', 'integration'] },
    { id: '3', title: "Atomic Structure Notes", subject: 'Chemistry', date: 'Aug 28', preview: "Bohr model: electrons in discrete energy levels. Quantum numbers: n, l, ml, ms...", tags: ['atoms', 'structure'] },
];

const PDFS = [
    { id: '1', title: 'Physics NCERT Chapter 5', subject: 'Physics', size: '2.4 MB', pages: 34 },
    { id: '2', title: 'Mathematics Formulas Handbook', subject: 'Mathematics', size: '1.1 MB', pages: 18 },
    { id: '3', title: 'Chemistry Reactions Guide', subject: 'Chemistry', size: '3.2 MB', pages: 48 },
    { id: '4', title: 'World History Timeline', subject: 'History', size: '1.8 MB', pages: 26 },
];

const VIDEOS = [
    { id: '1', title: 'Understanding Relative Motion', subject: 'Physics', duration: '14:32', views: '12.4K' },
    { id: '2', title: 'Limits & Derivatives Explained', subject: 'Mathematics', duration: '22:18', views: '8.7K' },
    { id: '3', title: 'Periodic Table Deep Dive', subject: 'Chemistry', duration: '18:45', views: '15.2K' },
    { id: '4', title: 'World War II - Complete Overview', subject: 'History', duration: '31:20', views: '6.9K' },
];

const FLASHCARDS = [
    {
        id: '1', subject: 'Physics', front: "What is Newton's 2nd Law?", back: "F = ma\n\nForce equals mass times acceleration. The acceleration of an object is directly proportional to the net force and inversely proportional to its mass."
    },
    {
        id: '2', subject: 'Mathematics', front: "What is the derivative of sin(x)?", back: "d/dx[sin(x)] = cos(x)\n\nRemember: derivative of sin is cos, and derivative of cos is -sin."
    },
    {
        id: '3', subject: 'Chemistry', front: "What is the atomic number of Oxygen?", back: "Atomic Number = 8\n\nOxygen has 8 protons and 8 electrons. Its electronic configuration is 2,6."
    },
];

type ResourceTab = 'notes' | 'pdfs' | 'videos' | 'flashcards';

function FlashcardComponent() {
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const card = FLASHCARDS[currentCard];
    const total = FLASHCARDS.length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Card {currentCard + 1} of {total}</span>
                <span className="badge badge-primary">{card.subject}</span>
            </div>

            <div
                className={`flashcard${flipped ? ' flipped' : ''}`}
                onClick={() => setFlipped(!flipped)}
                style={{ marginBottom: 24 }}
            >
                <div className="flashcard-inner" style={{ minHeight: 240 }}>
                    {/* Front */}
                    <div className="flashcard-front" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 240 }}>
                        <div style={{ fontSize: 36, marginBottom: 16 }}>🤔</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{card.front}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 16 }}>Click to reveal answer</p>
                    </div>

                    {/* Back */}
                    <div className="flashcard-back" style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 240, background: 'rgba(99,102,241,0.08)', borderColor: 'var(--primary-500)' }}>
                        <div style={{ fontSize: 36, marginBottom: 16 }}>💡</div>
                        <p style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-line', color: 'var(--text-primary)' }}>{card.back}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => { setCurrentCard((c) => (c - 1 + total) % total); setFlipped(false); }}
                >← Prev</button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setFlipped(f => !f)}
                >{flipped ? '🔄 Show Question' : '💡 Show Answer'}</button>
                <button
                    className="btn btn-primary"
                    onClick={() => { setCurrentCard((c) => (c + 1) % total); setFlipped(false); }}
                >Next →</button>
            </div>
        </div>
    );
}

export default function ResourcesView() {
    const [activeTab, setActiveTab] = useState<ResourceTab>('notes');

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="heading-xl" style={{ marginBottom: 8 }}>Resources</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Access notes, PDFs, video lessons, and flashcards for all your subjects.</p>
            </div>

            {/* Tab */}
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
                        <h2 className="heading-md">📝 My Notes</h2>
                        <button className="btn btn-primary btn-sm">+ New Note</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {NOTES.map(note => (
                            <div key={note.id} className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{note.title}</h3>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <span className="badge badge-primary">📚 {note.subject}</span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>{note.date}</span>
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
                        <h2 className="heading-md">📄 Study Materials</h2>
                        <button className="btn btn-primary btn-sm">⬆️ Upload PDF</button>
                    </div>
                    <div className="grid-2">
                        {PDFS.map(pdf => (
                            <div key={pdf.id} className="glass-card" style={{ padding: '20px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: 48,
                                        height: 60,
                                        background: 'rgba(239,68,68,0.15)',
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: 10,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 24,
                                        flexShrink: 0,
                                    }}>📄</div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, lineHeight: 1.4 }}>{pdf.title}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{pdf.subject}</span>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pdf.pages} pages · {pdf.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h2 className="heading-md">🎥 Video Lessons</h2>
                    </div>
                    <div className="grid-2">
                        {VIDEOS.map(video => (
                            <div key={video.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                                {/* Thumbnail */}
                                <div style={{
                                    height: 160,
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                }}>
                                    <div style={{
                                        width: 56,
                                        height: 56,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 24,
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        transition: 'transform 0.2s',
                                    }}>▶️</div>
                                    <div style={{ position: 'absolute', bottom: 10, right: 10 }} className="badge badge-primary">
                                        ⏱ {video.duration}
                                    </div>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>{video.title}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="badge badge-primary">{video.subject}</span>
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
                        <h2 className="heading-md" style={{ marginBottom: 20 }}>🃏 Flashcard Study</h2>
                        <FlashcardComponent />
                    </div>
                    <div>
                        <h2 className="heading-md" style={{ marginBottom: 16 }}>📚 All Flashcards</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {FLASHCARDS.map((card, i) => (
                                <div key={card.id} style={{
                                    padding: '14px 18px',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600 }}>Card {i + 1}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{card.front}</div>
                                        </div>
                                        <span className="badge badge-primary">{card.subject}</span>
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
