import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BrainCircuit, Target, Zap } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

export default function AuthPage() {
 const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

 return (
 <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-8 md:p-12 font-sans overflow-hidden relative">

 {/* Ambient Animated Gradients for Light Mode */}
 <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply"></div>
 <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[130px] mix-blend-multiply"></div>
 </div>

 {/* The Main Container */}
 <div className="w-full max-w-[1240px] h-[780px] bg-bg-surface rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex overflow-hidden relative z-10 border border-border-base">

 {/* Left Side: Hero Panel (Hidden on mobile) */}
 <div className="hidden lg:flex w-[45%] relative bg-gradient-to-br from-bg-surface-hover to-bg-surface p-12 flex-col justify-between overflow-hidden border-r border-primary/20/50">

 {/* Abstract Geometry */}
 <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

 {/* Top Row: Logo & Back Link */}
 <div className="relative z-20 flex justify-between items-center w-full">
 <div className="flex items-center space-x-2.5">
 <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white shadow-md">
 <Sparkles size={18} />
 </div>
 <span className="text-xl tracking-wider font-black text-text-main uppercase">AceCoach</span>
 </div>

 <Link to="/" className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-bg-surface hover:bg-bg-surface-hover text-text-sub text-xs font-bold transition-all shadow-sm border border-border-strong">
 <span>Back to website</span>
 <ArrowRight size={14} />
 </Link>
 </div>

 {/* Central Badges/UI Mocks floating */}
 <div className="relative z-20 flex-1 flex flex-col justify-center my-12 relative">
 <motion.div
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.2 }}
 className="absolute -right-8 top-10 bg-bg-surface p-4 rounded-2xl shadow-xl shadow-indigo-900/5 border border-indigo-50 flex items-center gap-4 rotate-3"
 >
 <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center"><Target size={20} /></div>
 <div>
 <p className="text-[10px] font-black uppercase text-text-muted">Score Jump</p>
 <p className="text-lg font-black text-text-main">+140 Points</p>
 </div>
 </motion.div>

 <motion.div
 initial={{ y: -20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="bg-bg-surface p-5 rounded-3xl shadow-xl shadow-indigo-900/5 border border-indigo-50 max-w-xs relative z-10"
 >
 <div className="flex items-center gap-3 mb-3">
 <BrainCircuit className="text-[#4f46e5]" size={20} />
 <h3 className="font-bold text-text-main">AI Target Analysis</h3>
 </div>
 <p className="text-sm font-medium text-text-sub leading-relaxed">
 Our engine detected a weakness in advanced geometry. We've routed 3 custom drills to your dashboard.
 </p>
 </motion.div>

 <motion.div
 initial={{ x: -20, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 transition={{ delay: 0.6 }}
 className="absolute -bottom-4 left-10 bg-bg-surface p-4 rounded-2xl shadow-xl shadow-indigo-900/5 border border-indigo-50 flex items-center gap-4 -rotate-2"
 >
 <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
 <div>
 <p className="text-[10px] font-black uppercase text-text-muted">Current Streak</p>
 <p className="text-lg font-black text-text-main">12 Days</p>
 </div>
 </motion.div>
 </div>

 {/* Bottom Row: Typography */}
 <div className="relative z-20">
 <h2 className="text-4xl font-black text-text-main mb-3 leading-tight tracking-tight">
 Master the SAT with <br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-purple-600">Adaptive AI.</span>
 </h2>
 <p className="font-medium text-text-sub max-w-sm">Join the top 1% of scorers using our intelligent curriculum.</p>

 {/* Little page indicators */}
 <div className="flex items-center space-x-2 mt-8">
 <div className="w-8 h-1.5 bg-[#4f46e5] rounded-full"></div>
 <div className="w-8 h-1.5 bg-indigo-200 rounded-full"></div>
 <div className="w-8 h-1.5 bg-indigo-200 rounded-full"></div>
 </div>
 </div>
 </div>

 {/* Right Side: Authentication Forms */}
 <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-16 relative bg-bg-surface overflow-y-auto">
 <div className="w-full max-w-md">
 <AnimatePresence mode='wait'>
 {authMode === 'login' ? (
 <LoginForm key="login" setAuthMode={setAuthMode} />
 ) : (
 <SignupForm key="signup" setAuthMode={setAuthMode} />
 )}
 </AnimatePresence>
 </div>
 </div>

 </div>
 </div>
 );
}
