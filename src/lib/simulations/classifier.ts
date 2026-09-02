// ════════════════════════════════════════════════════════════════════════════
// SIMULATION CLASSIFIER — ML-style weighted keyword scoring
// Maps any topic to the most relevant physics simulation
// Extensible: add new simulations by adding entries to SIMULATION_REGISTRY
// ════════════════════════════════════════════════════════════════════════════

export type SimulationId =
    | 'galvanometer'
    | 'relative-motion'
    | 'bohr-atom'
    | 'pendulum'
    | 'ohms-law'
    | 'wave-interference'
    | 'projectile'
    | 'quadratic-grapher'
    | 'electrolysis-water'
    | 'india-map'
    | 'ww2-timeline'
    | 'tense-timeline'
    | 'heart-rate-zones'
    | 'none';

interface SimulationEntry {
    id: SimulationId;
    label: string;
    keywords: string[];
    subjectFilter?: string[]; // optional subject hint for higher precision
    weight: number;           // base confidence weight
}

// Scored registry — acts like a simple ML feature scorer
const SIMULATION_REGISTRY: SimulationEntry[] = [
    {
        id: 'galvanometer',
        label: 'Galvanometer Simulator',
        weight: 1.0,
        keywords: [
            'galvanometer', 'figure of merit', 'galvan',
            'current meter', 'moving coil', 'deflection',
            'sensitivity', 'current sensitivity', 'voltage sensitivity',
            'ammeter', 'shunt',
        ],
        subjectFilter: ['physics', 'chemistry'],
    },
    {
        id: 'relative-motion',
        label: 'Relative Motion Simulator',
        weight: 1.0,
        keywords: [
            'relative motion', 'relative velocity', 'relative speed',
            'frame of reference', 'inertial frame', 'non-inertial',
            'reference frame', 'observer', 'train motion',
            'boat river', 'man walking', 'relative acceleration',
        ],
        subjectFilter: ['physics'],
    },
    {
        id: 'bohr-atom',
        label: 'Interactive Bohr Atom',
        weight: 0.95,
        keywords: [
            'bohr model', 'bohr', 'electron transition', 'energy levels',
            'electron shell', 'excited state', 'ground state', 'emission',
            'absorption', 'hydrogen spectrum', 'atomic structure',
        ],
        subjectFilter: ['chemistry', 'physics'],
    },
    {
        id: 'pendulum',
        label: 'Pendulum Physics Simulator',
        weight: 0.9,
        keywords: [
            'pendulum', 'simple harmonic motion', 'shm', 'oscillation',
            'time period', 'amplitude', 'frequency', 'spring mass',
            'elastic', 'restoring force', 'damping', 'swing', 'grandfather clock',
        ],
        subjectFilter: ['physics'],
    },
    {
        id: 'quadratic-grapher',
        label: 'Quadratic Equation Grapher',
        weight: 1.0,
        keywords: [
            'quadratic', 'quadratic equation', 'parabola', 'discriminant',
            'roots of equation', 'vertex form',
        ],
        subjectFilter: ['mathematics', 'math', 'maths'],
    },
    {
        id: 'ohms-law',
        label: 'Ohm\'s Law Circuit Simulator',
        weight: 0.9,
        keywords: [
            'ohm', "ohm's law", 'circuit', 'resistor', 'current',
            'voltage', 'potential difference', 'resistance', 'conductor',
            'electric circuit', 'series circuit', 'parallel circuit',
            'kirchhoff', 'battery', 'emf',
        ],
        subjectFilter: ['physics'],
    },
    {
        id: 'wave-interference',
        label: 'Wave Interference Simulator',
        weight: 0.85,
        keywords: [
            'wave', 'interference', 'diffraction', 'superposition',
            'standing wave', 'transverse', 'longitudinal', 'amplitude wave',
            'wavelength', 'frequency wave', 'sound wave', 'light wave',
            'constructive', 'destructive', 'double slit', 'young experiment', 'ripple tank',
        ],
        subjectFilter: ['physics'],
    },
    {
        id: 'projectile',
        label: 'Projectile Motion Simulator',
        weight: 0.85,
        keywords: [
            'projectile', 'projectile motion', 'trajectory',
            'range', 'angle of projection', 'horizontal motion',
            'vertical motion', 'parabolic path', 'launch angle',
            'ballistic', 'kinematics',
        ],
        subjectFilter: ['physics'],
    },
    {
        id: 'electrolysis-water',
        label: 'Electrolysis of Water Simulator',
        weight: 0.9,
        keywords: [
            'electrolysis', 'electrolysis of water', 'anode', 'cathode',
            'redox', 'oxidation reduction', 'oxidation and reduction',
            'electrochemistry', 'electrochemical', 'ionization', 'ionic reaction',
            'decomposition of water', 'faraday law', "faraday's law",
        ],
        subjectFilter: ['chemistry'],
    },
    {
        id: 'electrolysis-water',
        label: 'Electrolysis of Water Simulator',
        weight: 0.2,
        keywords: ['chemistry', 'chemical'],
        subjectFilter: ['chemistry'],
    },
    {
        id: 'india-map',
        label: 'Interactive India Map',
        weight: 0.9,
        keywords: [
            'map', 'indian states', 'states of india', 'geography of india',
            'political map', 'physical map', 'state capital', 'capitals',
            'population distribution', 'union territory', 'union territories',
        ],
        subjectFilter: ['geography'],
    },
    {
        id: 'india-map',
        label: 'Interactive India Map',
        weight: 0.2,
        keywords: ['geography', 'geographical'],
        subjectFilter: ['geography'],
    },
    {
        id: 'ww2-timeline',
        label: 'Interactive History Timeline',
        weight: 0.9,
        keywords: [
            'timeline', 'chronology', 'sequence of events', 'world war',
            'world war ii', 'world war 2', 'historical events', 'era',
            'freedom struggle', 'independence movement', 'revolution',
        ],
        subjectFilter: ['history'],
    },
    {
        id: 'ww2-timeline',
        label: 'Interactive History Timeline',
        weight: 0.2,
        keywords: ['history', 'historical'],
        subjectFilter: ['history'],
    },
    {
        id: 'tense-timeline',
        label: 'Interactive Tense Explorer',
        weight: 0.9,
        keywords: [
            'tense', 'tenses', 'verb form', 'past tense', 'present tense',
            'future tense', 'continuous tense', 'perfect tense', 'grammar',
            'simple present', 'simple past', 'simple future',
        ],
        subjectFilter: ['english'],
    },
    {
        id: 'tense-timeline',
        label: 'Interactive Tense Explorer',
        weight: 0.2,
        keywords: ['english', 'language'],
        subjectFilter: ['english'],
    },
    {
        id: 'heart-rate-zones',
        label: 'Heart Rate Training Zones',
        weight: 0.9,
        keywords: [
            'heart rate', 'fitness', 'training zones', 'cardio',
            'exercise intensity', 'aerobic', 'anaerobic', 'endurance training',
            'pulse rate', 'target heart rate', 'physical fitness',
        ],
        subjectFilter: ['sports'],
    },
    {
        id: 'heart-rate-zones',
        label: 'Heart Rate Training Zones',
        weight: 0.2,
        keywords: ['sports', 'physical education', 'pe'],
        subjectFilter: ['sports'],
    },
];

