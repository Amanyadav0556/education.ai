import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Play, Sparkles, TrendingUp, Target } from 'lucide-react';

export default function Landing() {
 const { user, logout } = useAuth();

 return (
 <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#fbf9f1' }}>

 <div className="max-w-7xl mx-auto px-6 h-full flex flex-col relative z-10">

 {/* Navbar */}
 <nav className="flex justify-between items-center py-6">
 <div className="flex items-center space-x-2">
 <div className="w-8 h-8 rounded-lg bg-[#836bb4] flex items-center justify-center text-white">
 <Sparkles size={18} />
 </div>
 <span className="font-bold text-xl tracking-tight text-text-main">AceCoach</span>
 </div>

 <div className="hidden md:flex items-center space-x-8 font-semibold text-[15px] text-text-main">
 <a href="#" className="hover:text-[#836bb4] transition-colors">Home</a>
 <a href="#" className="hover:text-[#836bb4] transition-colors">Features</a>
 <a href="#" className="hover:text-[#836bb4] transition-colors">Pricing</a>
 <a href="#" className="hover:text-[#836bb4] transition-colors">Contact</a>
 </div>

 <div className="flex items-center space-x-4">
 {user ? (
 <>
 <Link to="/dashboard" className="font-semibold text-text-main hover:text-[#836bb4] transition-colors">Dashboard</Link>
 <button onClick={logout} className="btn btn-primary px-6 py-2.5 text-sm">Logout</button>
 </>
 ) : (
 <>
 <Link to="/auth" className="btn btn-primary px-6 py-2.5 text-sm">Get Started</Link>
 </>
 )}
 </div>
 </nav>

 {/* Hero Section */}
 <div className="flex-1 flex flex-col lg:flex-row items-center pt-16 pb-24 gap-16">

 {/* Left Column: Copy */}
 <div className="flex-1 lg:max-w-xl flex flex-col justify-center">
 <h1 className="text-6xl lg:text-7xl font-extrabold text-text-main tracking-[-0.04em] leading-[1.05] mb-6">
 Smart Score Growth
 </h1>
 <p className="text-lg text-text-sub mb-10 leading-relaxed pr-8 font-medium">
 Build your test mastery with intelligent adaptive strategies. Start focusing on your weakest links and watch your percentile grow with our AI-powered tutor.
 </p>

 <div className="flex items-center space-x-4">
 <Link to={user ? "/practice" : "/auth"} className="btn btn-primary px-8 py-4 text-[15px]">
 Start Learning
 </Link>
 <button className="btn btn-outline px-8 py-4 text-[15px] flex items-center space-x-2 bg-[#f4f7e6] border-[#e1e6c3] text-text-main hover:bg-[#eaf0c1] hover:border-[#d6df9e]">
 <Play size={18} className="text-[#88a531] fill-current" />
 <span>Watch Demo</span>
 </button>
 </div>
 </div>

 {/* Right Column: Abstract Art / Illustration Mockup */}
 <div className="flex-1 relative w-full h-[500px] flex items-center justify-center">

 {/* Abstract Background Splash */}
 <div className="absolute inset-0 bg-[#dbe8b5] rounded-full filter blur-3xl opacity-50 scale-75 transform translate-y-12 translate-x-12"></div>
 <div className="absolute inset-0 bg-purple-200 rounded-full filter blur-3xl opacity-40 scale-75 transform -translate-y-12 -translate-x-12"></div>

 {/* Central Graph/Coins Illustration structure */}
 <div className="relative z-10 w-full max-w-lg h-full">

 {/* Bar Chart Mockups */}
 <div className="absolute bottom-12 left-1/4 w-12 h-40 bg-[#423f5b] rounded-t-sm shadow-xl flex items-end">
 <div className="w-full bg-[#836bb4] h-1/2 opacity-30"></div>
 </div>
 <div className="absolute bottom-12 left-2/4 w-12 h-64 bg-[#322f4b] rounded-t-sm shadow-xl flex items-end -ml-4">
 <div className="w-full bg-[#836bb4] h-2/3 opacity-30"></div>
 </div>
 <div className="absolute bottom-12 left-3/4 w-12 h-80 bg-[#1f1d36] rounded-t-sm shadow-xl flex items-end -ml-8">
 <div className="w-full bg-[#836bb4] h-[80%] opacity-30"></div>
 </div>

 {/* Upward Trend Arrow */}
 <svg className="absolute bottom-32 left-1/4 w-72 h-40 overflow-visible pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
 <path d="M 0,100 L 40,60 L 60,75 L 100,0" fill="none" stroke="#3b3749" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
 <polygon points="100,0 90,0 100,10" fill="#3b3749" transform="rotate(-15 100 0) scale(1.5)" />
 </svg>

 {/* Floating Coins/Badges */}
 <div className="absolute top-20 right-1/4 w-20 h-20 bg-[#cbea7b] rounded-full shadow-lg flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300">
 <span className="font-bold text-4xl text-[#7a9d34]">$</span>
 </div>
 <div className="absolute bottom-24 left-10 w-16 h-16 bg-[#cbea7b] rounded-full shadow-lg flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300 z-20">
 <span className="font-bold text-2xl text-[#7a9d34]">$</span>
 {/* Stack illusion */}
 <div className="absolute -bottom-2 -z-10 w-full h-full bg-[#b5d661] rounded-full"></div>
 <div className="absolute -bottom-4 -z-20 w-full h-full bg-[#a1c24d] rounded-full"></div>
 </div>

 <div className="absolute bottom-16 right-32 w-16 h-16 bg-[#cbea7b] rounded-full shadow-lg flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-300 z-20">
 <span className="font-bold text-2xl text-[#7a9d34]">$</span>
 {/* Stack illusion */}
 <div className="absolute -bottom-2 -z-10 w-full h-full bg-[#b5d661] rounded-full"></div>
 </div>

 {/* Soft shadow base */}
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/5 rounded-[100%] blur-md -z-30"></div>

 </div>
 </div>
 </div>

 </div>
 </div>
 );
}
