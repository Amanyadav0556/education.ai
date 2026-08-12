import React from 'react';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Bell, Search, Moon, Sun, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();

    // Notifications & Theme State
    const [showNotifs, setShowNotifs] = React.useState(false);
    const [isDark, setIsDark] = React.useState(false);

    const toggleDark = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-[#fbf9f1] dark:bg-gray-900 text-gray-900 dark:text-white dark:text-gray-100 flex font-sans transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                {/* Topbar */}
                <header className="h-20 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 bg-white dark:bg-gray-800/70 backdrop-blur-md sticky top-0 z-40">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search topics, questions, mock tests..."
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700/80 rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#836bb4]/50 focus:border-[#836bb4] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">

                        {/* Theme Toggle */}
                        <button onClick={toggleDark} className="text-gray-500 hover:text-[#836bb4] dark:text-gray-400 dark:hover:text-[#836bb4] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button onClick={() => setShowNotifs(!showNotifs)} className="relative text-gray-500 hover:text-[#836bb4] dark:text-gray-400 dark:hover:text-[#836bb4] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                            </button>

                            {/* Dropdown Menu */}
                            {showNotifs && (
                                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 dark:bg-gray-900/50">
                                        <h3 className="font-bold text-sm text-gray-900 dark:text-white dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="p-2">
                                        <div className="p-3 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                                <CalendarClock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white dark:text-white mb-0.5">SAT Exam Registration Closed</p>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-snug">The upcoming Oct 3 Digital SAT exam registration has successfully processed.</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-2">Just now</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-center">
                                        <button className="text-xs font-bold text-[#836bb4] hover:underline">Mark all as read</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/profile" className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white dark:text-white">{user?.name || 'Student'}</p>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">{user?.targetExam || 'SAT'} Prep</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-[#836bb4] shadow-md shadow-[#836bb4]/20 flex items-center justify-center font-bold text-white">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
