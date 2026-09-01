// ════════════════════════════════════════════════════════════════════════════
// VISUAL DOMAIN CLASSIFIER — ML-style weighted keyword scoring
// Maps a topic's search text to the correct deterministic SVG generator domain
// Same scoring pattern as src/lib/simulations/classifier.ts (classifySimulation)
// ════════════════════════════════════════════════════════════════════════════

export type VisualDomain =
    | 'atomic'
    | 'force'
    | 'circuit'
    | 'field'
    | 'thermo'
    | 'molecule'
    | 'earth'
    | 'none';

interface DomainEntry {
    id: VisualDomain;
    weight: number;
    keywords: string[];
}

const VISUAL_DOMAIN_REGISTRY: DomainEntry[] = [
    {
        id: 'atomic',
        weight: 1.0,
        keywords: [
            'atom', 'bohr', 'electron', 'nucleus', 'shell', 'orbital',
            'rutherford', 'thomson', 'quantum number', 'proton', 'neutron',
        ],
    },
    {
        id: 'force',
        weight: 1.0,
        keywords: [
            'force', 'newton', 'mass', 'acceleration', 'inertia', 'momentum',
            'friction', 'tension', 'gravity', 'circular motion', 'centripetal',
            'free body', 'work', 'energy', 'power', 'velocity', 'motion',
        ],
    },
    {
        id: 'circuit',
        weight: 1.0,
        keywords: [
            'circuit', 'resistor', 'resistance', 'current', 'ohm', "ohm's law",
            'galvanometer', 'ammeter', 'shunt', 'battery', 'switch',
            'series circuit', 'parallel circuit',
        ],
    },
    {
        id: 'field',
        weight: 1.0,
        keywords: [
            'coulomb', 'electric field', 'charge', 'magnetic force', 'magnetic field',
            'electromagnetic induction', 'emf', 'field lines', 'point charge', 'flux',
        ],
    },
    {
        id: 'thermo',
        weight: 0.95,
        keywords: [
            'thermodynamics', 'heat', 'entropy', 'internal energy', 'thermal equilibrium',
            'kinetic theory', 'gas law', 'heat transfer', 'conduction', 'convection',
            'radiation', 'temperature',
        ],
    },
    {
        id: 'molecule',
        weight: 1.0,
        keywords: [
            'ionic', 'covalent', 'bond', 'bonding', 'vsepr', 'electronegativity',
            'lewis structure', 'valence', 'hydrocarbon', 'functional group',
            'molecule', 'compound',
        ],
    },
    {
        id: 'earth',
        weight: 1.0,
        keywords: [
            'tectonic', 'plate', 'earthquake', 'volcano', 'continental drift',
            'crust', 'mantle', 'lithosphere', 'subduction', 'climate zone',
            'biome', 'latitude',
        ],
    },
];

export interface VisualDomainResult {
    id: VisualDomain;
    confidence: number; // 0–1
}

export function classifyVisualDomain(searchText: string): VisualDomainResult {
    const text = searchText.toLowerCase();

    let bestScore = 0;
    let bestEntry: DomainEntry | null = null;

    for (const entry of VISUAL_DOMAIN_REGISTRY) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (text.includes(kw)) {
                score += (kw.split(' ').length * 2) * entry.weight;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
        }
    }

    if (!bestEntry || bestScore === 0) {
        return { id: 'none', confidence: 0 };
    }

    const maxPossible = 30;
    const confidence = Math.min(1, bestScore / maxPossible);

    return { id: bestEntry.id, confidence };
}
