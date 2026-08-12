import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, LogOut, Code, Compass, ArrowUpRight, TrendingUp, Settings, CalendarDays, Sparkles } from 'lucide-react';

export const Sidebar = () => {
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const location = useLocation();

 const navItems = [
 { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
 { label: 'AI Coach', icon: <Code size={20} />, path: '/coach' },
 { label: 'Practice', icon: <Compass size={20} />, path: '/practice' },
 { label: 'Learning Twin', icon: <TrendingUp size={20} />, path: '/learning-twin' },
 { label: 'Study Plan', icon: <CalendarDays size={20} />, path: '/study-plan' },
 { label: 'Progress', icon: <ArrowUpRight size={20} />, path: '/progress' },
 ];

 return (
 <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-surface border-r border-border-strong flex flex-col pt-8 pb-4 shadow-sm z-50">
 <div className="px-6 mb-10 flex items-center space-x-2">
 <div className="w-8 h-8 rounded-lg bg-[#9884d1] flex items-center justify-center text-white shadow-md">
 <Sparkles size={18} />
 </div>
 <h1 className="text-xl font-extrabold text-text-main tracking-tight">AceCoach</h1>
 </div>

 <nav className="flex-1 px-4 space-y-2">
 {navItems.map((item) => {
 const isActive = location.pathname.includes(item.path);
 return (
 <Link
 key={item.label}
 to={item.path}
 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm
 ${isActive
 ? 'bg-[#9884d1] !text-white shadow-md shadow-[#9884d1]/20'
 : 'text-text-sub hover:bg-bg-surface-hover hover:text-[#9884d1]'
 }
 `}
 >
 <span className={isActive ? "opacity-100 !text-white" : "opacity-70"}>{item.icon}</span>
 <span>{item.label}</span>
 </Link>
 )
 })}
 </nav>

 <div className="px-4 space-y-2 mt-auto pt-6 border-t border-border-base">
 <div className="px-4 py-3 mb-2 flex items-center space-x-3 bg-bg-surface-hover rounded-xl border border-border-base">
 <div className="w-8 h-8 rounded-full bg-[#9884d1]/10 flex items-center justify-center text-[#9884d1] font-bold">
 {user?.name?.charAt(0) || 'U'}
 </div>
 <div className="flex flex-col">
 <span className="text-xs font-bold text-text-main truncate w-32">{user?.name}</span>
 <span className="text-[10px] text-text-sub font-medium">{user?.targetExam} Prep</span>
 </div>
 </div>

 <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-bg-surface-hover text-text-sub hover:text-[#9884d1] font-medium text-sm">
 <Settings size={20} className="opacity-70" />
 <span>Settings</span>
 </Link>
 <button
 onClick={() => { logout(); navigate('/'); }}
 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50 text-text-sub hover:text-red-500 font-medium text-sm"
 >
 <LogOut size={20} className="opacity-70" />
 <span>Logout</span>
 </button>
 </div>
 </aside>
 );
};
