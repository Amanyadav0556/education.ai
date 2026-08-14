import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    BrainCircuit, Zap, Target, AlertCircle,
    ArrowRight, MessageSquare, CheckCircle2, Circle,
    Activity, PenTool, Sparkles, Calendar
} from 'lucide-react';

export default function LearningTwin() {
    const [activeTopic, setActiveTopic] = useState('advanced-math');

    const knowledgeMapNodes = [
        { id: 'algebra', name: 'Heart of Algebra', status: 'Mastered', accuracy: 92, recent: '12 problems solved', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: 'data-analysis', name: 'Problem Solving', status: 'Strong', accuracy: 85, recent: '4 problems solved', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'advanced-math', name: 'Passport to Adv. Math', status: 'Learning', accuracy: 61, recent: 'Accuracy improving', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
        { id: 'geometry', name: 'Geometry & Trig', status: 'Developing', accuracy: 45, recent: 'Struggling with circles', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { id: 'reading-evidence', name: 'Command of Evidence', status: 'Not Started', accuracy: 0, recent: 'No attempts yet', icon: Circle, color: 'text-text-muted', bg: 'bg-bg-surface-hover' },
    ];

    const activeNodeData = knowledgeMapNodes.find(n => n.id === activeTopic);

    // Variants for animation
    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' } } };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20 relative font-sans">

                {/* 1. Header & Hero - Clean, SaaS style */}
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

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">

                        {/* Overall Score */}
                        <div className="bg-bg-surface p-6 rounded-[32px] border border-border-base shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>

                            <h3 className="font-extrabold text-text-main mb-6 flex items-center gap-2"><Sparkles className="text-primary" size={20} /> Readiness Score</h3>

                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-bg-surface-hover" strokeWidth="12" fill="none" />
                                        <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-primary transition-all duration-1000 ease-out" strokeWidth="12" fill="none" strokeDasharray="264" strokeDashoffset={264 - (264 * 82) / 100} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-black text-text-main">82</span>
                                    </div>
                                </div>
                                <div className="space-y-4 w-full">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1"><span className="text-text-sub">Consistency</span> <span className="text-text-main">91%</span></div>
                                        <div className="h-2 w-full bg-bg-surface-hover rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[91%] rounded-full"></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1"><span className="text-text-sub">Accuracy</span> <span className="text-text-main">64%</span></div>
                                        <div className="h-2 w-full bg-bg-surface-hover rounded-full overflow-hidden"><div className="h-full bg-amber-500 w-[64%] rounded-full"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Gap Insights */}
                        <div className="bg-gradient-to-br from-red-50 to-bg-surface dark:from-red-950/20 dark:to-bg-surface p-6 rounded-[32px] border border-red-100 dark:border-red-900/50 shadow-sm relative overflow-hidden group">
                            <h3 className="font-extrabold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2"><AlertCircle size={20} /> Critical Gap</h3>

                            <div className="bg-bg-surface p-4 rounded-2xl border border-border-base shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-black text-text-main text-sm">Geometry & Trig</h4>
                                    <span className="text-[10px] font-black uppercase text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-lg">High Priority</span>
                                </div>
                                <p className="text-sm font-medium text-text-sub leading-snug mb-4">Repeated mistakes detecting arc lengths. AI models show structural misunderstanding.</p>
                                <button className="w-full bg-bg-surface-hover hover:bg-red-500 text-text-main hover:text-white border border-border-strong hover:border-red-500 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">Target Weakness</button>
                            </div>
                        </div>

                    </motion.div>


                    {/* CENTER COLUMN: INTERACTIVE KNOWLEDGE MAP */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-bg-surface p-6 rounded-[32px] border border-border-base shadow-sm h-full flex flex-col">
                            <h3 className="font-extrabold text-text-main mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2"><BrainCircuit className="text-primary" size={20} /> Interactive Knowledge Map</span>
                                <span className="text-xs font-medium text-text-sub">Select a node to inspect</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                                {/* Map Selection */}
                                <div className="space-y-2 relative before:absolute before:inset-y-4 before:left-[19px] before:w-[2px] before:bg-border-strong before:-z-10 z-0">
                                    {knowledgeMapNodes.map((node) => (
                                        <button
                                            key={node.id}
                                            onClick={() => setActiveTopic(node.id)}
                                            className={`relative w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border bg-bg-surface ${activeTopic === node.id
                                                    ? 'border-primary shadow-md scale-105 z-10 ring-4 ring-primary/10'
                                                    : 'border-border-base hover:border-primary/50 hover:bg-bg-surface-hover z-0'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${node.bg} ${node.color} shadow-sm border border-border-base`}>
                                                <node.icon size={18} className={activeTopic === node.id ? 'animate-pulse' : ''} />
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className={`truncate ${activeTopic === node.id ? 'font-black text-text-main' : 'font-bold text-text-sub'}`}>{node.name}</p>
                                                <p className="text-[11px] font-bold text-text-muted mt-0.5">{node.status}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Details Panel */}
                                <div className="bg-bg-surface-hover rounded-3xl p-6 border border-border-base relative overflow-hidden flex flex-col">
                                    <AnimatePresence mode='wait'>
                                        <motion.div
                                            key={activeTopic}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-1 flex flex-col"
                                        >
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeNodeData.bg} ${activeNodeData.color} shadow-sm border border-border-base`}>
                                                    <activeNodeData.icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-text-main leading-tight">{activeNodeData.name}</h4>
                                                    <span className="text-xs font-bold text-text-sub uppercase tracking-wider">{activeNodeData.status}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-bg-surface p-4 rounded-2xl border border-border-base shadow-sm">
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Accuracy</p>
                                                    <p className="text-2xl font-black text-text-main">{activeNodeData.accuracy > 0 ? `${activeNodeData.accuracy}%` : '-'}</p>
                                                </div>
                                                <div className="bg-bg-surface p-4 rounded-2xl border border-border-base shadow-sm">
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Recent Activity</p>
                                                    <p className="text-[13px] font-bold text-text-main leading-tight pt-1">{activeNodeData.recent}</p>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <button className="w-full bg-text-main hover:bg-black dark:hover:bg-white/90 text-bg-base py-3.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                                                    <PenTool size={16} /> Start Targeted Drill
                                                </button>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </DashboardLayout>
    );
}
