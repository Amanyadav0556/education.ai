import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
    BarChart3, TrendingUp, CalendarDays, Award, BrainCircuit, Target,
    Clock, ArrowRight, Download, Share2, Flame, BookOpen, Zap, Settings,
    AlertCircle, ChevronRight, Activity, Code, MonitorSpeaker, PieChart, Focus, Map, Layout, ArrowUpRight, Plus, Eye, History, Bookmark, CheckCircle2
} from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, colorClass, increase, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md hover:border-purple-200 cursor-pointer active:scale-95 transition-all group">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <Icon size={18} className={colorClass.replace('bg-', 'text-').replace('-500', '-600')} />
            </div>
            {increase && <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-md"><ArrowUpRight size={12} /> {increase}</span>}
        </div>
        <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
    </div>
);

const SubjectCard = ({ title, progress, solved, total, accuracy, lastPracticed, icon: Icon, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] hover:border-purple-100 transition-all cursor-pointer group active:scale-95">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#9884d1] flex items-center justify-center group-hover:bg-[#9884d1] group-hover:text-white transition-colors">
                <Icon size={18} />
            </div>
            <div>
                <h4 className="font-extrabold text-gray-900 dark:text-white text-sm group-hover:text-[#9884d1] transition-colors">{title}</h4>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Last: {lastPracticed}</p>
            </div>
        </div>
        <div className="mb-2 flex justify-between items-center text-xs font-bold">
            <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Progress</span>
            <span className="text-[#9884d1]">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden relative">
            <div className="bg-[#9884d1] h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500">Solved</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{solved}<span className="text-xs text-gray-400 dark:text-gray-500">/{total}</span></p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                <p className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500">Accuracy</p>
                <p className="text-sm font-black text-emerald-600">{accuracy}%</p>
            </div>
        </div>
        <button className="w-full py-2.5 bg-gray-50 dark:bg-gray-700/50 group-hover:bg-purple-50 text-gray-700 dark:text-gray-300 group-hover:text-[#9884d1] font-bold text-xs rounded-xl transition-colors border border-transparent group-hover:border-purple-100 select-none">
            Continue Learning
        </button>
    </div>
);

const HeatmapCell = ({ intensity }) => {
    const colors = ['bg-gray-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-800'];
    return <div className={`w-3 h-3 rounded-[3px] ${colors[intensity]} hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer`} title={`Activity level: ${intensity}`}></div>;
};

