import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
 Calendar, CheckCircle2, Clock, Sparkles, Target, Zap,
 BarChart3, Plus, BrainCircuit, PlayCircle, AlertCircle,
 X, Timer, BookOpen, Flame, ArrowRight, RotateCcw,
 MoreHorizontal, CalendarDays, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudyPlan() {
 const { user } = useAuth();

 // UI State
 const [activeDay, setActiveDay] = useState('Wednesday');
 const [showAIModal, setShowAIModal] = useState(false);
 const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);

 // Mock Data arrays
 const weekDays = [
 { day: 'Mon', date: '12', load: 85 },
 { day: 'Tue', date: '13', load: 60 },
 { day: 'Wed', date: '14', active: true, load: 45 },
 { day: 'Thu', date: '15', load: 90 },
 { day: 'Fri', date: '16', load: 30 },
 { day: 'Sat', date: '17', load: 100 },
 { day: 'Sun', date: '18', load: 0 }
 ];

 const todayTasks = [
 { id: 1, time: '8:00 AM', duration: '45 min', subject: 'SAT Math', topic: 'Advanced Algebra : Grid-Ins', difficulty: 'Expert', progress: 70, status: 'Completed' },
 { id: 2, time: '10:00 AM', duration: '60 min', subject: 'SAT Reading', topic: 'Science Passage Speed Drill', difficulty: 'Medium', progress: 0, status: 'Missed' },
 { id: 3, time: '12:00 PM', duration: '30 min', subject: 'Revision', topic: 'Punctuation & Grammar Rules', difficulty: 'Beginner', progress: 10, status: 'In Progress' },
 { id: 4, time: '6:00 PM', duration: '60 min', subject: 'Practice', topic: 'Full Length Math No-Calc', difficulty: 'Hard', progress: 0, status: 'Not Started' }
 ];

 const subjectsProgress = [
 { name: 'SAT Math - Algebra', progress: 82, color: 'bg-blue-500' },
 { name: 'SAT Reading', progress: 68, color: 'bg-emerald-500' },
 { name: 'SAT Writing', progress: 61, color: 'bg-purple-500' },
 { name: 'SAT Math - Geometry', progress: 34, color: 'bg-orange-500' }
 ];

 const upcomingGoals = [
 { title: 'Master Heart of Algebra', progress: 82, icon: Target, total: '82%' },
 { title: '15 Day Study Streak', progress: 80, icon: Flame, total: '12 / 15 days' },
 { title: 'August Official SAT Exam', progress: 40, icon: CalendarDays, total: 'Day 8 / 20' }
 ];

 return (
 <DashboardLayout>
 <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

 {/* 1. Study Plan Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">
 Your Study Plan
 </h1>
 <p className="text-text-sub font-medium text-[15px]">
 Your personalized roadmap to learn smarter, stay consistent, and reach your goals.
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-3">
 <button onClick={() => setShowAIModal(true)} className="bg-bg-surface border border-border-strong text-text-sub hover:bg-bg-surface-hover px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm">
 <Sparkles size={16} className="text-[#4f46e5]" />
 Ask AI to Optimize Plan
 </button>
 <button onClick={() => setShowCustomPlanModal(true)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 text-sm active:scale-95">
 <Plus size={16} />
 Add Study Plan
 </button>
 </div>
 </div>

 <div className="flex items-center gap-6 pb-2 border-b border-border-base overflow-x-auto scrollbar-hide">
 <div className="flex items-center gap-2 whitespace-nowrap">
 <Flame className="text-orange-500" size={20} />
 <span className="font-bold text-text-main">12 Day Streak</span>
 </div>
 <div className="w-px h-6 bg-gray-200"></div>
 <div className="flex items-center gap-2 whitespace-nowrap">
 <CheckCircle2 className="text-green-500" size={20} />
 <span className="font-bold text-text-main">85% Weekly Completion</span>
 </div>
 <div className="w-px h-6 bg-gray-200"></div>
 <div className="flex items-center gap-2 whitespace-nowrap">
 <Clock className="text-indigo-500" size={20} />
 <span className="font-bold text-text-main">14.5 Hours Studied</span>
 </div>
 <div className="w-px h-6 bg-gray-200"></div>
 <div className="flex items-center gap-2 whitespace-nowrap">
 <Target className="text-rose-500" size={20} />
 <span className="font-bold text-text-main">Current Goal: Master Geometry</span>
 </div>
 </div>

 {/* 2. AI Personalized Overview */}
 <div className="bg-gradient-to-r from-bg-surface-hover to-bg-surface rounded-[24px] p-6 border border-primary/20 shadow-sm relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-bg-surface blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
 <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
 <div className="w-14 h-14 bg-bg-surface rounded-2xl flex items-center justify-center text-[#4f46e5] shadow-sm flex-shrink-0">
 <BrainCircuit size={28} />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <h3 className="text-lg font-bold text-text-main">AI Study Coach</h3>
 <span className="bg-[#4f46e5] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">New Inference</span>
 </div>
 <p className="text-text-sub font-medium text-[15px] leading-relaxed max-w-3xl">
 "You're progressing extremely well in Advanced Algebra, but <strong>Reading: Science Passages</strong> needs more practice. I've adjusted tomorrow's plan to give you an extra 30 minutes of science passage reading comprehension."
 </p>
 </div>
 <button className="flex-shrink-0 bg-bg-surface text-[#4f46e5] ] border border-primary/20 hover:bg-primary/10 px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm w-full md:w-auto text-center">
 Apply Recommendation
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

 {/* LEFT COLUMN */}
 <div className="lg:col-span-2 space-y-8">

 {/* 4. Weekly Study Calendar */}
 <div className="bg-bg-surface rounded-[24px] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <div className="flex items-center justify-between mb-6">
 <h3 className="font-bold text-text-main text-lg">Weekly Planner</h3>
 <button onClick={() => setShowAIModal(true)} className="text-sm font-bold text-[#4f46e5] bg-primary/10 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
 <Sparkles size={14} /> Plan My Week with AI
 </button>
 </div>

 <div className="flex items-end justify-between gap-2 overflow-x-auto pb-2">
 {weekDays.map((d, i) => (
 <button key={i} className={`flex flex-col items-center gap-3 min-w-[60px] p-2 rounded-2xl transition-all ${d.active ? 'bg-primary/10 ring-1 ring-primary/20 cursor-default' : 'hover:bg-bg-surface-hover '}`}>
 <div className="h-16 w-full flex items-end justify-center">
 <div className={`w-2.5 rounded-full transition-all ${d.active ? 'bg-[#4f46e5]' : 'bg-gray-200'}`} style={{ height: `${Math.max(d.load, 15)}%` }}></div>
 </div>
 <div className="text-center">
 <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${d.active ? 'text-[#4f46e5]' : 'text-text-muted '}`}>{d.day}</p>
 <p className={`text-base font-black ${d.active ? 'text-text-main ' : 'text-text-sub '}`}>{d.date}</p>
 </div>
 </button>
 ))}
 </div>
 </div>

 {/* 3. Today's Plan (Timeline) */}
 <div className="bg-bg-surface rounded-[24px] p-6 md:p-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <h3 className="font-bold text-text-main text-lg mb-8 flex items-center gap-2">
 <Calendar size={20} className="text-[#4f46e5]" /> Today's Plan
 </h3>

 <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[3.5rem] before:-translate-x-px md:before:mx-0 md:before:translate-x-0 md:before:ml-[4.5rem] before:h-full before:w-0.5 before:bg-bg-surface-hover">
 {todayTasks.map((task) => (
 <div key={task.id} className="relative flex items-start gap-4 md:gap-6 group z-10">

 {/* Time Indicator */}
 <div className="w-12 md:w-16 flex-shrink-0 text-right pt-2.5">
 <span className="text-[11px] md:text-xs font-black text-text-muted uppercase tracking-wider block">{task.time}</span>
 </div>

 {/* Timeline Dot */}
 <div className={`w-3 h-3 rounded-full mt-3.5 flex-shrink-0 border-2 bg-bg-surface ${task.status === 'Completed' ? 'border-green-500' :
 task.status === 'Missed' ? 'border-red-500' :
 task.status === 'In Progress' ? 'border-[#4f46e5]' : 'border-border-strong'
 }`}></div>

 {/* Task Card */}
 <div className={`flex-1 rounded-[20px] p-5 border transition-all ${task.status === 'In Progress' ? 'bg-bg-base/50 border-[#4f46e5] shadow-sm' :
 task.status === 'Missed' ? 'bg-red-50/50 border-red-100' :
 'bg-bg-surface border-border-base hover:border-border-strong hover:shadow-[0_4px_20px_rgb(0,0,0,0.02)]'
 }`}>
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
 <div>
 <div className="flex flex-wrap items-center gap-2 mb-2">
 <span className="text-[10px] font-black uppercase tracking-wider text-text-sub bg-bg-surface-hover px-2 py-0.5 rounded">{task.subject}</span>
 <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${task.difficulty === 'Expert' ? 'text-red-500 bg-red-50' :
 task.difficulty === 'Hard' ? 'text-orange-500 bg-orange-500/10' :
 task.difficulty === 'Medium' ? 'text-blue-500 bg-blue-500/10' :
 'text-emerald-500 bg-emerald-500/10'
 }`}>{task.difficulty}</span>
 </div>
 <h4 className="text-lg font-bold text-text-main mb-1">{task.topic}</h4>
 <p className="text-sm font-bold text-text-muted flex items-center gap-1"><Clock size={14} /> {task.duration}</p>
 </div>

 {/* Action Buttons based on Status */}
 <div className="flex flex-wrap items-center gap-2 md:justify-end">
 {task.status === 'Not Started' && (
 <button className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all w-full md:w-auto justify-center"><PlayCircle size={16} /> Start</button>
 )}
 {task.status === 'In Progress' && (
 <>
 <button className="bg-bg-surface border text-text-sub border-border-strong hover:bg-bg-surface-hover p-2 rounded-xl active:scale-95 transition-all"><MoreHorizontal size={18} /></button>
 <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all w-full md:w-auto justify-center"><CheckCircle2 size={16} /> Complete</button>
 </>
 )}
 {task.status === 'Completed' && (
 <span className="flex items-center gap-1 text-sm font-bold text-green-500 bg-green-50 px-3 py-1.5 rounded-lg"><CheckCircle2 size={16} /> Done</span>
 )}
 </div>
 </div>

 {/* Progress Bar (If initiated) */}
 {task.status !== 'Missed' && task.status !== 'Not Started' && (
 <div className="w-full h-1.5 bg-bg-surface-hover rounded-full mt-2">
 <div className={`h-full rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-[#4f46e5]'}`} style={{ width: `${task.progress}%` }}></div>
 </div>
 )}

 {/* 8. Smart Rescheduling (If Missed) */}
 {task.status === 'Missed' && (
 <div className="mt-4 bg-bg-surface border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
 <div>
 <p className="text-sm font-bold text-red-500 flex items-center gap-1 mb-1"><AlertCircle size={16} /> You missed this task.</p>
 <p className="text-xs font-medium text-text-sub">AI Suggests: Move it to tomorrow at 7:00 PM?</p>
 </div>
 <div className="flex items-center gap-2 w-full sm:w-auto">
 <button className="flex-1 sm:flex-none text-xs font-bold text-text-sub bg-bg-surface-hover hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">Skip</button>
 <button className="flex-1 sm:flex-none text-xs font-bold text-white bg-[#4f46e5] hover:bg-[#4338ca] px-4 py-2 rounded-lg transition-colors flex items-center gap-1 justify-center"><RotateCcw size={14} /> Reschedule</button>
 </div>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* RIGHT COLUMN */}
 <div className="space-y-8">

 {/* 5. Productivity Analytics */}
 <div className="bg-bg-surface rounded-[24px] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <h3 className="font-bold text-text-main text-lg mb-6 flex items-center gap-2">
 <BarChart3 size={20} className="text-[#4f46e5]" /> Study Analytics
 </h3>

 <div className="grid grid-cols-2 gap-4 mb-6">
 <div className="bg-bg-surface-hover rounded-2xl p-4">
 <p className="text-xs font-bold text-text-muted mb-1">This Week</p>
 <p className="text-xl font-black text-text-main">32h 40m</p>
 </div>
 <div className="bg-bg-surface-hover rounded-2xl p-4">
 <p className="text-xs font-bold text-text-muted mb-1">Completion</p>
 <p className="text-xl font-black text-text-main">84%</p>
 </div>
 <div className="bg-bg-surface-hover rounded-2xl p-4">
 <p className="text-xs font-bold text-text-muted mb-1">Avg Session</p>
 <p className="text-xl font-black text-text-main">55 min</p>
 </div>
 <div className="bg-bg-surface-hover rounded-2xl p-4">
 <p className="text-xs font-bold text-text-muted mb-1">Best Day</p>
 <p className="text-xl font-black text-text-main">Saturday</p>
 </div>
 </div>
 </div>

 {/* 6. Subject Progress */}
 <div className="bg-bg-surface rounded-[24px] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <h3 className="font-bold text-text-main text-lg mb-6 flex items-center gap-2">
 <BookOpen size={20} className="text-[#4f46e5]" /> Learning Progress
 </h3>
 <div className="space-y-5">
 {subjectsProgress.map((sub, i) => (
 <div key={i}>
 <div className="flex justify-between text-sm font-bold mb-2">
 <span className="text-text-sub">{sub.name}</span>
 <span className="text-text-main">{sub.progress}%</span>
 </div>
 <div className="w-full bg-bg-surface-hover rounded-full h-2">
 <div className={`${sub.color} h-full rounded-full transition-all`} style={{ width: `${sub.progress}%` }}></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* 9. Upcoming Goals */}
 <div className="bg-bg-surface rounded-[24px] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <h3 className="font-bold text-text-main text-lg mb-6 flex items-center gap-2">
 <Award size={20} className="text-[#4f46e5]" /> Upcoming Goals
 </h3>
 <div className="space-y-4">
 {upcomingGoals.map((goal, i) => (
 <div key={i} className="flex items-center gap-4 bg-bg-surface-hover p-4 rounded-2xl border border-border-base">
 <div className="w-10 h-10 bg-bg-surface shadow-sm rounded-xl flex items-center justify-center text-[#4f46e5] flex-shrink-0">
 <goal.icon size={20} />
 </div>
 <div className="flex-1">
 <h4 className="text-sm font-bold text-text-main mb-1">{goal.title}</h4>
 <div className="flex items-center justify-between gap-3">
 <div className="h-1.5 w-full bg-gray-200 rounded-full">
 <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: `${goal.progress}%` }}></div>
 </div>
 <span className="text-[10px] font-black text-text-sub whitespace-nowrap hidden sm:block">{goal.total}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* 10. Productivity Features / Study Tools */}
 <div className="bg-bg-surface rounded-[24px] p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-border-base">
 <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
 <Zap size={20} className="text-[#4f46e5]" /> Study Tools
 </h3>
 <div className="grid grid-cols-2 gap-3">
 <button className="p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-[#4f46e5]">
 <Timer size={24} />
 <span className="text-xs font-bold">Focus Mode</span>
 </button>
 <button className="p-4 bg-amber-500/10/50 hover:bg-amber-500/10 border border-amber-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors active:scale-95 text-amber-600">
 <Flame size={24} />
 <span className="text-xs font-bold">Pomodoro Timer</span>
 </button>
 </div>
 </div>

 </div>
 </div>

 {/* 7. AI Auto-Planning Modal */}
 {showAIModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-bg-surface rounded-[32px] p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-300">
 <button onClick={() => setShowAIModal(false)} className="absolute top-6 right-6 text-text-muted hover:text-text-main p-2 bg-bg-surface-hover hover:bg-bg-surface-hover rounded-full transition-colors">
 <X size={20} />
 </button>

 <div className="flex items-center gap-3 mb-2 text-[#4f46e5]">
 <Sparkles size={24} />
 <span className="font-black uppercase tracking-widest text-sm">Plan My Week with AI</span>
 </div>
 <h2 className="text-3xl font-black text-text-main mb-8">Generate a highly optimized schedule instantly.</h2>

 <div className="space-y-6">
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">What is your primary goal?</label>
 <input type="text" defaultValue="Master SAT Math Advanced Algebra in 30 days" className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] font-semibold text-sm" />
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Available hours/day?</label>
 <select className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] font-semibold text-sm">
 <option>2 Hours</option>
 <option>3 Hours</option>
 <option>4+ Hours</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Target Exam Date</label>
 <input type="date" className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] font-semibold text-sm" />
 </div>
 </div>

 <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-start gap-4">
 <BrainCircuit size={24} className="text-[#4f46e5] flex-shrink-0" />
 <div>
 <h4 className="text-sm font-bold text-text-main mb-1">AI Context Injection</h4>
 <p className="text-xs font-medium text-text-sub leading-relaxed">The AI will automatically parse your previous mock exam mistakes and AceCoach chat logs to target your weakest topics first.</p>
 </div>
 </div>
 </div>

 <div className="mt-8 pt-6 border-t border-border-base flex justify-end gap-3">
 <button onClick={() => setShowAIModal(false)} className="px-6 py-3 rounded-xl font-bold bg-bg-surface-hover text-text-sub hover:bg-gray-200 transition-colors">Cancel</button>
 <button onClick={() => setShowAIModal(false)} className="px-8 py-3 rounded-xl font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md transition-all active:scale-95 flex items-center gap-2">
 <Sparkles size={18} /> Generate My Plan
 </button>
 </div>
 </div>
 </div>
 )}
 {/* Custom Auto-Planning Modal */}
 {showCustomPlanModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
 <div className="bg-bg-surface rounded-[32px] p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-300">
 <button onClick={() => setShowCustomPlanModal(false)} className="absolute top-6 right-6 text-text-muted hover:text-text-main p-2 bg-bg-surface-hover hover:bg-bg-surface-hover rounded-full transition-colors">
 <X size={20} />
 </button>

 <div className="flex items-center gap-3 mb-2 text-[#4f46e5]">
 <Plus size={24} />
 <span className="font-black uppercase tracking-widest text-sm">Add Custom Study Plan</span>
 </div>
 <h2 className="text-3xl font-black text-text-main mb-8">Design your own learning objective.</h2>

 <div className="space-y-6">
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Subject / Module</label>
 <input type="text" placeholder="e.g. SAT Math, React.js" className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] font-semibold text-sm" />
 </div>

 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Topic or Goal</label>
 <input type="text" placeholder="e.g. Complete 50 grid-in questions" className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] font-semibold text-sm" />
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Estimated Duration</label>
 <select className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] font-semibold text-sm">
 <option>15 Minutes</option>
 <option>30 Minutes</option>
 <option>1 Hour</option>
 <option>2 Hours</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-bold text-text-sub mb-2">Schedule Time</label>
 <input type="time" className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] font-semibold text-sm" />
 </div>
 </div>
 </div>

 <div className="mt-8 pt-6 border-t border-border-base flex justify-end gap-3">
 <button onClick={() => setShowCustomPlanModal(false)} className="px-6 py-3 rounded-xl font-bold bg-bg-surface-hover text-text-sub hover:bg-gray-200 transition-colors">Cancel</button>
 <button onClick={() => setShowCustomPlanModal(false)} className="px-8 py-3 rounded-xl font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white shadow-md transition-all active:scale-95 flex items-center gap-2">
 <CheckCircle2 size={18} /> Add to Plan
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </DashboardLayout>
 );
}
