import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Target, ArrowUpRight, ArrowDownRight, Layers, Repeat, BookOpen, BrainCircuit, Sparkles, ChevronLeft } from 'lucide-react';
import api from '../../services/api';

export default function DeepAnalysis() {
    const [deepAnalysis, setDeepAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/twin/deep-analysis').then(res => {
            setDeepAnalysis(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

    if (loading) {
        return <DashboardLayout><div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div></DashboardLayout>;
    }

    if (!deepAnalysis?.hasData) {
        return (
            <DashboardLayout>
                <div className="max-w-6xl mx-auto py-10 space-y-8">
                    <button onClick={() => navigate('/learning-twin')} className="flex items-center gap-2 text-text-sub hover:text-text-main font-bold transition-colors">
                        <ChevronLeft size={20} /> Back to Learning Twin
                    </button>
                    <div className="bg-bg-surface p-12 text-center rounded-[32px] border border-border-base shadow-sm">
                        <BrainCircuit size={48} className="mx-auto text-primary opacity-50 mb-6" />
                        <h2 className="text-2xl font-black text-text-main mb-3">Not enough data yet.</h2>
                        <p className="text-text-sub font-medium max-w-lg mx-auto mb-8">Complete a few more practice sessions to unlock the Deep Performance Analytics engine.</p>
                        <Link to="/practice" className="inline-flex items-center justify-center gap-2 bg-text-main text-bg-base py-3 px-8 rounded-xl font-bold transition-all shadow-md active:scale-95">
                            Start Practice
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20 relative font-sans">

                <div className="flex items-center justify-between mb-2">
                    <button onClick={() => navigate('/learning-twin')} className="flex items-center gap-2 text-text-sub hover:text-text-main font-bold transition-colors bg-bg-surface-hover px-4 py-2 rounded-xl">
                        <ChevronLeft size={20} /> Back to Overview
                    </button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                    <h1 className="text-3xl lg:text-4xl font-black text-text-main">Deep Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Analysis</span></h1>

                    {/* Personalized AI Summary */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 rounded-[32px] relative overflow-hidden shadow-lg shadow-primary/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-primary-200 mb-4 flex items-center gap-2"><Sparkles size={16} /> AI Synthesis</h2>
                        <p className="text-xl md:text-2xl font-bold leading-relaxed relative z-10">{deepAnalysis.aiSummary}</p>
                    </div>

                    {/* Top Metrics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-1">Overall Accuracy</p>
                            <p className="text-3xl font-black text-text-main">{deepAnalysis.overall?.accuracy || 0}%</p>
                        </div>
                        <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-1">Questions Answered</p>
                            <p className="text-3xl font-black text-text-main">{deepAnalysis.overall?.attempts || 0}</p>
                        </div>
                        <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-1">Consistency (Days)</p>
                            <p className="text-3xl font-black text-text-main">3<span className="text-lg text-text-sub ml-1">days</span></p>
                        </div>
                        <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm">
                            <p className="text-[10px] font-black uppercase text-text-muted mb-1">Mistake Bias</p>
                            <p className="text-lg font-bold text-red-500 pt-1 leading-tight">{deepAnalysis.mistakePatterns[0]}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Action Plan */}
                        <div className="bg-bg-surface p-8 rounded-[32px] border border-border-base shadow-sm">
                            <h3 className="text-2xl font-black text-text-main mb-6 flex items-center gap-2"><Target size={24} className="text-primary" /> Priority Action Plan</h3>
                            <div className="space-y-6">
                                {deepAnalysis.actionPlan?.map((plan, idx) => (
                                    <div key={idx} className="bg-bg-surface-hover border border-border-strong p-5 rounded-2xl">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-md ${plan.priority.includes('1') ? 'bg-red-100 text-red-700' : plan.priority.includes('2') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{plan.priority}</span>
                                                <h4 className="font-extrabold text-lg text-text-main">{plan.topic}</h4>
                                            </div>
                                            <p className="text-sm font-bold text-text-sub">{plan.accuracy}% - {plan.status}</p>
                                        </div>
                                        <p className="text-sm font-medium text-text-sub mb-4">{plan.recommendation}</p>
                                        <div className="flex gap-3">
                                            <Link to={`/practice?topic=${encodeURIComponent(plan.topic)}`} className="bg-text-main hover:bg-black dark:hover:bg-white text-bg-base px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm">
                                                Practice Now <ArrowUpRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Logic Building */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-amber-50 to-bg-surface dark:from-amber-950/20 dark:to-bg-surface p-8 rounded-[32px] border border-amber-100 dark:border-amber-900/50 shadow-sm relative overflow-hidden group">
                                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-500 mb-6 flex items-center gap-2"><BrainCircuit size={24} /> Improve Problem Solving</h3>
                                <div className="space-y-4">
                                    {deepAnalysis.logicBuilding.map((lb, idx) => (
                                        <div key={idx} className="bg-bg-surface/80 p-5 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
                                            <p className="text-xs font-black uppercase text-amber-600/80 mb-2">Detected Issue: {lb.issue}</p>
                                            <p className="text-sm font-medium text-text-main leading-relaxed">{lb.advise}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="bg-bg-surface p-8 rounded-[32px] border border-border-base shadow-sm">
                                <h3 className="text-xl font-black text-text-main mb-6 flex items-center gap-2"><Layers size={22} /> Difficulty & Speed</h3>
                                <div className="space-y-4">
                                    {['Easy', 'Medium', 'Hard'].map((diff) => {
                                        const stats = deepAnalysis.difficulties[diff];
                                        if (!stats) return null;
                                        return (
                                            <div key={diff} className="flex items-center gap-4">
                                                <div className="w-20"><p className="text-xs font-bold text-text-sub uppercase">{diff}</p></div>
                                                <div className="flex-1 h-3 bg-bg-surface-hover rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${diff === 'Easy' ? 'bg-green-500' : diff === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.accuracy || 0}%` }}></div>
                                                </div>
                                                <div className="w-12 text-right"><p className="text-sm font-black text-text-main">{stats.accuracy || 0}%</p></div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-8 flex gap-4">
                                    <button className="flex-1 bg-bg-surface-hover border border-border-strong text-text-main py-3 rounded-xl text-xs font-bold hover:bg-bg-surface transition-all flex items-center justify-center gap-2"><Repeat size={16} /> Refresh Analysis</button>
                                    <button className="flex-1 bg-bg-surface-hover border border-border-strong text-text-main py-3 rounded-xl text-xs font-bold hover:bg-bg-surface transition-all flex items-center justify-center gap-2"><BookOpen size={16} /> View All Mistakes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
