'use client';
import { useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import HomeView from './views/HomeView';
import LearningView from './views/LearningView';
import PracticeView from './views/PracticeView';
import ResourcesView from './views/ResourcesView';
import AiView from './views/AiView';
import ProgressView from './views/ProgressView';
import Notifications from '../shared/Notifications';

export default function Dashboard() {
    const { currentView, sidebarCollapsed } = useApp();

    const marginLeft = sidebarCollapsed ? 72 : 260;

    const views: Record<string, React.ReactNode> = {
        home: <HomeView />,
        learning: <LearningView />,
        practice: <PracticeView />,
        resources: <ResourcesView />,
        ai: <AiView />,
        progress: <ProgressView />,
    };

    return (
        <div className="page-container">
            <div className="bg-orb bg-orb-1" style={{ opacity: 0.04 }} />
            <div className="bg-orb bg-orb-2" style={{ opacity: 0.04 }} />

            <Sidebar />
            <Topbar marginLeft={marginLeft} />

            <main
                className="main-content"
                style={{
                    marginLeft,
                    padding: '24px',
                    minHeight: '100vh',
                    paddingTop: 'calc(72px + 24px)',
                }}
            >
                <div className="animate-fade-in" key={currentView}>
                    {views[currentView] || <HomeView />}
                </div>
            </main>

            <Notifications />
        </div>
    );
}
