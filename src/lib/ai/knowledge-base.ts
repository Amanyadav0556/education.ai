// ════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE BASE — Curated educational content (RAG Tier-1 source)
// Used as the highest-priority context before LLM generation
// ════════════════════════════════════════════════════════════════════════════

import { TopicCategory, TopicContext } from './types';

interface KnowledgeEntry {
    subjectKeywords: string[];
    topicKeywords: string[];
    category: TopicCategory;
    facts: string[];
    formulas?: { formula: string; meaning: string }[];
    keyTerms: string[];
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
    // ── CHEMISTRY ────────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['chemistry', 'chem'],
        topicKeywords: ['bohr model', 'bohr', 'bohr atom'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'Niels Bohr proposed the Bohr model in 1913.',
            'Electrons orbit the nucleus in fixed circular paths called energy levels or shells.',
            'Energy levels are labelled n=1, n=2, n=3 from the nucleus outward.',
            'Electrons can absorb energy and jump to a higher energy level (excited state).',
            'When an electron falls back to a lower energy level it emits a photon of light.',
            'The energy of emitted light equals the difference between the two energy levels: E = hν.',
            'The Bohr model successfully explained the hydrogen atom spectrum.',
            'Ground state is when the electron is at the lowest possible energy level (n=1).',
            'At higher energy levels electrons are farther from the nucleus.',
        ],
        formulas: [
            { formula: 'E = hν', meaning: 'Energy of emitted photon (h = Planck constant, ν = frequency)' },
            { formula: 'En = -13.6/n² eV', meaning: 'Energy of the nth orbit in hydrogen atom' },
            { formula: 'rn = n² × 0.529 Å', meaning: 'Radius of the nth orbit (Bohr radius)' },
        ],
        keyTerms: ['nucleus', 'electron', 'energy level', 'photon', 'ground state', 'excited state', 'shell', 'orbit'],
    },
    {
        subjectKeywords: ['chemistry', 'chem'],
        topicKeywords: ['rutherford model', 'rutherford', 'gold foil', 'nuclear model'],
        category: 'EXPERIMENT',
        facts: [
            'Ernest Rutherford proposed the nuclear model of the atom in 1911.',
            'Rutherford fired alpha particles at a thin gold foil.',
            'Most alpha particles passed straight through the gold foil.',
            'A small fraction of alpha particles were deflected at large angles.',
            'Very few alpha particles bounced back (about 1 in 20,000).',
            'Rutherford concluded that the atom has a tiny, dense, positively charged nucleus.',
            'Most of the atom is empty space.',
            'The nucleus contains almost all the mass of the atom.',
        ],
        formulas: [],
        keyTerms: ['alpha particle', 'gold foil', 'nucleus', 'deflection', 'scattering', 'positive charge', 'empty space'],
    },
    {
        subjectKeywords: ['chemistry', 'chem'],
        topicKeywords: ['atomic structure', 'atom', 'atomic model'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'An atom consists of a nucleus (protons + neutrons) surrounded by electrons.',
            'Protons have a positive charge (+1), neutrons have no charge, electrons have negative charge (-1).',
            'The number of protons determines the element (atomic number Z).',
            'Atomic mass number A = protons + neutrons.',
            'Electrons occupy orbitals around the nucleus in regions called electron shells.',
        ],
        formulas: [
            { formula: 'A = Z + N', meaning: 'Mass number = Atomic number + Neutron number' },
        ],
        keyTerms: ['proton', 'neutron', 'electron', 'nucleus', 'atomic number', 'mass number', 'shell', 'orbital'],
    },
    {
        subjectKeywords: ['chemistry', 'chem'],
        topicKeywords: ['ionic bond', 'covalent bond', 'chemical bonding', 'bonding'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'Ionic bonds form when one atom transfers electrons to another.',
            'Covalent bonds form when atoms share electrons.',
            'Ionic bonds typically form between metals and non-metals.',
            'Covalent bonds typically form between non-metals.',
            'Electronegativity difference determines bond type: >1.7 = ionic, <1.7 = covalent.',
        ],
        formulas: [],
        keyTerms: ['ionic', 'covalent', 'electronegativity', 'electron transfer', 'electron sharing', 'bond'],
    },

    // ── PHYSICS ──────────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['physics', 'phys'],
        topicKeywords: ["newton's laws", 'newton laws', 'laws of motion', 'newtons laws'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            "Newton's First Law: An object remains at rest or in uniform motion unless acted upon by a net external force (Law of Inertia).",
            "Newton's Second Law: The acceleration of an object is directly proportional to the net force and inversely proportional to mass. F = ma.",
            "Newton's Third Law: For every action there is an equal and opposite reaction.",
            'The unit of force is the Newton (N) = kg·m/s².',
            'Inertia is the tendency of an object to resist changes in its state of motion.',
        ],
        formulas: [
            { formula: 'F = ma', meaning: 'Force = mass × acceleration' },
            { formula: 'p = mv', meaning: 'Momentum = mass × velocity' },
            { formula: 'a = F/m', meaning: 'Acceleration = Force / mass' },
        ],
        keyTerms: ['force', 'mass', 'acceleration', 'inertia', 'momentum', 'action', 'reaction'],
    },
    {
        subjectKeywords: ['physics', 'phys'],
        topicKeywords: ['thermodynamics', 'heat', 'temperature', 'entropy'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'Zeroth Law: If two systems are in thermal equilibrium with a third, they are in thermal equilibrium with each other.',
            'First Law: Energy cannot be created or destroyed, only converted. ΔU = Q - W.',
            'Second Law: Entropy of an isolated system always increases.',
            'Third Law: The entropy of a perfect crystal at 0 K is zero.',
            'Heat flows from hot to cold spontaneously.',
        ],
        formulas: [
            { formula: 'ΔU = Q - W', meaning: 'Change in internal energy = Heat added - Work done by system' },
            { formula: 'ΔS ≥ 0', meaning: 'Entropy change is non-negative for isolated systems' },
        ],
        keyTerms: ['heat', 'entropy', 'internal energy', 'temperature', 'work', 'thermal equilibrium'],
    },
    {
        subjectKeywords: ['physics', 'phys'],
        topicKeywords: ['circular motion', 'centripetal', 'centrifugal'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'Circular motion requires a centripetal force directed toward the center.',
            'Centripetal acceleration = v²/r.',
            'Centripetal force = mv²/r.',
            'Period T is the time taken to complete one revolution.',
            'Angular velocity ω = 2π/T.',
        ],
        formulas: [
            { formula: 'Fc = mv²/r', meaning: 'Centripetal force' },
            { formula: 'ac = v²/r', meaning: 'Centripetal acceleration' },
            { formula: 'ω = 2π/T', meaning: 'Angular velocity' },
        ],
        keyTerms: ['centripetal', 'radius', 'period', 'frequency', 'angular velocity', 'orbit'],
    },

    // ── MATHEMATICS ──────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['mathematics', 'math', 'maths'],
        topicKeywords: ['differentiation', 'derivative', 'calculus'],
        category: 'MATHEMATICAL_CONCEPT',
        facts: [
            'Differentiation finds the rate of change (slope) of a function.',
            "The derivative of f(x) at a point is the limit of the difference quotient as h→0.",
            'Common rule: d/dx(xⁿ) = nxⁿ⁻¹ (Power Rule).',
            'Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x).',
            'Product rule: d/dx[uv] = u\'v + uv\'.',
        ],
        formulas: [
            { formula: "f'(x) = lim[h→0] (f(x+h) - f(x)) / h", meaning: 'Definition of derivative' },
            { formula: 'd/dx(xⁿ) = nxⁿ⁻¹', meaning: 'Power rule' },
            { formula: 'd/dx(sin x) = cos x', meaning: 'Derivative of sine' },
            { formula: 'd/dx(eˣ) = eˣ', meaning: 'Derivative of e^x' },
        ],
        keyTerms: ['derivative', 'slope', 'rate of change', 'limit', 'tangent', 'chain rule', 'product rule'],
    },
    {
        subjectKeywords: ['mathematics', 'math', 'maths'],
        topicKeywords: ['integration', 'integral', 'antiderivative'],
        category: 'MATHEMATICAL_CONCEPT',
        facts: [
            'Integration is the reverse of differentiation (antiderivative).',
            'Definite integral gives the area under a curve between two limits.',
            'Indefinite integral gives a family of functions (+ C).',
            '∫xⁿ dx = xⁿ⁺¹/(n+1) + C (for n ≠ -1).',
            'Fundamental Theorem of Calculus links differentiation and integration.',
        ],
        formulas: [
            { formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', meaning: 'Power rule for integration' },
            { formula: '∫sin(x) dx = -cos(x) + C', meaning: 'Integral of sine' },
            { formula: '∫eˣ dx = eˣ + C', meaning: 'Integral of e^x' },
        ],
        keyTerms: ['antiderivative', 'area', 'definite integral', 'indefinite integral', 'constant of integration', 'limits'],
    },
    {
        subjectKeywords: ['mathematics', 'math', 'maths'],
        topicKeywords: ['quadratic', 'quadratic equation', 'parabola'],
        category: 'MATHEMATICAL_CONCEPT',
        facts: [
            'A quadratic equation has the form ax² + bx + c = 0.',
            'The solutions are called roots and are found using the quadratic formula.',
            'Discriminant D = b² - 4ac determines the nature of roots.',
            'If D > 0: two distinct real roots. If D = 0: one real root. If D < 0: complex roots.',
            'The graph of a quadratic is a parabola.',
        ],
        formulas: [
            { formula: 'x = (-b ± √(b²-4ac)) / 2a', meaning: 'Quadratic formula' },
            { formula: 'D = b² - 4ac', meaning: 'Discriminant' },
            { formula: 'sum of roots = -b/a', meaning: 'Vieta\'s formulas' },
        ],
        keyTerms: ['roots', 'discriminant', 'parabola', 'vertex', 'coefficient', 'quadratic formula'],
    },

    // ── HISTORY ──────────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['history', 'hist'],
        topicKeywords: ['world war i', 'world war 1', 'ww1', 'first world war', 'great war'],
        category: 'HISTORY',
        facts: [
            'World War I lasted from July 28, 1914 to November 11, 1918.',
            'It was triggered by the assassination of Archduke Franz Ferdinand of Austria-Hungary on June 28, 1914.',
            'The main alliances were the Triple Entente (France, Britain, Russia) and the Triple Alliance (Germany, Austria-Hungary, Italy).',
            'New warfare technologies included trench warfare, poison gas, tanks, and aircraft.',
            'The war ended with the Treaty of Versailles in 1919.',
            'Around 17 million people died making it one of the deadliest conflicts in history.',
        ],
        formulas: [],
        keyTerms: ['assassination', 'trench warfare', 'armistice', 'Treaty of Versailles', 'Western Front', 'Allied Powers', 'Central Powers'],
    },
    {
        subjectKeywords: ['history', 'hist'],
        topicKeywords: ['world war ii', 'world war 2', 'ww2', 'second world war'],
        category: 'HISTORY',
        facts: [
            'World War II lasted from September 1, 1939 to September 2, 1945.',
            'Germany invaded Poland on September 1, 1939, triggering the war.',
            'The Allied Powers included USA, UK, Soviet Union, France, and China.',
            'The Axis Powers included Germany, Italy, and Japan.',
            'The Holocaust resulted in the genocide of approximately 6 million Jews.',
            'The USA dropped atomic bombs on Hiroshima (August 6, 1945) and Nagasaki (August 9, 1945).',
            'The war ended with Germany surrendering on May 8, 1945 (VE Day) and Japan on September 2, 1945 (VJ Day).',
        ],
        formulas: [],
        keyTerms: ['Holocaust', 'D-Day', 'atomic bomb', 'Nazi Germany', 'Blitzkrieg', 'Pearl Harbor', 'Allied Powers', 'Axis Powers'],
    },

    // ── GEOGRAPHY ────────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['geography', 'geo'],
        topicKeywords: ['plate tectonics', 'tectonic', 'continental drift'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'The Earth\'s lithosphere is divided into large tectonic plates.',
            'Plates move due to convection currents in the mantle.',
            'Convergent boundaries: plates move toward each other (causes mountains, trenches).',
            'Divergent boundaries: plates move apart (causes mid-ocean ridges, rift valleys).',
            'Transform boundaries: plates slide past each other (causes earthquakes).',
            'Alfred Wegener proposed the theory of continental drift in 1912.',
        ],
        formulas: [],
        keyTerms: ['lithosphere', 'mantle', 'convergent', 'divergent', 'transform', 'subduction', 'mid-ocean ridge'],
    },
    {
        subjectKeywords: ['geography', 'geo'],
        topicKeywords: ['climate zone', 'climate', 'biome', 'weather'],
        category: 'SCIENTIFIC_CONCEPT',
        facts: [
            'The five main climate zones are: Tropical, Dry, Temperate, Continental, and Polar.',
            'Climate is the average weather conditions of a region over 30 years.',
            'The tropics lie between 23.5°N (Tropic of Cancer) and 23.5°S (Tropic of Capricorn).',
            'Altitude affects climate: temperature decreases ~6.5°C per 1000m rise.',
            'Ocean currents significantly influence coastal climates.',
        ],
        formulas: [],
        keyTerms: ['latitude', 'altitude', 'precipitation', 'humidity', 'biome', 'tropics', 'polar', 'temperate'],
    },

    // ── ENGLISH ──────────────────────────────────────────────────────────────────
    {
        subjectKeywords: ['english', 'lang', 'language'],
        topicKeywords: ['tenses', 'tense', 'verb tense'],
        category: 'LANGUAGE',
        facts: [
            'English has three main tenses: Past, Present, and Future.',
            'Each tense has four aspects: Simple, Continuous, Perfect, and Perfect Continuous.',
            'Simple Present uses base form or s/es form of the verb.',
            'Simple Past uses the past form of the verb (or -ed for regular verbs).',
            'Present Perfect uses have/has + past participle.',
        ],
        formulas: [],
        keyTerms: ['verb', 'tense', 'auxiliary', 'participle', 'continuous', 'perfect', 'simple', 'past', 'present', 'future'],
    },
];

