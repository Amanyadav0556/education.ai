import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    BrainCircuit, Target, CheckCircle2, AlertCircle, ArrowUpRight,
    ArrowRight, Activity, TrendingUp, Sparkles, X, ChevronRight, PlayCircle, Clock
} from 'lucide-react';
import api from '../../services/api';

export default function LearningTwin() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTopic, setActiveTopic] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [insightRes] = await Promise.all([
                    api.get('/twin/insights')
                ]);
                setInsights(insightRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch", err);
                setError(true);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-w-5xl mx-auto space-y-8 pb-20 mt-4 px-4 sm:px-0">
                    <div className="h-32 bg-bg-surface border border-border-base rounded-[24px] animate-pulse"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="h-28 bg-bg-surface border border-border-base rounded-2xl animate-pulse"></div>
                        <div className="h-28 bg-bg-surface border border-border-base rounded-2xl animate-pulse"></div>
                        <div className="h-28 bg-bg-surface border border-border-base rounded-2xl animate-pulse"></div>
                        <div className="h-28 bg-bg-surface border border-border-base rounded-2xl animate-pulse"></div>
                    </div>
                    <div className="h-64 bg-bg-surface border border-border-base rounded-[24px] animate-pulse"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto py-20 text-center">
                    <AlertCircle size={48} className="mx-auto text-red-500 opacity-80 mb-6" />
                    <h2 className="text-2xl font-bold text-text-main mb-3">We couldn't load your learning insights.</h2>
                    <button onClick={() => window.location.reload()} className="bg-[#4f46e5] text-white font-bold px-8 py-3 rounded-xl mt-4">Try Again</button>
                </div>
            </DashboardLayout>
        );
    }

    if (!insights?.hasData) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto py-20 text-center bg-bg-surface border border-border-base rounded-[32px] mt-8 shadow-sm p-12">
                    <BrainCircuit size={48} className="mx-auto text-[#4f46e5] opacity-80 mb-6" />
                    <h2 className="text-3xl font-black text-text-main mb-4">Your Learning Twin is getting to know you.</h2>
                    <p className="text-text-sub font-medium max-w-lg mx-auto mb-8 text-lg">Complete a few more questions and we'll identify your strengths and areas that need practice.</p>
                    <Link to="/practice" className="inline-flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white py-3.5 px-8 rounded-xl font-bold transition-all shadow-sm active:scale-95">
                        Start Practice
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const { summary, topics, recommendations } = insights;

    // Sort logic
    const weakTopics = [...topics].filter(t => t.category === "Weak" || t.category === "Improving").sort((a, b) => a.accuracy - b.accuracy);
    const strongTopics = [...topics].filter(t => t.category === "Good" || t.category === "Strong").sort((a, b) => b.accuracy - a.accuracy);
    const improvingTopics = topics.filter(t => t.isImproving);

    const focusTopic = weakTopics.length > 0 ? weakTopics[0] : null;

    // Overall Progress Estimate
    const avgScore = topics.length > 0 ? Math.round(topics.reduce((sum, t) => sum + t.strengthScore, 0) / topics.length) : 0;

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-4 px-4 sm:px-0">

                {/* 2. Hero Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-strong">
                    <div>
                        <h1 className="text-3xl font-black text-text-main mb-2">Your Learning Twin</h1>
                        <p className="text-text-sub font-medium text-[15px] max-w-xl">Understand your progress and discover what you should focus on next.</p>

                        <div className="mt-4 flex items-center gap-2 text-sm font-bold bg-[#4f46e5]/10 text-[#4f46e5] border border-[#4f46e5]/20 px-4 py-2 rounded-xl w-fit">
                            <Sparkles size={16} />
                            {improvingTopics.length > 0 && weakTopics.length > 0 ?
                                `You're improving in ${improvingTopics[0].topicName}, but ${weakTopics[0].topicName} needs more practice.` :
                                `Your twin is tracking ${topics.length} specific topics.`
                            }
                        </div>
                    </div>
                    <div className="flex shrink-0">
                        <button onClick={() => navigate('/learning-twin/deep-analysis')} className="bg-bg-surface-hover hover:bg-border-base border border-border-strong text-text-main font-bold px-6 py-3 rounded-xl transition-colors shadow-sm text-[13px]">
                            Deep Analysis
                        </button>
                    </div>
                </div>

                {/* 3. Performance Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-sm">
                        <div className="text-text-muted mb-3"><Activity size={20} /></div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-1">Overall Progress</p>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black text-text-main shrink-0 leading-none">{avgScore}%</p>
                        </div>
                        <div className="w-full bg-bg-surface-hover h-1.5 mt-4 rounded-full overflow-hidden flex">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${avgScore}%` }} transition={{ duration: 1 }} className="bg-[#4f46e5] h-full rounded-full"></motion.div>
                        </div>
                    </div>
                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-sm">
                        <div className="text-green-500 mb-3"><CheckCircle2 size={20} /></div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-1">Strong Topics</p>
                        <p className="text-3xl font-black text-text-main leading-none">{summary.strong}</p>
                    </div>
                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-sm">
                        <div className="text-amber-500 mb-3"><TrendingUp size={20} /></div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-1">Improving</p>
                        <p className="text-3xl font-black text-text-main leading-none">{summary.improving}</p>
                    </div>
                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-sm">
                        <div className="text-red-500 mb-3"><AlertCircle size={20} /></div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-1">Needs Attention</p>
                        <p className="text-3xl font-black text-text-main leading-none">{summary.weak}</p>
                    </div>
                </div>

                {/* 4. Focus Next (Most Important) */}
                {focusTopic && (
                    <div>
                        <h2 className="text-[15px] p-2 pl-0 font-black text-text-main mb-2 flex items-center gap-2">
                            🎯 Focus Next
                        </h2>
                        <div className="bg-bg-surface p-8 lg:p-10 rounded-[28px] border-2 border-[#4f46e5]/30 shadow-sm relative overflow-hidden group hover:border-[#4f46e5] transition-colors cursor-pointer" onClick={() => setActiveTopic(focusTopic)}>
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none text-[#4f46e5]">
                                <Target size={180} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-2xl">
                                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-4 border border-red-100">
                                        HIGH PRIORITY
                                    </span>
                                    <h3 className="text-3xl font-black text-text-main mb-2 tracking-tight">{focusTopic.topicName}</h3>
                                    <p className="text-xl font-bold text-red-600 mb-4">{focusTopic.accuracy}% Accuracy</p>
                                    <p className="text-text-sub font-bold text-[15px] leading-relaxed">
                                        {focusTopic.priorityReason || `You're struggling with ${focusTopic.topicName}. We recommend focused practice.`}
                                    </p>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    <Link to={`/practice?topic=${encodeURIComponent(focusTopic.topicName)}`} onClick={e => e.stopPropagation()} className="inline-flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95 whitespace-nowrap">
                                        Practice Now <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* 5. Weak Topics */}
                    <div className="space-y-4">
                        <h2 className="text-[15px] p-2 pl-0 font-black text-text-main mb-2">Topics That Need Attention</h2>
                        {weakTopics.slice(focusTopic ? 1 : 0, 4).map(topic => (
                            <div key={topic.topicName} onClick={() => setActiveTopic(topic)} className="bg-bg-surface p-6 rounded-[20px] border border-border-base hover:border-border-strong cursor-pointer transition-colors shadow-sm flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-extrabold text-text-main text-[15px] mb-1">{topic.topicName}</h4>
                                        <p className="text-xs font-bold text-text-muted">{topic.incorrect} incorrect out of {topic.attempts} attempts.</p>
                                    </div>
                                    <span className="bg-red-50/50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Weak</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-black text-text-main w-9">{topic.accuracy}%</div>
                                    <div className="flex-1 h-1.5 bg-bg-surface-hover rounded-full overflow-hidden flex">
                                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${topic.accuracy}%` }}></div>
                                    </div>
                                    <Link to={`/practice?topic=${encodeURIComponent(topic.topicName)}`} onClick={e => e.stopPropagation()} className="bg-bg-surface-hover hover:bg-border-base text-text-main px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Practice</Link>
                                </div>
                            </div>
                        ))}
                        {weakTopics.length === (focusTopic ? 1 : 0) && (
                            <div className="text-sm text-text-muted font-bold bg-bg-surface p-6 rounded-2xl border border-border-base text-center">No other weak topics detected right now.</div>
                        )}
                    </div>

                    {/* 8. Smart Recommendations */}
                    <div className="space-y-4">
                        <h2 className="text-[15px] p-2 pl-0 font-black text-text-main mb-2">Recommended For You</h2>
                        {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                            <div key={idx} className="bg-bg-surface p-6 rounded-[20px] border border-border-base shadow-sm hover:border-border-strong transition-colors cursor-pointer" onClick={() => navigate(`/practice?topic=${encodeURIComponent(rec.topicName)}`)}>
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-extrabold text-text-main text-[15px]">{rec.topicName}</h4>
                                    <span className="text-[10px] font-black text-text-main uppercase tracking-wider bg-bg-surface-hover border border-border-strong px-2 py-0.5 rounded">{rec.difficulty}</span>
                                </div>
                                <p className="text-[13px] font-medium text-text-sub mb-5 leading-relaxed">
                                    <span className="font-bold text-text-main">Why:</span> {rec.reason}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-text-muted flex items-center gap-1.5"><Clock size={14} /> {rec.timeEstimate}</span>
                                    <Link to={`/practice?topic=${encodeURIComponent(rec.topicName)}`} onClick={e => e.stopPropagation()} className="text-[#4f46e5] text-xs font-bold flex items-center gap-1 hover:underline">Start Learning <ChevronRight size={14} /></Link>
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-text-muted font-bold bg-bg-surface p-6 rounded-2xl border border-border-base text-center">Keep practicing to get specific recommendations!</div>
                        )}
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">

                    {/* 7. Improvement Section */}
                    <div className="space-y-4">
                        <h2 className="text-[15px] p-2 pl-0 font-black text-text-main mb-2">Your Progress</h2>
                        {improvingTopics.length > 0 ? improvingTopics.slice(0, 3).map(topic => {
                            const diff = topic.accuracy - (topic.previousAccuracy || (topic.accuracy - 5));
                            return (
                                <div key={topic.topicName} onClick={() => setActiveTopic(topic)} className="bg-bg-surface p-6 rounded-[20px] border border-border-base hover:border-border-strong cursor-pointer transition-colors shadow-sm flex items-center justify-between">
                                    <div>
                                        <h4 className="font-extrabold text-text-main text-[15px] mb-1.5">{topic.topicName}</h4>
                                        <div className="flex items-center gap-2 text-xs font-bold text-text-sub">
                                            {topic.previousAccuracy || (topic.accuracy - 5)}% <ArrowRight size={12} className="text-text-muted" /> {topic.accuracy}%
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[11px] font-black truncate flex items-center gap-1"><TrendingUp size={12} /> +{diff > 0 ? diff : 0}%</span>
                                        <span className="text-[10px] font-bold text-text-muted">You're improving!</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-sm text-text-muted font-bold bg-bg-surface p-6 rounded-2xl border border-border-base text-center">No recent improvements tracked yet. Keep practicing!</div>
                        )}
                    </div>

                    {/* 6. Strong Topics */}
                    <div className="space-y-4">
                        <h2 className="text-[15px] p-2 pl-0 font-black text-text-main mb-2">Your Strengths</h2>
                        {strongTopics.length > 0 ? strongTopics.slice(0, 3).map(topic => (
                            <div key={topic.topicName} onClick={() => setActiveTopic(topic)} className="bg-bg-surface p-6 rounded-[20px] border border-border-base hover:border-border-strong cursor-pointer transition-colors shadow-sm flex items-center justify-between">
                                <div>
                                    <h4 className="font-extrabold text-text-main text-[15px] mb-1.5">{topic.topicName}</h4>
                                    <p className="text-xs font-bold text-text-muted">You're consistently performing well.</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-green-600 font-black text-xl">{topic.accuracy}%</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-sm text-text-muted font-bold bg-bg-surface p-6 rounded-2xl border border-border-base text-center">Master basic topics to see them appear here!</div>
                        )}
                    </div>
                </div>

            </div>

            {/* 9. Topic Detail Modal */}
            <AnimatePresence>
                {activeTopic && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-bg-base/90 backdrop-blur-sm" onClick={() => setActiveTopic(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.4 }} className="bg-bg-surface w-full max-w-md rounded-[32px] border border-border-base shadow-2xl relative z-10 overflow-hidden">

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5">Topic Insight</p>
                                        <h2 className="text-2xl font-black text-text-main mb-2 tracking-tight">{activeTopic.topicName}</h2>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${activeTopic.category === 'Weak' ? 'bg-red-50 text-red-600 border-red-100' :
                                                activeTopic.category === 'Strong' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {activeTopic.category}
                                        </span>
                                    </div>
                                    <button onClick={() => setActiveTopic(null)} className="p-2 text-text-muted hover:text-text-main bg-bg-surface-hover rounded-xl border border-border-base transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-bg-surface-hover p-4 rounded-2xl border border-border-base text-center">
                                        <p className="text-[10px] font-black uppercase text-text-muted mb-1">Strength</p>
                                        <p className="text-lg font-black text-text-main">{activeTopic.strengthScore}<span className="text-xs text-text-muted">/100</span></p>
                                    </div>
                                    <div className="bg-bg-surface-hover p-4 rounded-2xl border border-border-base text-center">
                                        <p className="text-[10px] font-black uppercase text-text-muted mb-1">Accuracy</p>
                                        <p className="text-lg font-black text-text-main">{activeTopic.accuracy}%</p>
                                    </div>
                                    <div className="bg-bg-surface-hover p-4 rounded-2xl border border-border-base text-center">
                                        <p className="text-[10px] font-black uppercase text-text-muted mb-1">Questions</p>
                                        <p className="text-lg font-black text-text-main">{activeTopic.attempts}</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex justify-between items-center text-xs font-bold text-text-sub mb-2">
                                        <span>Correct: {activeTopic.correct}</span>
                                        <span>Incorrect: {activeTopic.incorrect}</span>
                                    </div>
                                    <div className="w-full flex h-2 rounded-full overflow-hidden bg-bg-surface-hover">
                                        <div className="bg-emerald-500 h-full" style={{ width: `${(activeTopic.correct / Math.max(1, activeTopic.attempts)) * 100}%` }}></div>
                                        <div className="bg-red-500 h-full" style={{ width: `${(activeTopic.incorrect / Math.max(1, activeTopic.attempts)) * 100}%` }}></div>
                                    </div>
                                </div>

                                {activeTopic.commonMistakes?.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">Common Mistakes</h4>
                                        <ul className="space-y-2">
                                            {activeTopic.commonMistakes.map((mistake, i) => (
                                                <li key={i} className="text-sm font-bold text-text-main flex items-start gap-2 before:content-['•'] before:text-red-500">{mistake}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <p className="text-sm font-bold text-text-sub mb-4 border-t border-border-strong pt-6">
                                        <span className="text-text-main font-black">Recommended Action:</span> <br />
                                        {activeTopic.category === 'Weak' ? `Revise ${activeTopic.topicName} fundamentals and clear your doubts.` : 'Keep up the good practice!'}
                                    </p>
                                    <Link to={`/practice?topic=${encodeURIComponent(activeTopic.topicName)}`} className="block text-center w-full bg-[#4f46e5] text-white py-3.5 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-all">Start Practice</Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
