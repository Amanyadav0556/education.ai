import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'EduAI – Personalized AI Learning Platform',
  description: 'Master any subject with AI-powered explanations, practice quizzes, and a personal AI tutor. Built for students who want to learn smarter.',
  keywords: 'AI learning, education, tutoring, quiz, study, physics, mathematics, chemistry',
  openGraph: {
    title: 'EduAI – Personalized AI Learning Platform',
    description: 'Master any subject with AI-powered learning',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