// ── Classifier ───────────────────────────────────────────────────────────────

export function classifyTopic(ctx: TopicContext): TopicCategory {
    const search = `${ctx.subject} ${ctx.chapter} ${ctx.topic}`.toLowerCase();

    if (/experiment|gold foil|rutherford/.test(search)) return 'EXPERIMENT';
    if (/war|battle|revolution|independence|empire|civilization/.test(search)) return 'HISTORY';
    if (/map|state|country|continent|capital|river|mountain|geography|climate|zone|plate|tectonic/.test(search)) return 'GEOGRAPHY';
    if (/calculus|derivative|integral|algebra|equation|theorem|proof|matrix|vector|probability|geometry/.test(search)) return 'MATHEMATICAL_CONCEPT';
    if (/grammar|tense|sentence|literature|poetry|novel|metaphor|simile|figure/.test(search)) return 'LANGUAGE';
    if (/fitness|sport|exercise|game|training|athlete/.test(search)) return 'SPORTS';
    if (/computer science|programming|coding|algorithm/.test(search)) return 'PROCESS';
    if (/process|how to|steps|procedure|method/.test(search)) return 'PROCESS';
    if (/compare|difference|types|kinds|classification/.test(search)) return 'COMPARISON';
    if (/biology|\bbio\b/.test(search)) return 'SCIENTIFIC_CONCEPT';
    if (/model|structure|atom|cell|organ|anatomy|molecule|bond|force|energy|wave|motion|law|theorem|circuit|current|voltage|resistance|resistor|galvanometer|ammeter|induction|electromagnet|magnetic|charge|thermodynamics|heat|kinetic|quantum|hydrocarbon|functional group|vsepr/.test(search)) return 'SCIENTIFIC_CONCEPT';

    return 'OTHER';
}

