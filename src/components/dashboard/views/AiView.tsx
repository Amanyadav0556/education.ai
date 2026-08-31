'use client';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

type AiMode = 'chat' | 'explain' | 'generate' | 'recommend';

function buildQuickPrompts(subjectName: string) {
    return [
        { label: `⚡ Explain a ${subjectName} concept`, msg: `Explain a key concept in ${subjectName} in simple terms with examples` },
        { label: `📐 Solve a ${subjectName} problem`, msg: `Help me solve a typical ${subjectName} problem step by step` },
        { label: `🎯 Generate 5 ${subjectName} questions`, msg: `Generate 5 multiple choice questions on ${subjectName} at medium difficulty` },
        { label: `📖 Study plan for ${subjectName}`, msg: `Create a 2-week study plan for ${subjectName} to improve my mastery` },
        { label: `📊 Analyze my weak areas`, msg: `Based on my progress in ${subjectName}, what should I focus on to improve?` },
        { label: `🗓️ Today's revision`, msg: `What should I revise in ${subjectName} today to maximize learning?` },
    ];
}

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', gap: 4, padding: '12px 16px', alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--primary-400)',
                    animation: 'typing-bounce 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                }} />
            ))}
            <style>{`
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
        </div>
    );
}

function ChatMessage({ msg }: { msg: { id: string; role: string; content: string; timestamp: Date } }) {
    const isUser = msg.role === 'user';
    return (
        <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
            {!isUser && (
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, marginRight: 10, flexShrink: 0, alignSelf: 'flex-end',
                }}>🤖</div>
            )}
            <div className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
                <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{msg.content}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            {isUser && (
                <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, marginLeft: 10, flexShrink: 0, alignSelf: 'flex-end',
                    fontWeight: 700, color: 'white',
                }}>U</div>
            )}
        </div>
    );
}

export default function AiView() {
    const { chatMessages, sendAiMessage, clearChat, aiLoading, activeSubject, changeSubject } = useApp();
    const [input, setInput] = useState('');
    const [activeMode, setActiveMode] = useState<AiMode>('chat');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const quickPrompts = buildQuickPrompts(activeSubject?.name ?? 'your subject');

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, aiLoading]);

    const handleSend = async () => {
        const msg = input.trim();
        if (!msg || aiLoading) return;
        setInput('');
        await sendAiMessage(msg);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 140px)' }}>
            {/* Sidebar */}
            <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Active Subject Context */}
                {activeSubject && (
                    <div style={{
                        padding: '16px',
                        background: `linear-gradient(135deg, ${activeSubject.color}18, ${activeSubject.color}08)`,
                        border: `1px solid ${activeSubject.color}35`,
                        borderRadius: 'var(--radius-lg)',
                    }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 8 }}>
                            🎯 AI Context
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 24 }}>{activeSubject.emoji}</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{activeSubject.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All AI responses use this context</div>
                            </div>
                        </div>
                        <button
                            className="btn btn-ghost btn-sm"
                            style={{ marginTop: 10, width: '100%', fontSize: 12 }}
                            onClick={changeSubject}
                        >🔄 Change Subject</button>
                    </div>
                )}

                {/* AI Modes */}
                <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)' }}>
                    <h3 className="heading-md" style={{ marginBottom: 16 }}>🤖 AI Modes</h3>
                    {([
                        { id: 'chat' as AiMode, icon: '💬', label: 'Doubt Solving', desc: 'Ask any question' },
                        { id: 'explain' as AiMode, icon: '📖', label: 'Explain Topic', desc: 'Deep explanations' },
                        { id: 'generate' as AiMode, icon: '✍️', label: 'Generate Questions', desc: 'Practice creation' },
                        { id: 'recommend' as AiMode, icon: '🎯', label: 'Recommendations', desc: 'Personalized plans' },
                    ]).map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setActiveMode(mode.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                                padding: '10px 12px',
                                background: activeMode === mode.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                                border: `1px solid ${activeMode === mode.id ? 'var(--primary-500)' : 'transparent'}`,
                                borderRadius: 'var(--radius-md)', cursor: 'pointer', marginBottom: 6, textAlign: 'left', transition: 'all 0.15s',
                            }}
                        >
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{mode.icon}</span>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: activeMode === mode.id ? 'var(--primary-300)' : 'var(--text-primary)' }}>{mode.label}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mode.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Quick Prompts */}
                <div style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', flex: 1, overflowY: 'auto' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Prompts</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {quickPrompts.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(p.msg)}
                                style={{
                                    padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', lineHeight: 1.5,
                                }}
                                onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--primary-500)'; (e.currentTarget).style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border-subtle)'; (e.currentTarget).style.color = 'var(--text-secondary)'; }}
                            >{p.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--grad-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        boxShadow: '0 0 20px rgba(99,102,241,0.4)', animation: 'pulse-glow 3s infinite',
                    }}>🤖</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                            EduAI — {activeSubject ? activeSubject.name : 'General'} Tutor
                        </div>
                        <div style={{ fontSize: 12, color: '#6ee7b7' }}>● Online · Ready to help</div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        {activeSubject && <span className="badge badge-primary">{activeSubject.emoji} {activeSubject.name}</span>}
                        <button className="btn btn-ghost btn-sm" onClick={clearChat}>🗑️ Clear</button>
                    </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {chatMessages.map(msg => (
                        <ChatMessage key={msg.id} msg={msg} />
                    ))}
                    {aiLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: 4 }}>
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask anything about ${activeSubject?.name ?? 'your subject'}... (Enter to send)`}
                            style={{
                                flex: 1, padding: '12px 16px',
                                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
                                fontFamily: 'Inter, sans-serif', fontSize: 14, resize: 'none',
                                outline: 'none', lineHeight: 1.5, minHeight: 48, maxHeight: 120, transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary-500)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                            rows={1}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSend}
                            disabled={!input.trim() || aiLoading}
                            style={{ alignSelf: 'flex-end', padding: '12px 20px' }}
                        >
                            {aiLoading ? <span className="loading-spinner" /> : '🚀 Send'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        {['Explain this concept', 'Give me an example', 'Make 3 questions', 'Simplify this'].map(s => (
                            <button
                                key={s}
                                onClick={() => setInput(s)}
                                style={{
                                    padding: '4px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                                    borderRadius: 100, fontSize: 11, color: 'var(--primary-300)', cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >{s}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