export default function Progress() {
    const [selectedKpi, setSelectedKpi] = useState(null);

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto pb-20 space-y-8 animate-in fade-in duration-500 relative">

                {/* DETAILS POPUP MODAL */}
                {selectedKpi && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedKpi(null)}>
                        <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedKpi(null)} className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            <div className="flex items-center gap-4 mb-6 pt-2">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedKpi.colorClass} bg-opacity-10`}>
                                    <selectedKpi.icon size={26} className={selectedKpi.colorClass.replace('bg-', 'text-').replace('-500', '-600')} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{selectedKpi.title} Insights</h2>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">Current Standing: <span className={selectedKpi.colorClass.replace('bg-', 'text-').replace('-500', '-600')}>{selectedKpi.value}</span></p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Recent Trend</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                            {selectedKpi.increase || "Stable"}
                                            {selectedKpi.increase && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md uppercase tracking-wider">Improving</span>}
                                        </p>
                                    </div>
                                    <TrendingUp size={32} className="text-gray-200" />
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Activity size={12} /> 7-Day Performance Graph</p>
                                    <div className="h-28 w-full flex items-end gap-2 pb-2">
                                        {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                            <div key={i} className={`flex-1 rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-crosshair ${selectedKpi.colorClass}`} style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-extrabold text-gray-300 mt-2 px-1">
                                        <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setSelectedKpi(null)} className={`w-full py-4 rounded-xl font-black text-white ${selectedKpi.colorClass} shadow-md shadow-${selectedKpi.colorClass.split('-')[1]}-200 transition-transform active:scale-95`}>
                                Close Details
                            </button>
                        </div>
                    </div>
                )}

                {/* 1. HERO SECTION */}
                <div className="bg-gradient-to-br from-[#9884d1] to-purple-900 text-white p-8 rounded-[32px] relative overflow-hidden shadow-[0_15px_40px_rgba(79,70,229,0.3)]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white dark:bg-gray-800/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="max-w-xl">
                            <span className="inline-block px-3 py-1 bg-white dark:bg-gray-800/20 rounded-lg text-[10.5px] font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-md">Learning Analytics</span>
                            <h1 className="text-3xl font-black mb-3">Your Learning Progress</h1>
                            <p className="text-purple-100 font-medium text-sm leading-relaxed max-w-md">Track your journey, celebrate milestones, and discover where an AI-driven push can help you improve next.</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none justify-center bg-white dark:bg-gray-800/10 hover:bg-white dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs transition-colors flex items-center gap-2">
                                <Download size={14} /> Export Report
                            </button>
                            <button className="flex-1 md:flex-none justify-center bg-white dark:bg-gray-800 text-[#9884d1] hover:bg-purple-50 px-6 py-3 rounded-xl font-black text-xs shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-transform active:scale-95 flex items-center gap-2">
                                <Share2 size={14} /> Share
                            </button>
                        </div>
                    </div>

                    {/* Dark Compact Overview inside Hero */}
                    <div className="relative z-10 grid grid-cols-2 lg:grid-cols-6 gap-3 mt-8 bg-black/20 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                        <div className="text-center px-4 py-2 border-r border-white/10 last:border-0 lg:last:border-r-0 lg:border-white/10">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Completion</p>
                            <p className="text-xl font-black text-white">42%</p>
                        </div>
                        <div className="text-center px-4 py-2 border-r border-white/10 last:border-0 lg:last:border-r-0 lg:border-white/10">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Score</p>
                            <p className="text-xl font-black text-white">880</p>
                        </div>
                        <div className="text-center px-4 py-2 border-r border-white/10 lg:border-white/10">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Streak</p>
                            <p className="text-xl font-black text-yellow-400 flex items-center justify-center gap-1"><Flame size={16} /> 14</p>
                        </div>
                        <div className="text-center px-4 py-2 border-r border-white/10 last:border-0 lg:last:border-r-0 lg:border-white/10">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Hours</p>
                            <p className="text-xl font-black text-white">76.5</p>
                        </div>
                        <div className="text-center px-4 py-2 border-r border-white/10 last:border-0 lg:last:border-r-0 lg:border-white/10">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Solved</p>
                            <p className="text-xl font-black text-white">345</p>
                        </div>
                        <div className="text-center px-4 py-2">
                            <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider mb-1">Resources</p>
                            <p className="text-xl font-black text-white">28</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT MAIN CONTENT (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">

                        {/* 5. Performance Analytics KPI Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <KPICard title="Study Hours" value="76.5h" icon={Clock} colorClass="bg-blue-500" increase="+2.4h" onClick={() => setSelectedKpi({ title: "Study Hours", value: "76.5h", icon: Clock, colorClass: "bg-blue-500", increase: "+2.4h" })} />
                            <KPICard title="Accuracy" value="82%" icon={Target} colorClass="bg-emerald-500" increase="+5%" onClick={() => setSelectedKpi({ title: "Accuracy", value: "82%", icon: Target, colorClass: "bg-emerald-500", increase: "+5%" })} />
                            <KPICard title="Consistency" value="High" icon={Activity} colorClass="bg-purple-500" onClick={() => setSelectedKpi({ title: "Consistency", value: "High", icon: Activity, colorClass: "bg-purple-500", increase: "" })} />
                            <KPICard title="Avg Session" value="45m" icon={Focus} colorClass="bg-amber-500" increase="+3m" onClick={() => setSelectedKpi({ title: "Avg Session", value: "45m", icon: Focus, colorClass: "bg-amber-500", increase: "+3m" })} />
                        </div>

                        {/* 4. Weekly Activity Heatmap */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2"><CalendarDays size={20} className="text-[#9884d1]" /> Activity Map</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500">
                                    <span>Less</span>
                                    {/* Legend */}
                                    <div className="flex gap-1"><HeatmapCell intensity={0} /><HeatmapCell intensity={1} /><HeatmapCell intensity={2} /><HeatmapCell intensity={3} /><HeatmapCell intensity={4} /></div>
                                    <span>More</span>
                                </div>
                            </div>
                            {/* Fake 52 weeks x 7 days heatmap */}
                            <div className="overflow-x-auto pb-2 custom-scrollbar">
                                <div className="inline-flex flex-col gap-1.5 min-w-max">
                                    {Array.from({ length: 7 }).map((_, day) => (
                                        <div key={day} className="flex gap-1.5">
                                            {Array.from({ length: 30 }).map((_, week) => (
                                                <HeatmapCell key={week} intensity={Math.floor(Math.random() * (week > 20 ? 5 : 3))} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 dark:border-gray-700/50 pt-5">
                                <div className="text-center"><p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">Days Studied</p><p className="text-lg font-black text-gray-900 dark:text-white">42</p></div>
                                <div className="text-center"><p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">Missed Days</p><p className="text-lg font-black text-gray-900 dark:text-white">14</p></div>
                                <div className="text-center"><p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">Intensity</p><p className="text-lg font-black text-[#9884d1]">High</p></div>
                            </div>
                        </div>

                        {/* 3. Subject Progress */}
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2"><BookOpen size={20} className="text-[#9884d1]" /> Subject Progress</h3>
                                <button className="text-xs font-bold text-[#9884d1] hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <SubjectCard onClick={() => setSelectedKpi({ title: "DSA Mocks", value: "78%", icon: Code, colorClass: "bg-purple-500", increase: "+12%" })} title="Data Structures & Algos" progress={78} solved={245} total={300} accuracy={84} lastPracticed="Yesterday" icon={Code} />
                                <SubjectCard onClick={() => setSelectedKpi({ title: "Frontend", value: "45%", icon: Layout, colorClass: "bg-blue-500", increase: "+4%" })} title="Frontend Development" progress={45} solved={45} total={120} accuracy={92} lastPracticed="2 days ago" icon={Layout} />
                                <SubjectCard onClick={() => setSelectedKpi({ title: "CS Topics", value: "90%", icon: MonitorSpeaker, colorClass: "bg-emerald-500", increase: "" })} title="CS Fundamentals" progress={90} solved={115} total={120} accuracy={76} lastPracticed="Today" icon={MonitorSpeaker} />
                                <SubjectCard onClick={() => setSelectedKpi({ title: "Aptitude", value: "20%", icon: BrainCircuit, colorClass: "bg-amber-500", increase: "+1%" })} title="Aptitude & Logic" progress={20} solved={20} total={200} accuracy={60} lastPracticed="A week ago" icon={BrainCircuit} />
                            </div>
                        </div>

                        {/* 6. Skill Progress */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Target size={20} className="text-[#9884d1]" /> Skill Mastery</h3>
                            <div className="space-y-5">
                                {[
                                    { name: "Arrays & Strings", val: 90 },
                                    { name: "Binary Search", val: 72 },
                                    { name: "Recursion", val: 51 },
                                    { name: "Dynamic Programming", val: 20 },
                                ].map((skill, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-bold text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#9884d1] transition-colors">{skill.name}</span>
                                            <span className="font-black text-sm text-gray-900 dark:text-white">{skill.val}%</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#9884d1] to-purple-400 rounded-full group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-300" style={{ width: `${skill.val}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 12. Compare Progress (Chart Mockup) */}
                        <div className="bg-white dark:bg-gray-800 p-7 rounded-[32px] border border-gray-100 dark:border-gray-700/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] pb-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2"><TrendingUp size={20} className="text-[#9884d1]" /> Accuracy Trend</h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-black uppercase bg-purple-50 text-[#9884d1] px-2 py-1 rounded-md">This Month</span>
                                    <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 dark:text-gray-400 dark:text-gray-500 px-2 py-1 rounded-md">Last Month</span>
                                </div>
                            </div>
                            <div className="relative h-48 w-full border-b border-l border-gray-100 dark:border-gray-700/50">
                                {/* Simulated SVG Line Chart */}
                                <svg className="w-full h-full text-[#9884d1]" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,80 Q25,60 50,40 T100,10" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                    <circle cx="100" cy="10" r="3" fill="currentColor" />
                                </svg>
                                <svg className="absolute inset-0 w-full h-full text-gray-300" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,90 Q25,85 50,70 T100,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
                                </svg>
                                {/* Grid lines labels */}
                                <div className="absolute -left-6 bottom-0 text-[10px] text-gray-400 dark:text-gray-500 font-bold">0%</div>
                                <div className="absolute -left-8 top-0 text-[10px] text-gray-400 dark:text-gray-500 font-bold">100%</div>
                                <div className="absolute left-0 -bottom-6 text-[10px] text-gray-400 dark:text-gray-500 font-bold">W1</div>
                                <div className="absolute right-0 -bottom-6 text-[10px] text-gray-400 dark:text-gray-500 font-bold">W4</div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* 2. Learning Overview Card */}
                        <div className="bg-gradient-to-br from-[#f8f9ff] to-white p-6 rounded-[32px] border border-purple-100/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2 relative z-10"><PieChart size={18} className="text-[#9884d1]" /> Learning Overview</h3>
                            <div className="flex justify-center mb-6 relative z-10">
                                <div className="relative w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                        <circle cx="50" cy="50" r="40" stroke="#9884d1" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="145" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white">42<span className="text-sm">%</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center text-sm font-bold bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Weekly Impr.</span>
                                    <span className="text-emerald-500">+8.5%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Topics Mastered</span>
                                    <span className="text-gray-900 dark:text-white">14 / 85</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                    <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Goal ETA</span>
                                    <span className="text-purple-600">Nov 2026</span>
                                </div>
                            </div>
                        </div>

                        {/* 7. AI Progress Insights (Amber/purple style) */}
                        <div className="bg-purple-950 !text-white p-6 rounded-[32px] shadow-[0_15px_40px_rgba(30,27,75,0.3)] relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[50px] group-hover:bg-amber-500/30 transition-colors duration-700"></div>
                            <h3 className="font-extrabold !text-white mb-5 flex items-center gap-2 relative z-10"><BrainCircuit size={18} className="text-amber-400" /> AI Progress Insights</h3>

                            <div className="bg-purple-900/50 p-4 rounded-2xl border border-purple-800 mb-4 relative z-10">
                                <p className="text-[10px] font-black !text-amber-300 uppercase tracking-widest mb-2"><AlertCircle size={10} className="inline mr-1" />Observation</p>
                                <p className="text-[13px] font-semibold !text-purple-50 leading-relaxed">
                                    "You improved your Binary Search accuracy by 18% this week, but you haven't revised Linked Lists in 8 days."
                                </p>
                            </div>

                            <div className="space-y-2 relative z-10">
                                <button className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:bg-gray-700/50 !text-[#9884d1] py-3 rounded-xl font-black text-xs shadow-sm transition-transform active:scale-95 text-center">
                                    Revise Linked Lists Now
                                </button>
                                <button className="w-full bg-transparent hover:bg-purple-900 !text-purple-300 border border-purple-700 py-3 rounded-xl font-bold text-xs transition-colors text-center">
                                    Update Study Plan
                                </button>
                            </div>
                        </div>

                        {/* 10. Recommended Next Steps */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Map size={18} className="text-[#9884d1]" /> Recommended Next</h3>
                            <div className="space-y-3">
                                {[
                                    { t: 'Practice Sliding Window', desc: 'Builds on Arrays mastery', icon: Code },
                                    { t: 'Generate React Notes', desc: 'Consolidate front-end learning', icon: Bookmark },
                                    { t: 'Attempt Weekly Mock', desc: 'Assess retention', icon: Target },
                                ].map((rec, i) => (
                                    <div key={i} className="flex gap-3 p-3 border border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:border-purple-200 hover:bg-purple-50/50 transition-colors cursor-pointer group">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center group-hover:text-[#9884d1] group-hover:border-[#9884d1]"><rec.icon size={14} /></div>
                                        <div>
                                            <p className="text-xs font-extrabold text-gray-900 dark:text-white">{rec.t}</p>
                                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">{rec.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 9. Goals Tracker */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-sm">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2"><Target size={18} className="text-emerald-500" /> Active Goals</h3>
                                <button className="text-gray-400 dark:text-gray-500 hover:text-[#9884d1] bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 p-1.5 rounded-lg transition-colors"><Plus size={16} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700 dark:text-gray-300">Complete Arrays</span><span className="text-emerald-600">82%</span></div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className="w-[82%] h-full bg-emerald-500 rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700 dark:text-gray-300">Solve 300 Problems</span><span className="text-[#9884d1]">245 / 300</span></div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className="w-[80%] h-full bg-[#9884d1] rounded-full"></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-gray-700 dark:text-gray-300">Maintain 30-Day Streak</span><span className="text-yellow-500">18 / 30</span></div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className="w-[60%] h-full bg-yellow-400 rounded-full"></div></div>
                                </div>
                            </div>
                        </div>

                        {/* 8. Milestones & 11. Recent Activity combined feel */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700/50/50 shadow-sm">
                            <h3 className="font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Award size={18} className="text-yellow-500" /> Recent Milestones</h3>
                            <div className="relative border-l-2 border-gray-100 dark:border-gray-700/50 ml-3 space-y-5 pb-2">
                                <div className="relative">
                                    <span className="absolute -left-[23px] w-5 h-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600"><Award size={10} /></span>
                                    <div className="ml-4">
                                        <p className="text-xs font-extrabold text-gray-900 dark:text-white">100 Problems Solved</p>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[23px] w-5 h-5 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[#9884d1]"><Flame size={10} /></span>
                                    <div className="ml-4">
                                        <p className="text-xs font-extrabold text-gray-900 dark:text-white">14-Day Study Streak</p>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">Yesterday</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[23px] w-5 h-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-500 dark:text-gray-400 dark:text-gray-500"><CheckCircle2 size={10} /></span>
                                    <div className="ml-4">
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Finished Arrays Subject</p>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 text-gray-600 dark:text-gray-300 font-bold text-xs py-2 rounded-xl transition-colors border border-gray-200 dark:border-gray-700">View All History</button>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
