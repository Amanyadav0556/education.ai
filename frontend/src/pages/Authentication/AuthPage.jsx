import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, CalendarDays, TrendingUp, CheckCircle2 } from 'lucide-react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative">

            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[130px] mix-blend-multiply"></div>
            </div>

            <div className="w-full max-w-[1240px] min-h-[720px] bg-bg-surface rounded-3xl lg:rounded-[40px] shadow-[0_20px_60px_rgb(0,0,0,0.05)] flex overflow-hidden relative z-10 border border-border-base lg:flex-row flex-col">

                {/* Left Side: Branding Panel (Hidden on mobile) */}
                <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-bg-surface-hover dark:to-bg-surface p-12 flex-col justify-between overflow-hidden border-r border-border-base relative">

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
                        <Link to="/" className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full hover:bg-bg-surface-hover text-text-sub text-xs font-bold transition-all border border-transparent hover:border-border-strong">
                            <ArrowLeft size={14} />
                            <span>Return</span>
                        </Link>
                    </div>

                    {/* Central: Features Highlights */}
                    <div className="relative z-20 flex-1 flex flex-col justify-center my-12 space-y-6 max-w-sm">
                        <h2 className="text-3xl lg:text-4xl font-black text-text-main leading-tight tracking-tight mb-2">
                            Unlock your true <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-purple-600">learning potential.</span>
                        </h2>

                        <div className="space-y-4 mt-6">
                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 bg-bg-surface/60 backdrop-blur-sm p-4 rounded-2xl border border-border-base shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-[#4f46e5] dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                                    <BrainCircuit size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-text-main">AI Study Coach</p>
                                    <p className="text-xs font-medium text-text-sub">24/7 expert guidance and explanations.</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-4 bg-bg-surface/60 backdrop-blur-sm p-4 rounded-2xl border border-border-base shadow-sm">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                                    <CalendarDays size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-text-main">Personalized Study Plan</p>
                                    <p className="text-xs font-medium text-text-sub">Dynamic schedules that adapt to you.</p>
                                </div>
                            </motion.div>

                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 bg-bg-surface/60 backdrop-blur-sm p-4 rounded-2xl border border-border-base shadow-sm">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
                                    <TrendingUp size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-text-main">Adaptive Practice</p>
                                    <p className="text-xs font-medium text-text-sub">Smart questions targeting your exact weaknesses.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="relative z-20 flex items-center justify-between text-xs font-bold text-text-muted">
                        <p>© 2026 AceCoach AI</p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-text-main transition-colors">Privacy</a>
                            <a href="#" className="hover:text-text-main transition-colors">Terms</a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Authentication Forms */}
                <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-bg-surface overflow-y-auto">
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
