import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    BrainCircuit, Zap, User, Target, TrendingUp, AlertCircle,
    ArrowRight, MessageSquare, Settings, CheckCircle2, Circle,
    Clock, RefreshCw, BarChart2, BookOpen, Brain, Activity, PenTool, Sparkles
} from 'lucide-react';

export default function LearningTwin() {
    const [activeTopic, setActiveTopic] = useState('Passport to Adv. Math');
    // To toggle empty state for showcase: set to true
    const isEmptyState = false;

    if (isEmptyState) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-[#9884d1] mb-2 shadow-sm border border-purple-100">
                        <BrainCircuit size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Your Learning Twin is getting to know you.</h1>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                        Complete a few practices and study sessions so your Learning Twin can understand your strengths and recommend your exact next steps.
                    </p>
                    <Link to="/practice" className="bg-[#9884d1] hover:bg-[#4338ca] text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-purple-200 transition-all active:scale-95 flex items-center gap-2">
                        Start First Practice <ArrowRight size={18} />
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const knowledgeMapNodes = [
        { id: 'algebra', name: 'Heart of Algebra', status: 'Mastered', accuracy: '92%', recent: '12 problems solved', icon: CheckCircle2, color: 'text-green-500' },
        { id: 'data-analysis', name: 'Problem Solving', status: 'Strong', accuracy: '85%', recent: '4 problems solved', icon: Zap, color: 'text-blue-500' },
        { id: 'advanced-math', name: 'Passport to Adv. Math', status: 'Learning', accuracy: '61%', recent: 'Accuracy improving', icon: Target, color: 'text-[#9884d1]' },
        { id: 'geometry', name: 'Geometry & Trig', status: 'Developing', accuracy: '45%', recent: 'Struggling with circles', icon: Activity, color: 'text-amber-500' },
        { id: 'reading-evidence', name: 'Command of Evidence', status: 'Not Started', accuracy: '-', recent: 'No attempts yet', icon: Circle, color: 'text-gray-300' },
        { id: 'writing-conventions', name: 'English Conventions', status: 'Not Started', accuracy: '-', recent: 'No attempts yet', icon: Circle, color: 'text-gray-300' },
    ];

    const activeNodeData = knowledgeMapNodes.find(n => n.name === activeTopic);

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500 relative">

                {/* Dashboard Grid Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">

                    {/* --- LEFT COLUMN: PROFILE & CONTROL --- */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* 1. HERO - Learning Twin */}
                        <div className="bg-gradient-to-br from-[#9884d1] to-purple-800 text-white p-7 rounded-[32px] relative overflow-hidden shadow-[0_15px_40px_rgba(79,70,229,0.3)]">
                            <BrainCircuit className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 rotate-12 transition-transform duration-700 hover:rotate-45 hover:scale-110" />
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-white dark:bg-gray-800/20 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-md text-white">AI Engine Active</span>
                                <h2 className="text-2xl font-black mb-2 leading-tight">Your Learning<br />Twin</h2>
                                <p className="text-white text-[13.5px] font-semibold leading-relaxed mb-6 drop-shadow-sm">
                                    An AI version of your learning journey that understands how you learn, what you know, and what you should learn next.
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="backdrop-blur-md bg-white dark:bg-gray-800/20 rounded-xl p-3 border border-white/30 shadow-sm text-center">
                                        <p className="text-[10.5px] text-white uppercase tracking-widest font-black mb-1 drop-shadow-sm">Level</p>
                                        <p className="font-extrabold text-[15px] text-white drop-shadow-sm">Intermediate</p>
                                    </div>
                                    <div className="backdrop-blur-md bg-white dark:bg-gray-800/20 rounded-xl p-3 border border-white/30 shadow-sm text-center flex flex-col items-center">
                                        <p className="text-[10.5px] text-white uppercase tracking-widest font-black mb-1 drop-shadow-sm">Streak</p>
                                        <p className="font-extrabold text-[15px] text-white flex items-center gap-1.5 drop-shadow-sm"><Zap size={15} className="text-yellow-300 fill-yellow-300 drop-shadow-md" /> 12 Days</p>
                                    </div>
                                </div>

                                <Link to="/coach" className="w-full flex justify-center items-center gap-2 bg-white dark:bg-gray-800 text-[#9884d1] py-3.5 rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-transform mb-3">
                                    <MessageSquare size={16} /> Ask My Twin
                                </Link>
                                <Link to="/study-plan" className="w-full flex justify-center bg-white dark:bg-gray-800/10 hover:bg-white dark:bg-gray-800/20 text-white py-3.5 rounded-xl font-bold text-sm transition-colors border border-white/20">
                                    Improve My Plan
                                </Link>
                            </div>
                        </div>

                        {/* 2. LEARNING PROFILE */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500">
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl group-hover:bg-purple-100 transition-colors duration-500"></div>
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative z-10"><User size={20} className="text-[#9884d1]" /> What Your Twin Knows</h3>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Strong Areas</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-extrabold text-[#9884d1] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-100/50 transition-colors shadow-sm cursor-default">Linear Equations</span>
                                        <span className="text-xs font-extrabold text-[#9884d1] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-100/50 transition-colors shadow-sm cursor-default">Data Inferencing</span>
                                        <span className="text-xs font-extrabold text-[#9884d1] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-100/50 transition-colors shadow-sm cursor-default">Reading Comp</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Needs Improvement</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-extrabold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-sm cursor-default">Circle Geometry</span>
                                        <span className="text-xs font-extrabold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors shadow-sm cursor-default">Trigonometry</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl border border-purple-100/50 shadow-sm relative overflow-hidden">
                                    <div className="absolute right-0 bottom-0 w-16 h-16 bg-purple-100/50 rounded-full blur-2xl"></div>
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 relative z-10">Learning Style</p>
                                    <ul className="text-sm font-bold text-gray-700 dark:text-gray-300 space-y-2 relative z-10">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9884d1] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div> Practice-oriented</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9884d1] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div> Visual learner</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#9884d1] shadow-[0_0_5px_rgba(79,70,229,0.5)]"></div> Short 30m bursts</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold italic mt-6 relative z-10">*These insights adapt automatically as you study.</p>
                        </div>

                        {/* 12. LEARNING TWIN STATUS */}
                        <div className="bg-gradient-to-r from-purple-50/80 to-purple-50/80 p-6 rounded-[32px] border border-purple-100/50 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-extrabold text-purple-950 text-sm flex items-center gap-2"><RefreshCw size={16} className="text-[#9884d1] animate-[spin_4s_linear_infinite]" /> Twin Synced</h3>
                                <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div></div>
                            </div>
                            <p className="text-xs text-purple-900/70 font-semibold mb-4 leading-relaxed">Based on your latest 12 practice sessions.<br />Insight Confidence: <span className="font-black text-emerald-600">High</span></p>
                            <button className="w-full bg-white dark:bg-gray-800 hover:bg-purple-50 text-purple-950 border border-purple-100 py-3 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <Settings size={14} className="text-purple-500" /> Update Twin Profile
                            </button>
                        </div>

                    </div>


                    {/* --- CENTER COLUMN: MAP, SCORE, GAPS --- */}
                    <div className="lg:col-span-6 flex flex-col gap-6">

                        {/* 3. LEARNING SCORE */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-8 group hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500">
                            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                                {/* Premium Gradient SVG Chart */}
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_10px_15px_rgba(79,70,229,0.2)]" viewBox="0 0 100 100">
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#9884d1" />
                                            <stop offset="100%" stopColor="#818cf8" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="url(#scoreGradient)" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="45" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">82</span>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Score</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-[#9884d1]"></div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Consistency</p>
                                        <span className="text-xs font-black ml-auto">91%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-[#9884d1] w-[91%] h-full rounded-full"></div></div>
                                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1.5">You're studying regularly.</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Accuracy</p>
                                        <span className="text-xs font-black ml-auto">64%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-amber-500 w-[64%] h-full rounded-full"></div></div>
                                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1.5">Focus on concept revision.</p>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Practice Volume</p>
                                        <span className="text-xs font-black ml-auto">88%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-emerald-500 w-[88%] h-full rounded-full"></div></div>
                                </div>
                            </div>
                        </div>

                        {/* 4. KNOWLEDGE MAP (Interactive) */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Brain size={22} className="text-[#9884d1] drop-shadow-sm" /> Knowledge Map</span>
                                <span className="text-[11px] font-black tracking-widest text-[#9884d1] bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100 uppercase">SAT Track</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1 relative before:absolute before:inset-y-4 before:left-3.5 before:w-0.5 before:bg-gray-100">
                                    {knowledgeMapNodes.map((node) => (
                                        <button
                                            key={node.id}
                                            onClick={() => setActiveTopic(node.name)}
                                            className={`relative w-full text-left pl-11 pr-4 py-3.5 rounded-2xl font-bold transition-all duration-300 border ${activeTopic === node.name ? 'bg-gradient-to-r from-purple-50 to-white text-[#9884d1] border-purple-100 shadow-sm scale-[1.02]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-700/50 border-transparent hover:border-gray-100 dark:border-gray-700/50'
                                                }`}
                                        >
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white dark:bg-gray-800 z-10">
                                                <node.icon size={18} className={`absolute inset-0 -translate-x-1/2 -translate-y-1/2 ${node.color} ${activeTopic === node.name ? 'scale-125 transition-transform drop-shadow-md' : ''}`} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={activeTopic === node.name ? 'font-black' : 'font-semibold'}>{node.name}</span>
                                                {node.status && <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg border ${node.status === 'Learning' ? 'border-[#9884d1] text-white bg-[#9884d1] shadow-md shadow-purple-200' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800'}`}>{node.status}</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-br from-[#f8f9ff] to-white border border-purple-100/50 rounded-3xl p-7 relative overflow-hidden shadow-inner">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                                    <h4 className="text-[22px] font-black text-gray-900 dark:text-white mb-1 relative z-10">{activeNodeData?.name}</h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-[#9884d1] mb-6 relative z-10">Status: {activeNodeData?.status}</p>

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center pb-3 border-b border-purple-50">
                                            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Accuracy</span>
                                            <span className="font-black text-purple-950 text-xl">{activeNodeData?.accuracy}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-purple-50">
                                            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Recent Try</span>
                                            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm max-w-[140px] text-right">{activeNodeData?.recent}</span>
                                        </div>
                                        <div className="pt-3">
                                            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest block mb-2">Recommended Action</span>
                                            <button className="w-full bg-white dark:bg-gray-800 hover:bg-purple-50 border border-purple-100 text-[#9884d1] py-3 rounded-xl text-sm font-black transition-all shadow-sm active:scale-95">Start Revision Drill</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. AI INSIGHTS & 9. LEARNING GAPS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                            {/* What Twin Noticed */}
                            <div className="bg-gradient-to-br from-purple-50/50 to-white p-6 rounded-[32px] border border-purple-100/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                <h3 className="font-black text-purple-950 mb-4 flex items-center gap-2 relative z-10"><BrainCircuit size={18} className="text-[#9884d1]" /> What Your Twin Noticed</h3>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                                    "Your accuracy in Passport to Adv. Math improved from 62% to 81% over the last 7 days."
                                </p>
                                <div className="h-px w-full bg-purple-100 my-4 relative z-10"></div>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed relative z-10 mb-4">
                                    "You are solving problems quickly but making isolated mistakes in quadratic factoring edge cases."
                                </p>
                                <button className="text-[11px] font-black uppercase tracking-wider text-[#9884d1] bg-purple-50 hover:bg-purple-100 border border-purple-100 px-4 py-2 rounded-lg transition-colors relative z-10">Acknowledge</button>
                            </div>

                            {/* Learning Gaps */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-red-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2 relative z-10"><AlertCircle size={18} className="text-red-500 group-hover:animate-bounce" /> Critical Gap Detected</h3>
                                <div className="bg-gray-50 dark:bg-gray-700/50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 mb-4 shadow-sm relative z-10">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Geometry & Trig</h4>
                                        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">Medium</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Repeated mistakes in deriving arc lengths. Circle fraction mapping failing.</p>
                                </div>
                                <button className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 text-gray-800 shadow-sm font-bold text-sm py-2.5 rounded-xl transition-colors relative z-10">Fix This Gap</button>
                            </div>
                        </div>

                    </div>


                    {/* --- RIGHT COLUMN: CTA, REC, METRICS --- */}
                    <div className="lg:col-span-3 flex flex-col gap-6">

                        {/* 6. PERSONALIZED NEXT STEP (Most Important) */}
                        <div className="bg-purple-950 !text-white p-6 rounded-[32px] shadow-[0_15px_40px_rgba(30,27,75,0.3)] relative overflow-hidden group">
                            {/* Animated Aurora effect in background */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[60px] group-hover:bg-purple-500/30 transition-colors duration-700"></div>

                            <p className="text-[10.5px] font-black !text-purple-200 uppercase tracking-widest mb-1 mt-1 relative z-10 drop-shadow-sm">Primary Recommendation</p>
                            <h3 className="font-extrabold !text-white text-xl leading-tight mb-2 relative z-10">Practice Factoring Quadratics</h3>

                            <p className="text-[13px] font-semibold !text-purple-100 leading-relaxed mb-5 relative z-10">
                                "Your recent attempts show good understanding of Heart of Algebra, but your polynomial factoring accuracy is only 64%."
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6 bg-purple-900/50 p-3 rounded-2xl border border-purple-800 relative z-10">
                                <div>
                                    <span className="text-[10.5px] font-black !text-purple-200 flex items-center gap-1 uppercase tracking-wider"><Clock size={11} /> Time</span>
                                    <span className="text-[15px] font-black !text-white">35 min</span>
                                </div>
                                <div>
                                    <span className="text-[10.5px] font-black !text-purple-200 flex items-center gap-1 uppercase tracking-wider"><Target size={11} /> Difficulty</span>
                                    <span className="text-[15px] font-black !text-white drop-shadow-sm">Medium</span>
                                </div>
                            </div>

                            <button className="w-full relative z-10 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:bg-gray-700/50 !text-[#9884d1] py-3.5 rounded-xl font-black text-[14px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-3">
                                Start Recommended Task <ArrowRight size={18} />
                            </button>
                            <button className="w-full relative z-10 text-center text-[12px] font-bold !text-purple-300 hover:!text-white underline underline-offset-4 transition-colors">Why this recommendation?</button>
                        </div>

                        {/* 10. AI CONVERSATION (Mini Widget) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500">
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><MessageSquare size={18} className="text-[#9884d1]" /> Ask Your Twin</h3>
                            <div className="space-y-2.5">
                                <Link to="/coach" className="block w-full text-left bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-50/30 border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 p-3.5 rounded-2xl text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#9884d1] transition-all shadow-sm hover:shadow active:scale-[0.98]">
                                    "Which topics should I study today?"
                                </Link>
                                <Link to="/coach" className="block w-full text-left bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-50/30 border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 p-3.5 rounded-2xl text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#9884d1] transition-all shadow-sm hover:shadow active:scale-[0.98]">
                                    "Explain my recent math mistakes."
                                </Link>
                                <Link to="/coach" className="block w-full text-left bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-50/30 border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 p-3.5 rounded-2xl text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-[#9884d1] transition-all shadow-sm hover:shadow active:scale-[0.98]">
                                    "Generate a 20-min reading drill."
                                </Link>
                            </div>
                        </div>

                        {/* 11. RECOMMENDED FOR YOU */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500">
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Sparkles size={18} className="text-[#9884d1]" /> Micro-Tasks</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3.5 border border-gray-100 dark:border-gray-700/50 hover:border-purple-100 rounded-2xl bg-gray-50 dark:bg-gray-700/50/50 hover:bg-purple-50/30 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center justify-center shadow-sm group-hover:border-[#9884d1] group-hover:text-[#9884d1] group-hover:scale-110 transition-all"><BookOpen size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">Revise</p>
                                            <p className="text-[13px] font-extrabold text-gray-900 dark:text-white group-hover:text-[#9884d1] transition-colors">Equations Form</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm">20m</span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 border border-gray-100 dark:border-gray-700/50 hover:border-purple-100 rounded-2xl bg-gray-50 dark:bg-gray-700/50/50 hover:bg-purple-50/30 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center justify-center shadow-sm group-hover:border-[#9884d1] group-hover:text-[#9884d1] group-hover:scale-110 transition-all"><PenTool size={16} /></div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">Practice</p>
                                            <p className="text-[13px] font-extrabold text-gray-900 dark:text-white group-hover:text-[#9884d1] transition-colors">Circle Arcs</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm">5 Qs</span>
                                </div>
                            </div>
                        </div>

                        {/* 7. LEARNING PATTERNS */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500">
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><BarChart2 size={18} className="text-[#9884d1]" /> Analyze Patterns</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-3">
                                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Productive Time</span>
                                    <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/50 px-2.5 py-1 rounded-lg shadow-sm">8 PM - 10 PM</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700/50 pb-3">
                                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Avg Session</span>
                                    <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/50 px-2.5 py-1 rounded-lg shadow-sm">52 mins</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Practice : Review</span>
                                    <span className="text-[11px] font-black text-[#9884d1] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 shadow-sm">70% : 30%</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
