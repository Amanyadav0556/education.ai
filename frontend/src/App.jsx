import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import AuthPage from './pages/Authentication/AuthPage';
import Dashboard from './pages/Dashboard/Dashboard';
import AICoach from './pages/AI Tutor/Chat/AICoach';
import Practice from './pages/Practice/Topic Practice/Practice';
import LearningTwin from './pages/Analytics/LearningTwin';
import ExamInfo from './pages/ExamInfo/ExamInfo';
import Progress from './pages/Progress/Progress';
import StudyPlan from './pages/Study Plan/StudyPlan';
import Profile from './pages/Profile/Profile';
import DeepAnalysis from './pages/Analytics/DeepAnalysis';
import ActiveTest from './pages/Practice/ActiveTest';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />

            <Route path="/landing" element={
                <ProtectedRoute>
                    <Landing />
                </ProtectedRoute>
            } />

            <Route path="/coach" element={
                <ProtectedRoute>
                    <AICoach />
                </ProtectedRoute>
            } />

            <Route path="/practice" element={
                <ProtectedRoute>
                    <Practice />
                </ProtectedRoute>
            } />
            <Route path="/test/:id" element={
                <ProtectedRoute>
                    <ActiveTest />
                </ProtectedRoute>
            } />

            <Route path="/learning-twin" element={
                <ProtectedRoute>
                    <LearningTwin />
                </ProtectedRoute>
            } />

            <Route path="/learning-twin/deep-analysis" element={
                <ProtectedRoute>
                    <DeepAnalysis />
                </ProtectedRoute>
            } />

            <Route path="/progress" element={
                <ProtectedRoute>
                    <Progress />
                </ProtectedRoute>
            } />

            <Route path="/study-plan" element={
                <ProtectedRoute>
                    <StudyPlan />
                </ProtectedRoute>
            } />

            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />

            {/* 404 Fallback */}
            <Route path="*" element={<div className="p-10 text-center"><h1>404 Not Found</h1></div>} />
        </Routes>
    );
}

export default App;
