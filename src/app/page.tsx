'use client';
import { useApp } from '@/context/AppContext';
import AuthPage from '@/components/auth/AuthPage';
import OnboardingPage from '@/components/onboarding/OnboardingPage';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const { authState } = useApp();

  if (authState === 'unauthenticated') return <AuthPage />;
  if (authState === 'onboarding') return <OnboardingPage />;
  return <Dashboard />;
}
