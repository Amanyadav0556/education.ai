import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Eye, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ setAuthMode }) {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');
 const { login } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setIsLoading(true);
 try {
 await login({ email, password });
 navigate('/dashboard');
 } catch (err) {
 setError(err.response?.data?.error || 'Failed to authenticate');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <motion.div
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.3 }}
 className="w-full"
 >
 <div className="mb-8">
 <h2 className="text-[32px] font-black text-text-main tracking-tight mb-2">Welcome back</h2>
 <p className="text-[15px] font-medium text-text-sub">
 Don't have an account?{' '}
 <button onClick={() => setAuthMode('signup')} className="text-[#4f46e5] font-bold hover:text-[#4338ca] hover:underline underline-offset-4 transition-colors">
 Sign up for free
 </button>
 </p>
 </div>

 {error && (
 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
 {error}
 </motion.div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">

 <div className="space-y-1.5">
 <label className="text-sm font-bold text-text-main ml-1">Email Address</label>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full bg-bg-surface-hover border border-border-strong focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 text-text-main rounded-xl py-3.5 pl-11 pr-4 outline-none placeholder:text-text-muted font-semibold text-sm transition-all shadow-sm"
 placeholder="alex@example.com"
 required
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-sm font-bold text-text-main ml-1">Password</label>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
 <input
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-bg-surface-hover border border-border-strong focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 text-text-main rounded-xl py-3.5 pl-11 pr-11 outline-none placeholder:text-text-muted font-semibold text-sm transition-all shadow-sm"
 placeholder="Min. 8 characters"
 required
 />
 <div
 onClick={() => setShowPassword(!showPassword)}
 className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:opacity-70 transition-opacity"
 >
 {showPassword ? <Eye className="h-4 w-4 text-text-sub" /> : <EyeOff className="h-4 w-4 text-text-sub" />}
 </div>
 </div>
 </div>

 <div className="pt-2 pb-5 flex justify-between items-center">
 <label className="flex items-center space-x-3 cursor-pointer group">
 <div className="relative flex items-center justify-center">
 <input type="checkbox" className="peer appearance-none w-5 h-5 border border-border-strong rounded-md bg-bg-surface-hover checked:bg-[#4f46e5] checked:border-[#4f46e5] transition-all cursor-pointer shadow-sm" />
 <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 </div>
 <span className="text-[13px] font-bold text-text-sub group-hover:text-text-main transition-colors">
 Remember me
 </span>
 </label>

 <a href="#" className="text-[13px] font-bold text-[#4f46e5] hover:text-[#4338ca] hover:underline underline-offset-2">Forgot password?</a>
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold rounded-xl py-3.5 transition-all shadow-md shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center text-[15px]"
 >
 {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Log in securely</span>}
 </button>
 </form>

 <div className="mt-8 mb-6 relative flex items-center justify-center">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-border-strong"></div>
 </div>
 <div className="relative bg-bg-surface px-4 text-xs font-bold uppercase tracking-wider text-text-muted">
 Or continue with
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <button type="button" className="flex items-center justify-center space-x-2 bg-bg-surface border border-border-strong hover:bg-bg-surface-hover hover:border-border-strong text-text-sub shadow-sm rounded-xl py-3 transition-all font-bold text-[13px] active:scale-[0.98]">
 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
 </svg>
 <span>Google</span>
 </button>
 <button type="button" className="flex items-center justify-center space-x-2 bg-gray-900 border border-transparent hover:bg-black text-white shadow-sm rounded-xl py-3 transition-all font-bold text-[13px] active:scale-[0.98]">
 <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
 <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.68.727-1.337 2.169-1.142 3.52 1.35.104 2.597-.48 3.429-1.508z" />
 </svg>
 <span>Apple</span>
 </button>
 </div>
 </motion.div>
 );
}
