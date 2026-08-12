import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        targetExam: 'SAT', educationLevel: 'High School'
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        try {
            await signup(formData);
            navigate('/landing');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to sign up');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-12">
            <div className="ambient-bg"></div>

            {/* Custom Top Welcome Message */}
            <div className="absolute top-10 left-0 right-0 text-center z-20 px-4">
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-wide text-white">
                    Welcome to <span className="text-gradient">AceCoach AI</span> Learning Platform
                </h1>
            </div>

            <div className="glass-panel w-full max-w-lg p-8 relative z-10 mt-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Start your personalized learning journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input type="text" className="input-glass" required
                            onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input type="email" className="input-glass" required
                            onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" className="input-glass" required
                                onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm</label>
                            <input type="password" className="input-glass" required
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Exam</label>
                            <select className="input-glass appearance-none" onChange={e => setFormData({ ...formData, targetExam: e.target.value })}>
                                <option value="SAT">SAT</option>
                                <option value="JEE">JEE</option>
                                <option value="NEET">NEET</option>
                                <option value="General">General Mastery</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Education Level</label>
                            <select className="input-glass appearance-none" onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}>
                                <option value="Middle School">Middle School</option>
                                <option value="High School">High School</option>
                                <option value="College">College</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full py-3 mt-6 text-lg tracking-wider">
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