// ── Knowledge retrieval ───────────────────────────────────────────────────────

export interface RetrievedKnowledge {
    facts: string[];
    formulas: { formula: string; meaning: string }[];
    keyTerms: string[];
    confidence: number;
}

export function retrieveKnowledge(ctx: TopicContext): RetrievedKnowledge {
    const search = `${ctx.subject} ${ctx.chapter} ${ctx.topic}`.toLowerCase();

    let bestMatch: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of KNOWLEDGE_BASE) {
        let score = 0;

        for (const kw of entry.subjectKeywords) {
            if (search.includes(kw)) score += 2;
        }
        for (const kw of entry.topicKeywords) {
            if (search.includes(kw)) score += 5;
            // partial match
            if (kw.split(' ').every(w => search.includes(w))) score += 3;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (!bestMatch || bestScore < 3) {
        return {
            facts: [],
            formulas: [],
            keyTerms: [],
            confidence: 0,
        };
    }

    return {
        facts: bestMatch.facts,
        formulas: bestMatch.formulas ?? [],
        keyTerms: bestMatch.keyTerms,
        confidence: Math.min(1, bestScore / 15),
    };
}

// ── Cache key builder ─────────────────────────────────────────────────────────

export function buildCacheKey(ctx: TopicContext): string {
    return [ctx.subjectId, ctx.chapter, ctx.topic, ctx.userLevel, 'v2']
        .join(':')
        .toLowerCase()
        .replace(/\s+/g, '-');
}
