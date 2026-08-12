import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [error, setError] = useState('');
 const { login } = useAuth();
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();
 try {
 await login({ email, password });
 navigate('/landing');
 } catch (err) {
 setError(err.response?.data?.error || 'Failed to login');
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center relative py-12"
 style={{
 background: 'linear-gradient(135deg, #cde3ef 0%, #e0f2fe 50%, #f0f9ff 100%)',
 fontFamily: 'Inter, sans-serif'
 }}>

 {/* Soft decorative background circles */}
 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bg-surface/20 rounded-full blur-3xl pointer-events-none"></div>
 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

 {/* Main Card */}
 <div className="w-full max-w-[420px] bg-bg-surface/80 backdrop-blur-2xl rounded-[32px] p-10 relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50">

 {/* Top Icon */}
 <div className="flex justify-center mb-6">
 <div className="w-14 h-14 bg-bg-surface rounded-2xl shadow-sm border border-border-base flex items-center justify-center text-text-sub">
 <LogIn size={24} strokeWidth={2.5} />
 </div>
 </div>

 {/* Headers */}
 <div className="text-center mb-8">
 <h2 className="text-[26px] font-bold text-text-main mb-2 tracking-tight">Sign in with email</h2>
 </div>

 {error && (
 <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl mb-6 text-sm border border-red-100 text-center">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 {/* Email Input */}
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Mail className="h-5 w-5 text-text-muted" />
 </div>
 <input
 type="email"
 className="w-full bg-bg-surface-hover/50 border border-border-base text-text-main text-[15px] rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-border-strong block pl-11 pr-4 py-3.5 transition-all outline-none placeholder:text-text-muted"
 placeholder="Email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 />
 </div>

 {/* Password Input */}
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
 <Lock className="h-5 w-5 text-text-muted" />
 </div>
 <input
 type="password"
 className="w-full bg-bg-surface-hover/50 border border-border-base text-text-main text-[15px] rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-border-strong block pl-11 pr-11 py-3.5 transition-all outline-none placeholder:text-text-muted"
 placeholder="Password"
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />
 <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:opacity-70 transition-opacity">
 <EyeOff className="h-5 w-5 text-text-muted" />
 </div>
 </div>

 {/* Forgot Password Link */}
 <div className="flex justify-end pt-1">
 <a href="#" className="text-[13px] text-text-sub hover:text-text-main font-medium transition-colors">
 Forgot password?
 </a>
 </div>

 {/* Main CTA */}
 <button type="submit" className="w-full bg-[#1c1c1e] hover:bg-black text-white font-medium rounded-[18px] py-4 mt-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
 Get Started
 </button>

 <p className="text-center text-sm text-text-muted mt-4">
 <Link to="/signup" className="text-text-sub hover:text-text-main">Need an account? Sign up</Link>
 </p>
 </form>

 </div>
 </div>
 );
}
