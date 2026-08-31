'use client';
import { useApp } from '@/context/AppContext';
import AuthPage from '@/components/auth/AuthPage';
import SubjectSelectionPage from '@/components/subject-selection/SubjectSelectionPage';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const { authState } = useApp();

  if (authState === 'unauthenticated') return <AuthPage />;
  if (authState === 'select-subject') return <SubjectSelectionPage />;
  return <Dashboard />;
}
