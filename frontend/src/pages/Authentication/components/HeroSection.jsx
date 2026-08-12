import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';

const features = [
    { icon: Brain, text: "AI Personalized Learning", color: "text-purple-400" },
    { icon: TrendingUp, text: "Smart Progress Tracking", color: "text-blue-400" },
    { icon: Target, text: "Adaptive SAT Practice", color: "text-green-400" },
    { icon: Zap, text: "Instant AI Doubt Solver", color: "text-yellow-400" }
];

export default function HeroSection() {
    return (
        <div className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-12 overflow-hidden">
            {/* Animated Gradient Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 mt-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl lg:text-5xl font-display font-bold text-white mb-4"
                >
                    Welcome to <span className="text-gradient">AceCoach AI</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-xl text-gray-300 font-medium mb-4"
                >
                    Your Personalized AI Learning Platform
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-gray-400 leading-relaxed mb-12 max-w-sm"
                >
                    Master SAT preparation with an AI tutor that adapts to your learning style.
                </motion.p>

                <div className="space-y-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                                className="flex items-center space-x-4"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${feature.color}`}>
                                    <Icon size={24} />
                                </div>
                                <span className="text-gray-200 font-medium">{feature.text}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative z-10 pt-10 mt-auto"
            >
                <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#0a0a0c]"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#0a0a0c]"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#0a0a0c]"></div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">Trusted by top students</span>
                </div>
            </motion.div>
        </div>
    );
}