export interface ClassificationResult {
    id: SimulationId;
    label: string;
    confidence: number; // 0–1
}

// ── Scoring function (ML-inspired weighted feature matching) ──────────────────

export function classifySimulation(
    topic: string,
    chapter: string,
    subject: string
): ClassificationResult {
    const searchText = `${topic} ${chapter} ${subject}`.toLowerCase();
    const subjectLower = subject.toLowerCase();

    let bestScore = 0;
    let bestEntry: SimulationEntry | null = null;

    for (const entry of SIMULATION_REGISTRY) {
        let score = 0;

        // Subject filter boost
        const subjectMatch = !entry.subjectFilter ||
            entry.subjectFilter.some(sf => subjectLower.includes(sf));
        if (!subjectMatch) continue;

        // Keyword scoring: longer keyword matches score higher
        for (const kw of entry.keywords) {
            if (searchText.includes(kw)) {
                // Weight by keyword length (specificity)
                score += (kw.split(' ').length * 2) * entry.weight;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
        }
    }

    if (!bestEntry || bestScore === 0) {
        return { id: 'none', label: 'No simulation', confidence: 0 };
    }

    // Normalize confidence to 0–1 range
    const maxPossible = 30;
    const confidence = Math.min(1, bestScore / maxPossible);

    return {
        id: bestEntry.id,
        label: bestEntry.label,
        confidence,
    };
}
