'use client';
// OnboardingPage is no longer used in the main flow.
// Post-login, users go to SubjectSelectionPage instead.
// This file is kept only as a legacy placeholder.
import { useApp } from '@/context/AppContext';

export default function OnboardingPage() {
    const { changeSubject } = useApp();
    // Immediately redirect to subject selection if this is somehow reached.
    changeSubject();
    return null;
}
