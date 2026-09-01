// ════════════════════════════════════════════════════════════════════════════
// MULTIMODAL AI LEARNING ENGINE — TYPES
// ════════════════════════════════════════════════════════════════════════════

export type TopicCategory =
    | 'SCIENTIFIC_CONCEPT'
    | 'EXPERIMENT'
    | 'MATHEMATICAL_CONCEPT'
    | 'GEOGRAPHY'
    | 'HISTORY'
    | 'LANGUAGE'
    | 'SPORTS'
    | 'PROCESS'
    | 'STRUCTURE'
    | 'COMPARISON'
    | 'OTHER';

export type VisualType =
    | 'SCIENTIFIC_DIAGRAM'
    | 'EXPERIMENT_SETUP'
    | 'PROCESS_FLOW'
    | 'TIMELINE'
    | 'MATHEMATICAL_VISUAL'
    | 'ANATOMICAL_DIAGRAM'
    | 'STRUCTURE_DIAGRAM'
    | 'COMPARISON'
    | 'INFOGRAPHIC'
    | 'MAP';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TopicContext {
    subject: string;
    subjectId: string;
    chapter: string;
    topic: string;
    userLevel: UserLevel;
}

export interface VisualPlan {
    page: number;
    type: VisualType;
    title: string;
    learningObjective: string;
    elements: string[];
    relationships?: { from: string; to: string; label: string }[];
    caption: string;
}

export interface FormulaVar {
    symbol: string;
    meaning: string;
    unit?: string;
}

export interface Formula {
    formula: string;
    meaning: string;
    variables: FormulaVar[];
}

export interface KeyConcept {
    title: string;
    explanation: string;
}

export interface Component {
    name: string;
    purpose: string;
}

export interface Step {
    step: number;
    title: string;
    explanation: string;
}

export interface TopicLesson {
    subject: string;
    chapter: string;
    topic: string;
    category: TopicCategory;
    definition: string;
    simpleExplanation: string;
    detailedTheory: string[];
    keyConcepts: KeyConcept[];
    formulas: Formula[];
    components?: Component[];
    steps?: Step[];
    example: string;
    keyTakeaways: string[];
    visualPlan: VisualPlan[];
    metadata: {
        generatedAt: string;
        confidence: number;
        validated: boolean;
        cached: boolean;
        cacheKey: string;
        source: 'ai_generated' | 'knowledge_base' | 'hybrid';
    };
}

export interface ValidationIssue {
    type: 'FACT_ERROR' | 'MISSING_CONTENT' | 'POOR_QUALITY' | 'SCHEMA_ERROR';
    field: string;
    reason: string;
}

export interface ValidationResult {
    valid: boolean;
    confidence: number;
    issues: ValidationIssue[];
    correctedFields?: Partial<TopicLesson>;
}

export interface GeneratedVisual {
    page: number;
    title: string;
    type: VisualType;
    svgContent: string;
    caption: string;
    learningObjective: string;
    labels: { x: number; y: number; text: string }[];
}

export interface LessonFeedback {
    lessonId: string;
    helpful: boolean;
    detail?: 'too_difficult' | 'too_simple' | 'visual_didnt_help' | 'need_more_examples';
    timestamp: string;
}

export interface PipelineProgress {
    stage:
    | 'understanding'
    | 'retrieving'
    | 'generating'
    | 'validating'
    | 'visual_planning'
    | 'visual_generating'
    | 'complete'
    | 'error';
    message: string;
    progress: number; // 0–100
}
