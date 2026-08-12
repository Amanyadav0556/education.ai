import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Search, PlayCircle, FileText, UploadCloud, BrainCircuit, Mic2, FileQuestion, BookOpen, Star, Filter, ArrowRight, Zap, Target, Bookmark, Sparkles, MessageSquare, ThumbsUp, Eye, CheckCircle2, Award, Clock, ArrowUpCircle, Calculator, Atom, FlaskConical, Monitor, Book, FileCode2, Download, Maximize, Share2, Save, Loader2, ChevronRight, FileOutput, PenTool, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function PracticeHub() {
 const { user } = useAuth();
 const [searchQuery, setSearchQuery] = useState('');
 const [activeTab, setActiveTab] = useState('Overview');

 const tabs = ['Overview', 'Free Courses', 'Test Series', 'Community Doubts', 'Free Resources'];

 // Free Resources State
 const [selectedResSubject, setSelectedResSubject] = useState(null);
 const [selectedResTopic, setSelectedResTopic] = useState(null);
 const [selectedResType, setSelectedResType] = useState(null);
 const [isGeneratingRes, setIsGeneratingRes] = useState(false);
 const [isResGenerated, setIsResGenerated] = useState(false);

 // Doubt Upload State
 const [doubtFile, setDoubtFile] = useState(null);
 const doubtFileRef = React.useRef(null);

 // Free Resources Data
 const resourceSubjects = [
 { id: 'math', name: 'Mathematics', icon: Calculator, color: 'text-blue-500', bg: 'bg-blue-500/10' },
 { id: 'physics', name: 'Physics', icon: Atom, color: 'text-purple-500', bg: 'bg-purple-500/10' },
 { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
 { id: 'cs', name: 'Computer Science', icon: Monitor, color: 'text-indigo-500', bg: 'bg-primary/10' },
 { id: 'english', name: 'English', icon: Book, color: 'text-rose-500', bg: 'bg-rose-500/10' }
 ];

 const topicMap = {
 'math': ['Algebra Foundations', 'Quadratic Equations', 'Advanced Trigonometry', 'Coordinate Geometry', 'Calculus I'],
 'physics': ['Kinematics', 'Newtonian Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics Intro'],
 'chemistry': ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Stoichiometry', 'Acids and Bases'],
 'cs': ['Data Structures', 'Binary Search Trees', 'Dynamic Programming', 'Object Oriented Programming'],
 'english': ['Reading Comprehension', 'Grammar & Punctuation', 'Essay Structure', 'Vocabulary Mastery']
 };

 const resourceTypes = [
 { id: 'ai-notes', name: 'AI Notes', desc: 'Concise AI-generated study notes', icon: BrainCircuit, color: 'text-[#4f46e5]', bg: 'bg-primary/10' },
 { id: 'ai-ppt', name: 'AI PPT', desc: 'Slide-based presentation', icon: FileOutput, color: 'text-orange-500', bg: 'bg-orange-500/10' },
 { id: 'handwritten', name: 'Handwritten Notes', desc: 'Handwritten-style study material', icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
 { id: 'quick-rev', name: 'Quick Revision', desc: 'Important formulas & key points', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
 ];

 const handleGenerateResource = () => {
 setIsGeneratingRes(true);
 setTimeout(() => {
 setIsGeneratingRes(false);
 setIsResGenerated(true);
 }, 2500); // Mock 2.5s generation time
 };

 // MOCK DATA
 const freeCourses = [
 { id: 1, title: 'CS50: Introduction to Computer Science', platform: 'Harvard CS50', duration: '12 Weeks', difficulty: 'Beginner', rating: 4.9 },
 { id: 2, title: 'Algorithms, Part I', platform: 'Coursera', duration: '6 Weeks', difficulty: 'Intermediate', rating: 4.8 }
 ];

 const testSeries = [
 { id: 1, title: 'Official SAT Practice Test 1', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Hard' },
 { id: 2, title: 'Official SAT Practice Test 2', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Medium' },
 { id: 3, title: 'Math No-Calculator Mastery', platform: 'AceCoach Engine', questions: 20, time: '25 min', difficulty: 'Advanced' },
 { id: 4, title: 'Writing & Language Diagnostic', platform: 'Khan Academy', questions: 44, time: '35 min', difficulty: 'Medium' },
 { id: 5, title: 'Official SAT Practice Test 3', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Hard' },
 { id: 6, title: 'Reading Comprehension Speed Test', platform: 'Princeton Review', questions: 52, time: '65 min', difficulty: 'Advanced' },
 { id: 7, title: 'SAT Math Grid-ins Focus', platform: 'AceCoach Engine', questions: 13, time: '20 min', difficulty: 'Hard' },
 { id: 8, title: 'Official SAT Practice Test 4', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Medium' },
 { id: 9, title: 'Grammar & Punctuation Drill', platform: 'Khan Academy', questions: 30, time: '25 min', difficulty: 'Beginner' },
 { id: 10, title: 'Official SAT Practice Test 5', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Expert' },
 { id: 11, title: 'Advanced Algebra Diagnostic', platform: 'College Prep', questions: 25, time: '40 min', difficulty: 'Hard' },
 { id: 12, title: 'Full-Length SAT Practice Test 6', platform: 'CollegeBoard', questions: 98, time: '134 min', difficulty: 'Advanced' }
 ];

 const communityDoubts = [
 { id: 1, author: 'Alex Chen', title: 'How do you quickly solve circle equation problems on the No-Calculator section?', subject: 'SAT Math', tags: ['#SATMath', '#Geometry', '#CircleEquations'], upvotes: 128, views: 405, answers: 3, resolved: true, aiVerified: true, time: '2h ago', level: 'Expert' },
 { id: 2, author: 'Sarah Jenkins', title: 'What is the best strategy for reading Science passages without running out of time?', subject: 'SAT Reading', tags: ['#Reading', '#TimeManagement', '#Science'], upvotes: 95, views: 230, answers: 4, resolved: false, aiVerified: false, time: '5h ago', level: 'Intermediate' },
 { id: 3, author: 'David Kim', title: 'When should I use a semicolon vs a colon in the Writing module?', subject: 'SAT Writing', tags: ['#Grammar', '#Punctuation', '#Writing'], upvotes: 312, views: 890, answers: 5, resolved: true, aiVerified: true, time: '1d ago', level: 'Beginner' }
 ];

 const externalCourses = [
 { id: 1, title: 'Complete SAT Math Crash Course', platform: 'Scalar Learning', embedId: '1bTkbmHx944', duration: 'Full Course', difficulty: 'Advanced', tags: ['#SATMath', '#CrashCourse', '#Strategies'], exams: ['SAT'] },
 { id: 2, title: 'SAT Reading Comprehension Masterclass', platform: 'PrepPros', embedId: 'NBECQxDBQQs', duration: '1h 30m', difficulty: 'Intermediate', tags: ['#SATReading', '#SpeedReading'], exams: ['SAT'] },
 { id: 3, title: 'SAT Grammar & Writing Bootcamp', platform: 'Khan Academy', embedId: 'd6Ndr2Sg3_A', duration: 'Full Course', difficulty: 'Beginner', tags: ['#SATWriting', '#Grammar', '#Punctuation'], exams: ['SAT'] },
 { id: 4, title: 'Desmos Calculator Tricks for SAT', platform: 'Tutorllini', embedId: 'jCT0jTVzKy0', duration: '45m', difficulty: 'Intermediate', tags: ['#SATMath', '#Desmos', '#Tricks'], exams: ['SAT'] }
 ];

 const targetExam = user?.targetExam || 'SAT';

 // Filter courses relevant to the user's exam, or allow general knowledge courses
 const relevantCourses = externalCourses.filter(course =>
 course.exams.includes(targetExam) || course.exams.includes('General')
 );

 return (
 <DashboardLayout>
 <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">

 {/* Header & Internal Navigation */}
 <div className="sticky top-0 z-10 bg-bg-base/90 backdrop-blur-xl pt-2 pb-4">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
 <div>
 <h1 className="text-3xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
 Practice Hub
 </h1>
 <p className="text-text-sub font-medium mt-1 text-[15px]">Your centralized learning library for tests, courses, and doubts.</p>
 </div>

 <div className="flex items-center gap-4 bg-bg-surface p-2 rounded-2xl shadow-sm border border-border-base">
 <div className="px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-100 flex items-center gap-2">
 <Zap size={18} className="text-amber-500" />
 <div>
 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Streak</p>
 <p className="text-sm font-bold text-amber-700 leading-none">12 Days</p>
 </div>
 </div>
 <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
 <Target size={18} className="text-[#4f46e5]" />
 <div>
 <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">XP Points</p>
 <p className="text-sm font-bold text-indigo-700 leading-none">2,450 XP</p>
 </div>
 </div>
 </div>
 </div>

 {/* Global Search */}
 <div className="relative mb-6">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
 <input
 type="text"
 placeholder="Search anything (Courses, Tests, Doubts, PDFs)..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-bg-surface border border-border-strong text-text-main rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-[#4f46e5]/10 focus:border-[#4f46e5] transition-all font-medium text-[15px] shadow-sm"
 />
 <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-bg-surface-hover hover:bg-bg-surface-hover rounded-xl text-text-sub transition-colors border border-border-strong">
 <Filter size={18} />
 </button>
 </div>

 {/* Tab Navigation */}
 <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-border-strong pb-px">
 {tabs.map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`whitespace-nowrap px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 ${activeTab === tab
 ? 'text-[#4f46e5] border-[#4f46e5] bg-bg-surface pt-3'
 : 'text-text-sub border-transparent hover:text-text-sub hover:bg-bg-surface-hover/50'
 }`}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>

 {/* --- TAB ROUTING CONTENT --- */}
 {activeTab === 'Overview' && (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

 {/* Bento Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { title: 'Free Courses', active: 12, icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', link: 'Free Courses' },
 { title: 'Mock Tests', active: 5, icon: FileQuestion, color: 'text-violet-500', bg: 'bg-violet-50', link: 'Test Series' },
 { title: 'Community Doubts', active: 89, icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10', link: 'Community Doubts' },
 { title: 'Resources', active: 34, icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10', link: 'Free Resources' }
 ].map((bento, i) => (
 <button key={i} onClick={() => setActiveTab(bento.link)} className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col justify-between min-h-[160px]">
 <div className={`w-12 h-12 ${bento.bg} ${bento.color} rounded-2xl flex items-center justify-center mb-4`}>
 <bento.icon size={24} />
 </div>
 <div>
 <h3 className="font-bold text-text-main text-lg">{bento.title}</h3>
 <p className="text-sm font-medium text-text-muted">{bento.active} new items</p>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {activeTab === 'Community Doubts' && (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
 {/* Elite Doubt Composer */}
 <div className="bg-bg-surface p-6 rounded-3xl border border-border-base shadow-sm relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>

 <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2 relative z-10">
 Ask the Community <Sparkles size={20} className="text-[#4f46e5]" />
 </h2>

 <div className="space-y-4 relative z-10">
 <input
 type="text"
 placeholder="Title: e.g. How do you solve question 15 on SAT Math Section 3?"
 className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl px-4 py-3 outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] font-semibold text-sm"
 />
 <textarea
 rows="3"
 placeholder="Describe your doubt... You can paste questions, screenshots of the test, or explain your approach."
 className="w-full bg-bg-surface-hover border border-border-strong rounded-xl p-4 text-sm font-medium text-text-main focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] resize-none"
 ></textarea>

 <div className="flex flex-wrap items-center justify-between gap-4">
 <div className="flex flex-col gap-2">
 <div className="flex gap-2">
 <input type="file" ref={doubtFileRef} onChange={(e) => {
 if (e.target.files[0]) setDoubtFile(e.target.files[0]);
 }} className="hidden" accept="image/*,.pdf" />
 <button onClick={() => doubtFileRef.current?.click()} className="px-3 py-2 text-text-sub hover:text-[#4f46e5] hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"><UploadCloud size={16} /> Image/PDF</button>
 <button className="px-3 py-2 text-text-sub hover:text-[#4f46e5] hover:bg-primary/10 border border-transparent hover:border-primary/20 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"><Mic2 size={16} /> Voice</button>
 </div>
 {doubtFile && (
 <div className="flex items-center gap-2 bg-primary/10 text-[#4f46e5] px-3 py-1.5 rounded-lg border border-primary/20 w-max">
 <FileText size={14} />
 <span className="text-xs font-bold truncate max-w-[150px]">{doubtFile.name}</span>
 <button onClick={() => setDoubtFile(null)} className="hover:text-red-500 ml-1"><X size={14} /></button>
 </div>
 )}
 </div>
 <div className="flex gap-3 mt-auto">
 <button className="bg-bg-surface-hover hover:bg-gray-200 text-text-sub px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">Save Draft</button>
 <button onClick={() => setDoubtFile(null)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95">Post Doubt</button>
 </div>
 </div>
 </div>
 </div>

 {/* Top Navigation for Feed */}
 <div className="flex items-center justify-between mt-8 mb-4">
 <h3 className="text-lg font-bold text-text-main">Trending Discussions</h3>
 <div className="flex bg-bg-surface-hover p-1 rounded-xl">
 <button className="px-4 py-1.5 text-sm font-bold bg-bg-surface text-text-main rounded-lg shadow-sm">Hot</button>
 <button className="px-4 py-1.5 text-sm font-bold text-text-sub hover:text-text-main">Latest</button>
 <button className="px-4 py-1.5 text-sm font-bold text-text-sub hover:text-text-main">Unanswered</button>
 </div>
 </div>

 {/* Feed Cards */}
 <div className="space-y-4">
 {communityDoubts.map(doubt => (
 <div key={doubt.id} className="bg-bg-surface p-6 rounded-2xl border border-border-base shadow-[0_2px_8px_rgb(0,0,0,0.02)] hover:border-indigo-200 transition-all group flex gap-5 cursor-pointer">

 {/* Upvotes Column */}
 <div className="flex flex-col items-center gap-1 min-w-[50px]">
 <button className="p-1 text-text-muted hover:text-[#4f46e5] hover:bg-primary/10 rounded"><ArrowUpCircle size={22} /></button>
 <span className="font-black text-text-sub">{doubt.upvotes}</span>
 </div>

 {/* Content Column */}
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
 {doubt.resolved && (
 <span className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"><CheckCircle2 size={12} /> Solved</span>
 )}
 {doubt.aiVerified && (
 <span className="flex items-center gap-1 bg-primary/10 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"><Award size={12} /> AI Verified</span>
 )}
 <span className="text-xs font-bold text-text-muted ml-auto flex items-center gap-1"><Clock size={12} /> {doubt.time}</span>
 </div>

 <h3 className="text-[17px] font-bold text-text-main group-hover:text-[#4f46e5] transition-colors mb-2">{doubt.title}</h3>

 <div className="flex flex-wrap items-center gap-2 mb-4">
 {doubt.tags.map(tag => (
 <span key={tag} className="text-[11px] font-bold text-text-sub bg-bg-surface-hover px-2 py-1 rounded-md">{tag}</span>
 ))}
 <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-100">{doubt.subject}</span>
 </div>

 <div className="flex items-center justify-between border-t border-gray-50 pt-4">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
 {doubt.author.charAt(0)}
 </div>
 <span className="text-xs font-bold text-text-sub">{doubt.author}</span>
 <span className="text-[10px] font-bold text-text-muted bg-bg-surface-hover px-1.5 py-0.5 rounded">{doubt.level}</span>
 </div>
 <div className="flex items-center gap-4 text-xs font-bold text-text-muted">
 <span className="flex items-center gap-1 hover:text-text-sub"><MessageSquare size={14} /> {doubt.answers} Answers</span>
 <span className="flex items-center gap-1"><Eye size={14} /> {doubt.views}</span>
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* --- FREE COURSES TAB --- */}
 {activeTab === 'Free Courses' && (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {relevantCourses.map(course => (
 <div key={course.id} className="bg-bg-surface rounded-3xl border border-border-base shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden group hover:shadow-lg transition-all">
 <div className="w-full aspect-video bg-gray-900 relative">
 <iframe
 className="absolute top-0 left-0 w-full h-full"
 src={`https://www.youtube.com/embed/${course.embedId}`}
 title={course.title}
 frameBorder="0"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowFullScreen
 ></iframe>
 </div>
 <div className="p-6">
 <div className="flex items-center gap-2 mb-3">
 <span className="text-[10px] font-bold text-text-sub bg-bg-surface-hover px-2 py-0.5 rounded-md uppercase tracking-wider">{course.platform}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${course.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' : course.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-50 text-red-600'}`}>{course.difficulty}</span>
 </div>
 <h3 className="text-lg font-bold text-text-main group-hover:text-[#4f46e5] transition-colors mb-2 line-clamp-1">{course.title}</h3>
 <div className="flex flex-wrap items-center gap-2 mb-5">
 {course.tags.map(tag => (
 <span key={tag} className="text-[11px] font-bold text-indigo-600 bg-primary/5 border border-primary/20 px-2 py-1 rounded-md">{tag}</span>
 ))}
 <span className="flex text-[11px] font-bold text-text-muted items-center gap-1 ml-auto"><Clock size={12} /> {course.duration}</span>
 </div>

 <div className="flex items-center gap-3">
 <button className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 justify-center">
 Add to Study Plan <ArrowRight size={16} />
 </button>
 <button className="p-2.5 text-text-muted hover:text-[#4f46e5] hover:bg-primary/10 rounded-xl transition-colors border border-border-base"><Bookmark size={18} /></button>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* --- TEST SERIES TAB --- */}
 {activeTab === 'Test Series' && (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
 <div className="flex items-center justify-between mb-2">
 <div>
 <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
 <FileQuestion size={22} className="text-violet-600" /> Premium Mock Tests
 </h2>
 <p className="text-sm font-medium text-text-sub mt-1">Simulate real exam environments with timed, high-fidelity mock tests.</p>
 </div>
 <button className="text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition-colors text-right flex flex-col items-center">
 Filter by Platform
 </button>
 </div>

 <div className="grid grid-cols-1 gap-4">
 {testSeries.map((test, index) => (
 <div key={test.id} className="bg-bg-surface p-5 rounded-2xl border border-border-base shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-200 hover:shadow-md transition-all">
 <div className="flex items-center gap-5">
 <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center font-black text-lg border border-violet-100/50 shadow-sm">
 #{index + 1}
 </div>
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="text-[10px] font-bold text-text-sub bg-bg-surface-hover px-2 py-0.5 rounded-md uppercase tracking-wider">{test.platform}</span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${test.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' :
 test.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600' :
 test.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-600' :
 'bg-red-50 text-red-600'
 }`}>{test.difficulty}</span>
 </div>
 <h4 className="font-extrabold text-text-main text-[16px]">{test.title}</h4>
 <p className="text-sm text-text-sub font-medium flex gap-2 items-center mt-1">
 <span className="flex items-center gap-1"><FileQuestion size={14} /> {test.questions} Questions</span>
 •
 <span className="flex items-center gap-1"><Clock size={14} /> {test.time}</span>
 </p>
 </div>
 </div>
 <div className="flex items-center gap-3 sm:w-auto w-full">
 <button className="p-3 text-text-muted hover:text-text-sub hover:bg-bg-surface-hover rounded-xl transition-colors border border-border-base shadow-sm"><Bookmark size={18} /></button>
 <button className="flex-1 sm:flex-none text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 px-8 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-center">Attempt Test</button>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* --- FREE RESOURCES TAB --- */}
 {activeTab === 'Free Resources' && (
 <div className="animate-in fade-in slide-in-from-bottom-4">

 {!isResGenerated ? (
 <div className="space-y-8">
 <div className="bg-gradient-to-r from-bg-surface-hover to-bg-surface border border-primary/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
 <div>
 <div className="flex items-center gap-2 mb-2 text-[#4f46e5]">
 <Sparkles size={20} />
 <span className="text-sm font-black uppercase tracking-wider">AI Resource Generator</span>
 </div>
 <h2 className="text-2xl font-bold text-text-main mb-2">Build Your Perfect Study Tool</h2>
 <p className="text-text-sub font-medium">Select your subject, topic, and preferred medium to instantly generate a high-yield study resource.</p>
 </div>
 <div className="flex items-center gap-2 p-3 bg-bg-surface rounded-2xl shadow-sm border border-border-base whitespace-nowrap">
 <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${selectedResSubject ? 'bg-green-100 text-green-600' : 'bg-bg-surface-hover text-text-muted'}`}>1</span>
 <ChevronRight size={16} className="text-gray-300" />
 <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${selectedResTopic ? 'bg-green-100 text-green-600' : 'bg-bg-surface-hover text-text-muted'}`}>2</span>
 <ChevronRight size={16} className="text-gray-300" />
 <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${selectedResType ? 'bg-green-100 text-green-600' : 'bg-bg-surface-hover text-text-muted'}`}>3</span>
 </div>
 </div>

 <div className="space-y-6 bg-bg-surface p-6 sm:p-8 rounded-[32px] border border-border-base shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
 {/* Step 1: Subject */}
 <div>
 <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-indigo-100 text-[#4f46e5] rounded-full flex items-center justify-center text-xs font-black">1</div> Select Subject</h3>
 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
 {resourceSubjects.map(sub => (
 <button
 key={sub.id}
 onClick={() => { setSelectedResSubject(sub.id); setSelectedResTopic(null); }}
 className={`p-4 rounded-2xl border transition-all text-left flex flex-col items-center justify-center gap-3 active:scale-95 ${selectedResSubject === sub.id ? 'border-[#4f46e5] bg-primary/5 shadow-sm ring-1 ring-[#4f46e5]' : 'border-border-base hover:border-border-strong bg-bg-surface'
 }`}
 >
 <div className={`p-3 rounded-xl ${sub.bg} ${sub.color}`}>
 <sub.icon size={24} />
 </div>
 <span className={`text-sm font-bold ${selectedResSubject === sub.id ? 'text-[#4f46e5]' : 'text-text-sub'}`}>{sub.name}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Step 2: Topic */}
 {selectedResSubject && (
 <div className="pt-6 border-t border-gray-50 animate-in fade-in duration-300">
 <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-indigo-100 text-[#4f46e5] rounded-full flex items-center justify-center text-xs font-black">2</div> Select Topic</h3>

 <div className="relative mb-4">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
 <input type="text" placeholder={`Search ${resourceSubjects.find(s => s.id === selectedResSubject)?.name} topics...`} className="w-full bg-bg-surface-hover border border-border-strong text-text-main rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] text-sm font-medium" />
 </div>

 <div className="flex flex-wrap gap-3">
 {topicMap[selectedResSubject].map(topic => (
 <button
 key={topic}
 onClick={() => setSelectedResTopic(topic)}
 className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all active:scale-95 ${selectedResTopic === topic ? 'border-[#4f46e5] bg-[#4f46e5] text-white shadow-sm' : 'border-border-strong bg-bg-surface text-text-sub hover:border-border-strong'
 }`}
 >
 {topic}
 </button>
 ))}
 </div>

 <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-100 rounded-lg px-3 py-2 w-fit">
 <Sparkles size={14} /> Recommended based on your recent AI Chat: Quadratic Equations
 </div>
 </div>
 )}

 {/* Step 3: Type */}
 {selectedResTopic && (
 <div className="pt-6 border-t border-gray-50 animate-in fade-in duration-300">
 <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-indigo-100 text-[#4f46e5] rounded-full flex items-center justify-center text-xs font-black">3</div> Select Resource Type</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {resourceTypes.map(type => (
 <button
 key={type.id}
 onClick={() => setSelectedResType(type.id)}
 className={`p-5 rounded-2xl border transition-all text-left group active:scale-95 flex flex-col justify-between ${selectedResType === type.id ? 'border-[#4f46e5] bg-primary/10/30 shadow-sm ring-1 ring-[#4f46e5]' : 'border-border-base hover:border-border-strong bg-bg-surface'
 }`}
 >
 <div className={`p-3 rounded-xl ${type.bg} ${type.color} mb-4 w-fit group-hover:scale-110 transition-transform`}>
 <type.icon size={22} />
 </div>
 <div>
 <h4 className={`font-bold mb-1 ${selectedResType === type.id ? 'text-[#4f46e5]' : 'text-text-main'}`}>{type.name}</h4>
 <p className="text-xs font-medium text-text-sub">{type.desc}</p>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Generate Button Workspace */}
 <div className="pt-8 flex justify-end">
 <button
 onClick={handleGenerateResource}
 disabled={!selectedResSubject || !selectedResTopic || !selectedResType || isGeneratingRes}
 className={`px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md flex items-center gap-2 ${(!selectedResSubject || !selectedResTopic || !selectedResType) ? 'bg-bg-surface-hover text-text-muted cursor-not-allowed' :
 isGeneratingRes ? 'bg-[#4338ca] text-white cursor-wait' : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white active:scale-95'
 }`}
 >
 {isGeneratingRes ? (
 <><Loader2 className="animate-spin" size={20} /> Assembling Material...</>
 ) : (
 <><Sparkles size={20} /> Generate Resource</>
 )}
 </button>
 </div>
 </div>
 </div>
 ) : (
 /* Generated Resource View */
 <div className="animate-in fade-in zoom-in-95 duration-500">
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
 <button onClick={() => setIsResGenerated(false)} className="flex items-center gap-1 text-sm font-bold text-text-sub hover:text-[#4f46e5] transition-colors"><ArrowRight className="rotate-180" size={16} /> Back to Library</button>
 <div className="flex items-center gap-2">
 <button className="flex items-center gap-2 bg-bg-surface border border-border-strong text-text-sub px-4 py-2 rounded-xl text-sm font-bold hover:bg-bg-surface-hover transition-colors shadow-sm"><Save size={16} /> Save</button>
 <button className="flex items-center gap-2 bg-bg-surface border border-border-strong text-text-sub px-4 py-2 rounded-xl text-sm font-bold hover:bg-bg-surface-hover transition-colors shadow-sm"><Share2 size={16} /> Share</button>
 <button className="flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"><Download size={16} /> Download PDF</button>
 </div>
 </div>

 <div className="bg-bg-surface rounded-[32px] p-6 lg:p-10 border border-border-base shadow-[0_8px_30px_rgb(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-4 gap-10">
 <div className="lg:col-span-1 space-y-6">
 <div>
 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-[#4f46e5] rounded-lg text-[10px] font-black uppercase tracking-wider mb-4 border border-primary/20">
 <BrainCircuit size={12} /> {resourceTypes.find(t => t.id === selectedResType)?.name}
 </div>
 <h2 className="text-2xl font-black text-text-main leading-tight mb-2">{selectedResTopic}</h2>
 <p className="text-text-sub font-medium text-sm">Comprehensive mastery guide generated specifically for standard test syllabus.</p>
 </div>

 <div className="space-y-4 pt-4 border-t border-border-base">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-bg-surface-hover rounded-xl flex items-center justify-center text-text-muted"><Book size={18} /></div>
 <div><p className="text-xs font-bold text-text-muted">Subject</p><p className="text-sm font-bold text-text-main">{resourceSubjects.find(s => s.id === selectedResSubject)?.name}</p></div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-bg-surface-hover rounded-xl flex items-center justify-center text-text-muted"><Clock size={18} /></div>
 <div><p className="text-xs font-bold text-text-muted">Est. Read Time</p><p className="text-sm font-bold text-text-main">12 Minutes</p></div>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-bg-surface-hover rounded-xl flex items-center justify-center text-text-muted"><FileText size={18} /></div>
 <div><p className="text-xs font-bold text-text-muted">Document Size</p><p className="text-sm font-bold text-text-main">4 Pages</p></div>
 </div>
 </div>
 </div>

 <div className="lg:col-span-3">
 <div className="w-full bg-bg-surface-hover rounded-2xl h-[600px] border border-border-strong relative overflow-hidden flex flex-col group">

 {/* Fake PDF Header */}
 <div className="bg-bg-surface border-b border-border-strong p-4 flex justify-between items-center z-10 shadow-sm">
 <h3 className="font-bold text-text-main text-sm">{selectedResTopic} - Official Guide.pdf</h3>
 <div className="flex gap-2">
 <button className="p-1.5 text-text-sub hover:bg-bg-surface-hover rounded-lg"><Maximize size={16} /></button>
 </div>
 </div>

 {/* Fake PDF Content Viewer */}
 <div className="flex-1 bg-bg-surface-hover/80 p-8 overflow-y-auto">
 <div className="bg-bg-surface shadow-[0_2px_15px_rgb(0,0,0,0.03)] mx-auto w-full max-w-2xl min-h-full rounded-xl p-10 border border-border-strong">
 <h1 className="text-3xl font-black text-text-main border-b-2 border-gray-900 pb-4 mb-6">{selectedResTopic}</h1>

 <h3 className="text-lg font-bold text-[#4f46e5] mb-2 uppercase tracking-wide text-sm">1. Core Concept Overview</h3>
 <p className="text-text-sub font-medium leading-relaxed mb-6">
 This module covers the foundational structural logic of {selectedResTopic}. We focus heavily on algorithmic decomposition, standardized equation formulas, and spatial visualization required to accurately parse advanced variables.
 </p>

 <h3 className="text-lg font-bold text-[#4f46e5] mb-2 uppercase tracking-wide text-sm">2. Standard Equation Syntax</h3>
 <div className="bg-bg-surface-hover rounded-xl p-5 border border-border-strong mb-6 font-mono text-sm text-text-main font-bold overflow-x-auto">
 f(x) = ax² + bx + c<br />
 x = [ -b ± √(b² - 4ac) ] / 2a
 </div>

 <h3 className="text-lg font-bold text-[#4f46e5] mb-2 uppercase tracking-wide text-sm">3. Key Retention Points</h3>
 <ul className="list-disc pl-5 space-y-2 text-text-sub font-medium mb-6 marker:text-[#4f46e5]">
 <li>Always isolate the standard variables before attempting to distribute.</li>
 <li>If the discriminant (b² - 4ac) is explicitly negative, no real roots exist.</li>
 </ul>
 </div>
 </div>

 {/* Overlay overlay shadow */}
 <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-200/50 to-transparent pointer-events-none"></div>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 </div>
 </DashboardLayout>
 );
}
