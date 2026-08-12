import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Camera, Edit, ShieldCheck, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // DP Upload State
    const [profilePic, setProfilePic] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePic(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <DashboardLayout>
            {/* Top Navigation */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 dark:text-gray-300"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Profile</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Left Column: Avatar & Quick Info */}
                <div className="w-full md:w-72 flex flex-col items-center">
                    <div className="relative mb-4 group">
                        <div className="w-40 h-40 rounded-full bg-[#f8fafc] border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile DP" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-full h-full text-indigo-100" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 w-10 h-10 bg-[#4f46e5] rounded-full flex items-center justify-center text-white shadow-md border-[3px] border-white hover:bg-[#4338ca] transition-colors z-10 active:scale-95">
                            <Camera size={18} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{user?.name || 'Aman Yadav'}</h2>
                    <div className="bg-amber-100/60 text-amber-800 font-bold px-8 py-1.5 rounded-full border border-amber-200 text-sm tracking-wide shadow-sm">
                        AceCoach Student
                    </div>
                </div>

                {/* Right Column: Detailed Information */}
                <div className="flex-1 w-full space-y-8">

                    {/* Level Up Overview */}
                    <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Level Up Overview</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl border border-indigo-50 relative">
                                <Info size={14} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500" />
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-2">Total XP</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    2,450 <span className="text-indigo-500 text-sm font-bold px-2 py-0.5 bg-indigo-50 rounded-md">XP</span>
                                </p>
                            </div>
                            <div className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-xl border border-indigo-50 relative">
                                <Info size={14} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500" />
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-2">Highest Level</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    Level 4 🏆
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-4 mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Profile Detail</h3>
                            <button className="flex items-center gap-1.5 text-[#4f46e5] text-sm font-bold hover:text-[#4338ca] transition-colors">
                                <Edit size={16} /> Edit
                            </button>
                        </div>

                        {/* Personal Details Section */}
                        <div className="mb-8">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700/50"></div></div>
                                <div className="relative flex justify-start"><span className="bg-white dark:bg-gray-800 pr-4 text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider">Personal Details</span></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-6 gap-x-4">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Name</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {user?.name || 'Aman Yadav'}
                                    <span className="flex items-center gap-1 text-[#4f46e5] text-[11px] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                        <ShieldCheck size={12} /> AceCoach Master
                                    </span>
                                </div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Mobile No</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">+1 (555) 000-0000</div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Email</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{user?.email || 'student@acecoach.ai'}</div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Living City/Village/Town</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">San Francisco</div>
                            </div>
                        </div>

                        {/* Academic Details Section */}
                        <div className="mb-2">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700/50"></div></div>
                                <div className="relative flex justify-start"><span className="bg-white dark:bg-gray-800 pr-4 text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wider">Academic Details</span></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-6 gap-x-4">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Education Level</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{user?.educationLevel || 'High School'}</div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Board/State Board</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">N/A</div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Target Exams</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{user?.targetExam || 'SAT'}</div>

                                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 dark:text-gray-500">Language preference</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">English</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
