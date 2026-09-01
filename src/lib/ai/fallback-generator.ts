// ════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE-BASE FALLBACK LESSON GENERATOR
// High-quality structured lesson from curated knowledge when Gemini unavailable
// ════════════════════════════════════════════════════════════════════════════

import { TopicContext, TopicLesson, TopicCategory, VisualType, Step } from './types';
import { RetrievedKnowledge } from './knowledge-base';

// Derives a step-by-step sequence for ANY topic — no subject/topic branching.
// Used to power the generic, cross-subject StepSimulator (not physics-specific).
function synthesizeSteps(facts: string[], hasKnowledge: boolean, topic: string): Step[] {
    if (hasKnowledge && facts.length >= 3) {
        return facts.slice(0, 5).map((fact, i) => ({
            step: i + 1,
            title: fact.split(/[,:.]/)[0].split(' ').slice(0, 6).join(' '),
            explanation: fact,
        }));
    }
    return [
        { step: 1, title: `What ${topic} is`, explanation: `Identify the core definition and parts of ${topic}.` },
        { step: 2, title: `How ${topic} works`, explanation: `Trace the mechanism or sequence that makes ${topic} happen.` },
        { step: 3, title: 'Why it matters', explanation: `See where ${topic} shows up and what changes if a key factor changes.` },
    ];
}

function inferVisualType(category: TopicCategory): VisualType {
    switch (category) {
        case 'EXPERIMENT': return 'EXPERIMENT_SETUP';
        case 'MATHEMATICAL_CONCEPT': return 'MATHEMATICAL_VISUAL';
        case 'HISTORY': return 'TIMELINE';
        case 'GEOGRAPHY': return 'STRUCTURE_DIAGRAM';
        case 'PROCESS': return 'PROCESS_FLOW';
        case 'COMPARISON': return 'COMPARISON';
        case 'STRUCTURE': return 'STRUCTURE_DIAGRAM';
        case 'SPORTS':
        case 'LANGUAGE':
        case 'OTHER': return 'INFOGRAPHIC';
        default: return 'SCIENTIFIC_DIAGRAM';
    }
}

export function generateFallbackLesson(
    ctx: TopicContext,
    category: TopicCategory,
    retrieved: RetrievedKnowledge
): Partial<TopicLesson> {
    const { subject, chapter, topic } = ctx;
    const hasKnowledge = retrieved.facts.length > 0;

    const facts = hasKnowledge ? retrieved.facts : [
        `${topic} is a key concept in ${chapter} within ${subject}.`,
        `Understanding ${topic} forms the basis for advanced topics in this chapter.`,
        `${topic} has real-world applications and is studied across educational levels.`,
    ];

    const formulas = (hasKnowledge && retrieved.formulas.length > 0)
        ? retrieved.formulas.map(f => ({
            formula: f.formula,
            meaning: f.meaning,
            variables: f.formula
                .replace(/[=+\-×·÷]/g, ' ')
                .split(' ')
                .filter(s => s.length === 1 && /[A-Za-z]/.test(s))
                .slice(0, 4)
                .map(sym => ({ symbol: sym, meaning: `Variable in ${topic}`, unit: '' })),
        }))
        : [];

    const visualType = inferVisualType(category);
    const elements = hasKnowledge ? retrieved.keyTerms.slice(0, 6) : [topic, subject, chapter];
    const steps = synthesizeSteps(facts, hasKnowledge, topic);
    const page2Type: VisualType =
        category === 'MATHEMATICAL_CONCEPT' ? 'MATHEMATICAL_VISUAL' :
            category === 'HISTORY' ? 'TIMELINE' :
                'PROCESS_FLOW';

    return {
        definition: hasKnowledge
            ? facts[0]
            : `${topic} is an important concept in ${chapter} (${subject}) that describes fundamental principles and their applications.`,

        simpleExplanation: hasKnowledge
            ? `Think of ${topic} like this: ${facts[1]} ${facts[2] ?? ''}`
            : `${topic} is like a foundation block — once you understand its core idea, everything else in ${chapter} becomes easier. It connects directly to the real world and helps explain phenomena you observe every day.`,

        detailedTheory: [
            facts[0] ?? `${topic} is central to ${chapter} in ${subject}.`,
            facts[1] ?? `The key aspects of ${topic} can be understood by examining its core principles.`,
            facts[2] ?? `Scientific study of ${topic} has led to practical applications across many fields.`,
            facts[3] ?? `Advanced understanding of ${topic} leads to deeper insight in ${chapter}.`,
        ].filter(Boolean) as string[],

        keyConcepts: [
            retrieved.keyTerms[0] && { title: retrieved.keyTerms[0], explanation: `${retrieved.keyTerms[0]} is a core component of ${topic}.` },
            retrieved.keyTerms[1] && { title: retrieved.keyTerms[1], explanation: `${retrieved.keyTerms[1]} plays an important role in understanding ${topic}.` },
            retrieved.keyTerms[2] && { title: retrieved.keyTerms[2], explanation: `${retrieved.keyTerms[2]} connects ${topic} to broader concepts in ${chapter}.` },
            !hasKnowledge && { title: 'Core Principle', explanation: `The fundamental idea behind ${topic} that makes it important in ${chapter}.` },
            !hasKnowledge && { title: 'Application', explanation: `How ${topic} is applied in solving real problems in ${subject}.` },
        ].filter(Boolean) as { title: string; explanation: string }[],

        formulas,

        example: hasKnowledge
            ? `Real-world example: ${facts[facts.length - 1]}`
            : `Consider how ${topic} appears in everyday situations. When you observe ${subject.toLowerCase()} in action, the principles of ${topic} are often at work — from natural phenomena to engineering solutions.`,

        keyTakeaways: [
            `${topic} is a fundamental concept in ${chapter} within ${subject}.`,
            hasKnowledge ? facts[0] : `Master the definition and core principles of ${topic} first.`,
            hasKnowledge ? (facts[1] ?? `Practice applying ${topic} to different scenarios.`) : `Real-world applications of ${topic} are widespread.`,
            `Understanding ${topic} is essential for progressing in ${subject}.`,
        ],

        steps,

        visualPlan: [
            {
                page: 1,
                type: visualType,
                title: `What is ${topic}?`,
                learningObjective: `Identify the structure and key parts of ${topic}`,
                elements: elements.slice(0, 5),
                caption: `Notice how these parts of ${topic} fit together in ${chapter}`,
            },
            {
                page: 2,
                type: page2Type,
                title: `How does ${topic} work?`,
                learningObjective: `Understand the mechanism, sequence, or relationship behind ${topic}`,
                elements: (steps.length > 0 ? steps.map(s => s.title) : elements).slice(0, 5),
                caption: `This is the sequence that makes ${topic} happen`,
            },
            {
                page: 3,
                type: 'COMPARISON',
                title: `What happens if ${topic} changes?`,
                learningObjective: `Explore how varying a key factor changes the outcome for ${topic}`,
                elements: elements.length > 0 ? elements : [topic, chapter, subject],
                caption: `Compare outcomes when a key variable in ${topic} is changed`,
            },
        ],
    };
}
