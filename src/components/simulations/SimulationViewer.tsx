'use client';

import { SimulationId } from '@/lib/simulations/classifier';
import GalvanometerSim from './GalvanometerSim';
import RelativeMotionSim from './RelativeMotionSim';
import BohrAtomSim from './BohrAtomSim';
import OhmsLawSim from './OhmsLawSim';
import PendulumSim from './PendulumSim';
import WaveInterferenceSim from './WaveInterferenceSim';
import ProjectileSim from './ProjectileSim';
import QuadraticGrapherSim from './QuadraticGrapherSim';

export default function SimulationViewer({ simId }: { simId: SimulationId }) {
    switch (simId) {
        case 'galvanometer':
            return <GalvanometerSim />;
        case 'relative-motion':
            return <RelativeMotionSim />;
        case 'bohr-atom':
            return <BohrAtomSim />;
        case 'ohms-law':
            return <OhmsLawSim />;
        case 'pendulum':
            return <PendulumSim />;
        case 'wave-interference':
            return <WaveInterferenceSim />;
        case 'projectile':
            return <ProjectileSim />;
        case 'quadratic-grapher':
            return <QuadraticGrapherSim />;
        default:
            return null;
    }
}
