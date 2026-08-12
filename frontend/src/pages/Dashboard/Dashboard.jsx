import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
 Target, Zap, Flame, BrainCircuit, Calendar,
 CheckCircle2, PlayCircle, Award, Activity,
 BookOpen, Hash, Clock
} from 'lucide-react';

export default function Dashboard() {
 const { user } = useAuth();

 return (
 <DashboardLayout>
 <div className="max-w-[1280px] mx-auto pb-20 space-y-10 lg:space-y-12 animate-in fade-in duration-500 box-border">

 {/* 1. Welcome Header */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-bg-surface p-8 lg:p-10 rounded-[32px] border border-border-base shadow-sm">
 <div className="flex-1">
 <h1 className="text-3xl lg:text-4xl font-extrabold text-text-main mb-3 tracking-tight leading-tight">
 Good Evening, {user?.name?.split(' ')[0] || 'Aman'} 👋
 </h1>
 <p className="text-base lg:text-lg font-medium text-text-sub mb-8 max-w-2xl">
 Welcome back! Continue your learning journey.
 </p>

 <div className="flex items-center gap-6 lg:gap-8">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
 <Flame size={20} />
 </div>
 <div>
 <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-text-muted mb-0.5">Current Streak</p>
 <p className="text-sm lg:text-base font-black text-text-main tracking-tight">12 Days</p>
 </div>
 </div>
 <div className="w-px h-10 lg:h-12 bg-bg-surface-hover"></div>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
 <Target size={20} />
 </div>
 <div>
 <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-text-muted mb-0.5">Overall Progress</p>
 <p className="text-sm lg:text-base font-black text-text-main tracking-tight">82% on track</p>
 </div>
 </div>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
 <button className="flex-1 sm:flex-none justify-center bg-bg-surface border border-border-strong text-text-sub hover:bg-bg-surface-hover px-6 py-3.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm whitespace-nowrap active:scale-[0.98]">
 <BrainCircuit size={18} /> Ask AI
 </button>
 <button className="flex-1 sm:flex-none justify-center bg-[#9884d1] hover:bg-[#8570c8] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 text-sm whitespace-nowrap">
 <PlayCircle size={18} /> Continue Learning
 </button>
 </div>
 </div>

 {/* 7. Quick Navigation */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
 <QuickNav title="Practice Hub" icon={Target} to="/practice" />
 <QuickNav title="Study Plan" icon={Calendar} to="/study-plan" />
 <QuickNav title="Learning Twin" icon={BrainCircuit} to="/learning-twin" />
 <QuickNav title="Free Resources" icon={BookOpen} to="/resources" />
 <QuickNav title="Progress" icon={Activity} to="/progress" />
 <QuickNav title="AI Agent" icon={Zap} to="/coach" />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

 {/* LEFT COLUMN - Focus Area */}
 <div className="lg:col-span-8 space-y-8 min-w-0">

 {/* 3. Continue Learning */}
 <div className="bg-bg-surface rounded-[32px] border border-border-base shadow-sm p-8 lg:p-10 group hover:border-[#9884d1]/30 transition-colors relative overflow-hidden">
 <p className="text-xs font-black uppercase tracking-widest text-[#9884d1] mb-3 flex items-center gap-1.5"><PlayCircle size={14} /> Next Up</p>
 <h2 className="text-3xl lg:text-4xl font-black text-text-main tracking-tight mb-2 truncate">Continue SAT Math</h2>
 <h3 className="text-xl font-bold text-text-sub mb-10 truncate">Heart of Algebra</h3>

 <div className="space-y-3 mb-10">
 <div className="flex justify-between items-center text-sm font-bold text-text-sub">
 <span>Progress</span>
 <span>72% Complete</span>
 </div>
 <div className="w-full h-2.5 bg-bg-surface-hover rounded-full overflow-hidden">
 <div className="h-full bg-[#9884d1] rounded-full" style={{ width: '72%' }}></div>
 </div>
 <p className="text-[11.5px] font-bold text-text-muted flex items-center gap-1.5 pt-1"><Clock size={12} /> Estimated Time: 35 min</p>
 </div>

 <div className="flex flex-col sm:flex-row gap-4">
 <button className="bg-[#9884d1] hover:bg-[#8570c8] text-white px-10 py-3.5 rounded-xl font-black transition-all shadow-md text-[13px] active:scale-[0.98]">
 Continue
 </button>
 <button className="bg-bg-surface border border-border-strong text-text-sub hover:bg-bg-surface-hover px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm text-[13px] active:scale-[0.98]">
 View Study Plan
 </button>
 </div>
 </div>

 {/* 2. Quick Stats */}
 <div>
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCard title="Learning Progress" val="82%" sub="+5% this week" icon={Target} color="text-indigo-500 " bg="bg-primary/10 " />
 <StatCard title="Problems Solved" val="345" sub="+14 today" icon={Hash} color="text-teal-500 " bg="bg-teal-500/10 " />
 <StatCard title="Study Streak" val="12" sub="Days streak" icon={Flame} color="text-orange-500 " bg="bg-orange-500/10 " />
 <StatCard title="Learning Score" val="880" sub="Top 10%" icon={Activity} color="text-[#9884d1] " bg="bg-purple-500/10 " />
 </div>
 </div>

 </div>

 {/* RIGHT COLUMN - Suggestions & Updates */}
 <div className="lg:col-span-4 space-y-8 min-w-0">

 {/* 4. AI Recommendation */}
 <div className="bg-[#9884d1] p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
 <div className="absolute top-0 right-0 w-48 h-48 bg-bg-surface/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
 <div className="relative z-10 flex flex-col h-full">
 <p className="text-[10px] font-black uppercase tracking-widest text-[#e2d5ff] mb-4 truncate">Today's Recommendation</p>
 <h4 className="text-[22px] font-black mb-8 leading-tight tracking-tight text-white/95">Revise linear equations before attempting Advanced Math mock tests.</h4>
 <div className="space-y-6 mt-auto">
 <button className="w-full bg-bg-surface border border-transparent text-[#9884d1] ] py-3.5 rounded-xl font-black text-[13px] shadow-sm hover:opacity-95 transition-opacity active:scale-[0.98]">Practice Now</button>
 <button className="w-full text-center text-xs font-bold text-[#e2d5ff] hover:text-white transition-colors underline underline-offset-4 outline-none">Ask AI</button>
 </div>
 </div>
 </div>

 {/* 5. Upcoming Exam */}
 <div className="bg-bg-surface p-7 rounded-[28px] border border-border-base shadow-sm relative">
 <h3 className="text-sm font-extrabold text-text-main mb-6 flex items-center gap-2"><Award size={16} className="text-[#9884d1]" /> Upcoming Exam</h3>
 <div className="mb-8">
 <h4 className="text-[20px] font-black text-text-main mb-4 truncate">Digital SAT</h4>
 <div className="space-y-2.5">
 <p className="text-[13px] font-bold text-text-muted flex items-center justify-between"><span>Exam Date:</span> <span className="text-text-main">3 Oct 2026</span></p>
 <p className="text-[13px] font-bold text-text-muted flex items-center justify-between"><span>Days Remaining:</span> <span className="text-orange-500 font-extrabold">51 Days</span></p>
 </div>
 </div>
 <button className="w-full bg-bg-surface-hover hover:bg-bg-surface-hover border border-border-strong text-text-sub font-bold py-3 rounded-xl text-xs transition-colors active:scale-[0.98]">View Details</button>
 </div>

 {/* 6. Recent Activity */}
 <div className="bg-bg-surface p-7 rounded-[28px] border border-border-base shadow-sm">
 <h3 className="text-sm font-extrabold text-text-main mb-5 flex items-center justify-between">
 <span>Recent Activity</span>
 <Link to="/progress" className="text-[10px] font-black uppercase tracking-widest text-[#9884d1] hover:underline">View All</Link>
 </h3>
 <div className="space-y-4 pt-1">
 <ActivityItem text="Completed Quad Mocks" />
 <ActivityItem text="Downloaded Grammar Notes" />
 <ActivityItem text="Finished Reading Session" />
 </div>
 </div>

 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}

/* ========================================================================== */
/* MICRO-COMPONENTS */
/* ========================================================================== */

const StatCard = ({ title, val, sub, icon: Icon, color, bg }) => (
 <div className="bg-bg-surface p-6 rounded-[28px] border border-border-base shadow-sm flex flex-col justify-between">
 <div className="flex justify-between items-start mb-5">
 <div className={`p-3 rounded-xl ${bg} ${color}`}><Icon size={20} /></div>
 <span className="text-[10px] font-black text-text-muted bg-bg-surface-hover px-2.5 py-1 rounded-md border border-border-base mt-1">{sub}</span>
 </div>
 <div>
 <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-1.5 truncate">{title}</p>
 <p className="text-3xl font-black text-text-main tracking-tight">{val}</p>
 </div>
 </div>
);

const QuickNav = ({ title, icon: Icon, to }) => (
 <Link to={to} className="bg-bg-surface border border-border-base hover:border-[#9884d1] rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 transition-colors group active:scale-[0.98] outline-none focus:ring-2 focus:ring-purple-200">
 <Icon size={24} className="text-text-muted group-hover:text-[#9884d1] transition-colors" />
 <span className="text-[10px] font-black text-text-sub group-hover:text-[#9884d1] transition-colors uppercase tracking-widest text-center line-clamp-1">{title}</span>
 </Link>
);

const ActivityItem = ({ text }) => (
 <div className="flex items-center gap-3.5 group">
 <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
 <CheckCircle2 size={12} />
 </div>
 <p className="text-[13px] font-bold text-text-sub truncate group-hover:text-text-main transition-colors">{text}</p>
 </div>
);
