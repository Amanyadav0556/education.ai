import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Calendar, Clock, MapPin, CheckCircle2, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

export default function ExamInfo() {
    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-text-sub mb-4">
                        <span>Dashboard</span>
                        <ChevronRight size={14} />
                        <span className="text-text-main">Exam Details</span>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-text-main tracking-tight mb-2">Digital SAT Registration</h1>
                    <p className="text-text-sub font-medium text-[15px]">Your official upcoming examination details and readiness checklist.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Alert */}
                        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
                            <CheckCircle2 className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" size={24} />
                            <div>
                                <h3 className="font-bold text-green-800 dark:text-green-400 text-lg mb-1">Registration Confirmed</h3>
                                <p className="text-green-700/80 dark:text-green-400/80 font-medium text-sm">Your seat for the October 3rd Digital SAT is officially secured. Remember to bring your fully charged testing device.</p>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-sm border border-border-base">
                            <h3 className="font-bold text-text-main text-xl mb-6">Examination Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 pb-6 border-b border-border-base">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-[#4f46e5] flex-shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Date</p>
                                        <p className="text-lg font-black text-text-main">Saturday, October 3, 2026</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 pb-6 border-b border-border-base">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-[#4f46e5] flex-shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Time</p>
                                        <p className="text-lg font-black text-text-main">7:45 AM (Doors Close at 8:00 AM)</p>
                                        <p className="text-sm font-bold text-text-sub mt-1">Duration: ~2 hours and 14 minutes</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-[#4f46e5] flex-shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Test Center</p>
                                        <p className="text-lg font-black text-text-main">Lincoln High School (Center #12345)</p>
                                        <p className="text-sm font-bold text-text-sub mt-1">123 Education Blvd, San Francisco, CA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Format Info */}
                        <div className="bg-bg-surface-hover rounded-[24px] p-6 border border-border-base">
                            <h3 className="font-bold text-text-main text-lg mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-[#4f46e5]" /> Assessment Format
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-bg-surface p-4 rounded-xl border border-border-base">
                                    <h4 className="font-black text-text-main mb-1">Reading & Writing</h4>
                                    <p className="text-sm font-bold text-text-sub">2 Modules (64 minutes)</p>
                                </div>
                                <div className="bg-bg-surface p-4 rounded-xl border border-border-base">
                                    <h4 className="font-black text-text-main mb-1">Math</h4>
                                    <p className="text-sm font-bold text-text-sub">2 Modules (70 minutes)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Checklist */}
                    <div className="space-y-6">
                        <div className="bg-bg-surface rounded-[24px] p-6 shadow-sm border border-border-base">
                            <h3 className="font-bold text-text-main text-lg mb-6">Test Day Checklist</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-border-strong flex-shrink-0"></div>
                                    <span className="text-sm font-bold text-text-sub leading-snug">Fully charged Approved Testing Device (Laptop/Tablet)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-border-strong flex-shrink-0"></div>
                                    <span className="text-sm font-bold text-text-sub leading-snug">Bluebook™ testing app installed and updated</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-border-strong flex-shrink-0"></div>
                                    <span className="text-sm font-bold text-text-sub leading-snug">Acceptable Photo ID</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-border-strong flex-shrink-0"></div>
                                    <span className="text-sm font-bold text-text-sub leading-snug">Printed Admission Ticket</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 mt-0.5 rounded border border-border-strong flex-shrink-0"></div>
                                    <span className="text-sm font-bold text-text-sub leading-snug">Acceptable Calculator (Optional)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-500/10 p-6 rounded-[24px] border border-orange-100 dark:border-orange-500/20">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle size={20} className="text-orange-500" />
                                <h4 className="font-black text-orange-700 dark:text-orange-400">Important Note</h4>
                            </div>
                            <p className="text-sm font-bold text-orange-600/80 dark:text-orange-400/80 leading-relaxed">
                                Ensure your device connects to Wi-Fi. The test is adaptive, meaning your performance in the first module determines the difficulty of the second module.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
