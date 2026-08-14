const fs = require('fs');

const code = `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    BrainCircuit, MessageSquare, Calendar, Target,
    CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight,
    Play, ChevronRight, Activity, Clock
} from 'lucide-react';
import api from '../../services/api';

export default function LearningTwin() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTopic, setActiveTopic] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const { data } = await api.get('/twin/insights');
                setInsights(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch insights", err);
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    // Variants for animation
    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' } } };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20 relative font-sans">

                {/* Header & Hero */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-bg-surface/80 to-bg-surface p-8 rounded-[32px] border border-border-base shadow-sm backdrop-blur-md">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 text-primary border border-primary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            AI Engine Synchronized
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-text-main leading-tight mb-2">Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Twin</span></h1>
                        <p className="text-text-sub font-medium max-w-xl text-lg">Your personalized AI mirror. It learns exactly how you study, traces your knowledge gaps, and dynamically builds your optimal path forward.</p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <Link to="/coach" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 px-6 rounded-2xl font-bold transition-all shadow-lg shadow-primary/25 active:scale-95">
                            <MessageSquare size={18} /> Chat with Twin
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-bg-surface hover:bg-bg-surface-hover border border-border-strong text-text-main py-3.5 px-6 rounded-2xl font-bold transition-all active:scale-95">
                            <Calendar size={18} /> View Routine
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>
                ) : !insights?.hasData ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="bg-bg-surface p-12 text-center rounded-[32px] border border-border-base shadow-sm">
                        <BrainCircuit size={48} className="mx-auto text-primary opacity-50 mb-6" />
                        <h2 className="text-2xl font-black text-text-main mb-3">Your Learning Twin is still learning about you.</h2>
                        <p className="text-text-sub font-medium max-w-lg mx-auto mb-8">Complete a few more practice questions and we'll dynamically identify your strongest and weakest topics here.</p>
                        <Link to="/practice" className="inline-flex items-center justify-center gap-2 bg-text-main text-bg-base py-3 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95">
                            <Play size={16} /> Start Practice
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
                        
                        {/* 1. Summary Cards */}
                        <section>
                            <h2 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                                <Target className="text-primary" size={24} /> Your Learning Insights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div variants={itemVariants} className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl flex items-center justify-between">
                                    <div>
                                        <h3 className="text-green-700 dark:text-green-400 font-extrabold text-lg mb-1">Strong Topics</h3>
                                        <p className="text-green-600/80 font-bold">{insights.summary.strong} Topics</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/20 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle2 size={24} /></div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex items-center justify-between">
                                    <div>
                                        <h3 className="text-blue-700 dark:text-blue-400 font-extrabold text-lg mb-1">Improving</h3>
                                        <p className="text-blue-600/80 font-bold">{insights.summary.improving} Topics</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 text-blue-600 rounded-2xl flex items-center justify-center"><Activity size={24} /></div>
                                </motion.div>
                                <motion.div variants={itemVariants} className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex items-center justify-between">
                                    <div>
                                        <h3 className="text-amber-700 dark:text-amber-400 font-extrabold text-lg mb-1">Needs Attention</h3>
                                        <p className="text-amber-600/80 font-bold">{insights.summary.weak} Topics</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-500/20 text-amber-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
                                </motion.div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* LEFT: Topics tracking (Weak & Strong) */}
                            <div className="lg:col-span-2 space-y-12">
                                
                                {/* Focus On */}
                                {insights.topics.filter(t => t.category === "Weak" || t.category === "Improving").length > 0 && (
                                    <section>
                                        <h3 className="text-lg font-black text-text-main mb-4 flex items-center gap-2">🎯 Topics You Should Focus On</h3>
                                        <div className="space-y-4">
                                            {insights.topics.filter(t => t.category === "Weak" || (t.category === "Improving" && !t.isImproving)).map((topic) => (
                                                <motion.div key={topic.topicName} variants={itemVariants} className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setActiveTopic(topic)}>
                                                    
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                            <h4 className="font-extrabold text-text-main text-lg">{topic.topicName}</h4>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className={\`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg \${topic.priority === 'HIGH PRIORITY' ? 'text-red-700 bg-red-100 dark:bg-red-900/30' : 'text-amber-700 bg-amber-100 dark:bg-amber-900/30'}\`}>
                                                                {topic.priority}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Accuracy</p>
                                                            <p className="text-xl font-black text-text-main">{topic.accuracy}%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Strength</p>
                                                            <p className="text-xl font-black text-text-main">{topic.category}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Improvement</p>
                                                            {topic.previousAccuracy !== null ? (
                                                                <p className="text-sm font-bold flex items-center gap-1">
                                                                    <span className="text-text-sub">{topic.previousAccuracy}% → {topic.accuracy}%</span>
                                                                    {topic.isImproving && <span className="text-green-500 flex items-center"><ArrowUpRight size={14}/> You're improving!</span>}
                                                                    {topic.isDeclining && <span className="text-red-500 flex items-center"><ArrowDownRight size={14}/> Needs revision</span>}
                                                                </p>
                                                            ) : (
                                                                <p className="text-sm font-bold text-text-sub">More data needed</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {topic.commonMistakes?.length > 0 && (
                                                        <div className="bg-red-50/50 dark:bg-red-950/10 p-4 rounded-2xl border border-red-100/50 dark:border-red-900/20 mb-4">
                                                            <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">You've struggled with questions like:</p>
                                                            <ul className="space-y-1.5">
                                                                {topic.commonMistakes.map((mistake, i) => (
                                                                    <li key={i} className="text-xs font-medium text-text-sub flex items-start gap-2">
                                                                        <span className="text-red-400 mt-0.5">•</span> {mistake}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    <Link to={\`/practice?topic=\${encodeURIComponent(topic.topicName)}\`} className="inline-flex items-center justify-center w-full gap-2 bg-bg-surface-hover hover:bg-primary hover:text-white border border-border-strong py-2.5 rounded-xl text-xs font-bold transition-all" onClick={e => e.stopPropagation()}>
                                                        Practice Topic <ChevronRight size={14} />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                            
                                            {/* Improving ones */}
                                            {insights.topics.filter(t => t.category === "Improving" && t.isImproving).map((topic) => (
                                                <motion.div key={topic.topicName} variants={itemVariants} className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setActiveTopic(topic)}>
                                                    
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                            <h4 className="font-extrabold text-text-main text-lg">{topic.topicName}</h4>
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg text-blue-700 bg-blue-100 dark:bg-blue-900/30 w-max">
                                                            📈 You're Improving
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Accuracy</p>
                                                            <p className="text-xl font-black text-text-main">{topic.accuracy}%</p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">History</p>
                                                            {topic.previousAccuracy !== null && (
                                                                <p className="text-sm font-bold flex items-center gap-1">
                                                                    <span className="text-text-sub">{topic.previousAccuracy}% → {topic.accuracy}%</span>
                                                                    <span className="text-green-500 flex items-center"><ArrowUpRight size={14}/> +{topic.accuracy - topic.previousAccuracy}%</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Strong Topics */}
                                {insights.topics.filter(t => t.category === "Strong" || t.category === "Good").length > 0 && (
                                    <section>
                                        <h3 className="text-lg font-black text-text-main mb-4 flex items-center gap-2">🏆 Your Strong Topics</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {insights.topics.filter(t => t.category === "Strong" || t.category === "Good").map((topic) => (
                                                <motion.div key={topic.topicName} variants={itemVariants} className="bg-bg-surface p-5 rounded-3xl border border-border-base shadow-sm cursor-pointer hover:border-green-500/40 transition-colors" onClick={() => setActiveTopic(topic)}>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                        <h4 className="font-extrabold text-text-main">{topic.topicName}</h4>
                                                    </div>
                                                    <div className="flex justify-between items-end mb-3">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Accuracy</p>
                                                            <p className="text-2xl font-black text-text-main">{topic.accuracy}%</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-md">{topic.category}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-medium text-text-sub mb-4">You've consistently performed well.</p>
                                                    <Link to={\`/practice?topic=\${encodeURIComponent(topic.topicName)}\`} className="inline-flex items-center justify-center w-full gap-2 bg-bg-surface-hover hover:bg-bg-surface text-text-main border border-border-strong py-2 rounded-lg text-[11px] font-bold transition-all" onClick={e => e.stopPropagation()}>
                                                        Continue Practicing
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                            </div>

                            {/* RIGHT: Recommended For You */}
                            <div className="lg:col-span-1">
                                <section className="sticky top-8">
                                    <h3 className="text-lg font-black text-text-main mb-4 flex items-center gap-2">💡 Recommended for You</h3>
                                    
                                    <div className="bg-gradient-to-br from-bg-surface-hover to-bg-surface p-6 rounded-3xl border border-border-base shadow-sm space-y-4">
                                        {insights.recommendations?.length > 0 ? (
                                            insights.recommendations.map((rec, i) => (
                                                <div key={i} className="bg-bg-surface p-5 rounded-2xl border border-border-strong relative">
                                                    <div className="absolute -left-3 -top-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-md">{i + 1}</div>
                                                    <h4 className="font-bold text-text-main mb-2">{rec.topicName} {rec.difficulty}</h4>
                                                    
                                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-4">
                                                        <p className="text-xs font-medium text-text-sub"><span className="font-bold text-primary">Reason:</span> {rec.reason}</p>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-text-muted flex items-center gap-1"><Clock size={12}/> {rec.timeEstimate}</span>
                                                        <Link to={\`/practice?topic=\${encodeURIComponent(rec.topicName)}\`} className="text-[11px] font-bold bg-text-main text-bg-base px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                                                            Start
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm font-medium text-text-sub text-center py-8">Keep practicing! We will generate personalized recommendations here.</p>
                                        )}
                                    </div>
                                </section>
                            </div>

                        </div>
                    </motion.div>
                )}

                {/* MODAL: Topic Detail View */}
                <AnimatePresence>
                    {activeTopic && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveTopic(null)} />
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-bg-surface w-full max-w-lg rounded-[32px] border border-border-base shadow-2xl relative z-10 overflow-hidden">
                                
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-black text-text-main mb-1">{activeTopic.topicName}</h2>
                                            <div className="flex items-center gap-2">
                                                <span className={\`text-xs font-bold px-2 py-1 rounded-md \${activeTopic.category==='Strong'||activeTopic.category==='Good' ? 'bg-green-100 text-green-700' : activeTopic.category==='Weak' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}\`}>Strength: {activeTopic.category}</span>
                                                <span className="text-xs font-bold text-text-muted">Score: {activeTopic.strengthScore}/100</span>
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 rounded-full border-4 border-bg-surface-hover flex items-center justify-center relative">
                                            <span className="text-lg font-black text-text-main">{activeTopic.accuracy}%</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-bg-surface-hover p-4 rounded-2xl text-center border border-border-base">
                                            <p className="text-[10px] font-black text-text-muted uppercase mb-1">Questions</p>
                                            <p className="font-black text-text-main">{activeTopic.attempts}</p>
                                        </div>
                                        <div className="bg-green-500/10 p-4 rounded-2xl text-center border border-green-500/20">
                                            <p className="text-[10px] font-black text-green-700/70 uppercase mb-1">Correct</p>
                                            <p className="font-black text-green-700">{activeTopic.correct}</p>
                                        </div>
                                        <div className="bg-red-500/10 p-4 rounded-2xl text-center border border-red-500/20">
                                            <p className="text-[10px] font-black text-red-700/70 uppercase mb-1">Incorrect</p>
                                            <p className="font-black text-red-700">{activeTopic.incorrect}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-border-base">
                                            <span className="text-sm font-bold text-text-sub">Average Time per Question</span>
                                            <span className="text-sm font-black text-text-main">{activeTopic.averageTime} sec</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-border-base">
                                            <span className="text-sm font-bold text-text-sub">Recent Performance</span>
                                            <span className="text-sm font-black text-text-main">
                                                {activeTopic.previousAccuracy !== null ? \`\${topic.isImproving ? 'Improving' : 'Needs Work'}\` : 'Not enough data'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <p className="text-xs font-black uppercase text-text-muted mb-3 flex items-center gap-2"><Target size={14}/> Recommended Action</p>
                                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between">
                                            <p className="text-sm font-bold text-primary max-w-[200px]">Revise {activeTopic.topicName}</p>
                                            <Link to={\`/practice?topic=\${encodeURIComponent(activeTopic.topicName)}\`} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all">Start Practice</Link>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setActiveTopic(null)} className="absolute top-6 right-6 text-text-muted hover:text-text-main bg-bg-surface-hover p-2 rounded-full">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </DashboardLayout>
    );
}
`;
fs.writeFileSync('frontend/src/pages/Analytics/LearningTwin.jsx', code);
