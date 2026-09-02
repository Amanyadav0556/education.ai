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
import ElectrolysisSim from './ElectrolysisSim';
import IndiaMapSim from './IndiaMapSim';
import WW2TimelineSim from './WW2TimelineSim';
import TenseTimelineSim from './TenseTimelineSim';
import HeartRateZonesSim from './HeartRateZonesSim';

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
        case 'electrolysis-water':
            return <ElectrolysisSim />;
        case 'india-map':
            return <IndiaMapSim />;
        case 'ww2-timeline':
            return <WW2TimelineSim />;
        case 'tense-timeline':
            return <TenseTimelineSim />;
        case 'heart-rate-zones':
            return <HeartRateZonesSim />;
        default:
            return null;
    }
}
