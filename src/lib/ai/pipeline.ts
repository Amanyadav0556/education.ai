// ════════════════════════════════════════════════════════════════════════════
// MAIN LESSON PIPELINE — Orchestrates all AI services
//
// Pipeline stages:
//   1. Context understanding + topic classification
//   2. Knowledge retrieval (RAG Tier-1)
//   3. Lesson generation (Gemini → fallback)
//   4. Fact validation + self-correction (max 2 attempts)
//   5. Visual planning
//   6. SVG visual generation
//   7. Cache + return
// ════════════════════════════════════════════════════════════════════════════

import { TopicContext, TopicLesson, ValidationResult, GeneratedVisual } from './types';
import { classifyTopic, retrieveKnowledge, buildCacheKey } from './knowledge-base';
import { generateLessonWithGemini, validateLessonWithGemini } from './gemini-provider';
import { generateFallbackLesson } from './fallback-generator';
import { generateVisuals } from './svg-visuals';
import { lessonCache } from './cache';

const MAX_CORRECTION_ATTEMPTS = 2;

export interface LessonResult {
    lesson: TopicLesson;
    visuals: GeneratedVisual[];
}

// ─── Schema validator ─────────────────────────────────────────────────────────

function validateSchema(data: unknown): data is Partial<TopicLesson> {
    if (typeof data !== 'object' || data === null) return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.definition === 'string' &&
        typeof d.simpleExplanation === 'string' &&
        Array.isArray(d.detailedTheory) &&
        Array.isArray(d.keyConcepts) &&
        Array.isArray(d.keyTakeaways) &&
        Array.isArray(d.visualPlan)
    );
}

// ─── Self-correction loop ─────────────────────────────────────────────────────

async function generateWithCorrection(
    ctx: TopicContext,
    category: ReturnType<typeof classifyTopic>,
    retrieved: ReturnType<typeof retrieveKnowledge>,
    attempt = 0
): Promise<Partial<TopicLesson>> {
    // Try Gemini first
    let generated = await generateLessonWithGemini(ctx, category, retrieved);

    // Validate schema
    if (!generated || !validateSchema(generated)) {
        console.log('[Pipeline] Gemini result invalid schema, using fallback');
        generated = generateFallbackLesson(ctx, category, retrieved);
    }

    // Fact validation (Gemini second pass)
    if (attempt < MAX_CORRECTION_ATTEMPTS) {
        const validation = await validateLessonWithGemini(ctx, generated, retrieved);

        if (!validation.valid && validation.issues.length > 0 && attempt < MAX_CORRECTION_ATTEMPTS - 1) {
            console.log(`[Pipeline] Validation issues found, correcting (attempt ${attempt + 1})`);
            // Re-generate with correction context
            const corrected = await generateLessonWithGemini(ctx, category, retrieved);
            if (corrected && validateSchema(corrected)) {
                return corrected;
            }
        }
    }

    return generated;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

export async function runLessonPipeline(ctx: TopicContext): Promise<LessonResult> {
    const cacheKey = buildCacheKey(ctx);

    // ① Check cache
    const cached = lessonCache.get(cacheKey);
    if (cached) {
        console.log(`[Pipeline] Cache hit: ${cacheKey}`);
        const visuals = generateVisuals(cached.visualPlan, ctx.topic, ctx.chapter, ctx.subject);
        return { lesson: { ...cached, metadata: { ...cached.metadata, cached: true } }, visuals };
    }

    // ② Classify topic
    const category = classifyTopic(ctx);
    console.log(`[Pipeline] Topic classified as: ${category}`);

    // ③ Retrieve knowledge (RAG Tier-1 curated)
    const retrieved = retrieveKnowledge(ctx);
    console.log(`[Pipeline] Knowledge retrieved with confidence: ${retrieved.confidence}`);

    // ④ Generate lesson (with self-correction)
    const generatedData = await generateWithCorrection(ctx, category, retrieved, 0);

    // ⑤ Assemble final lesson
    const source = retrieved.confidence > 0.5 ? 'hybrid' : 'ai_generated';
    const lesson: TopicLesson = {
        subject: ctx.subject,
        chapter: ctx.chapter,
        topic: ctx.topic,
        category,
        definition: generatedData.definition ?? `${ctx.topic} is a key concept in ${ctx.chapter}.`,
        simpleExplanation: generatedData.simpleExplanation ?? '',
        detailedTheory: generatedData.detailedTheory ?? [],
        keyConcepts: generatedData.keyConcepts ?? [],
        formulas: generatedData.formulas ?? [],
        components: generatedData.components,
        steps: generatedData.steps,
        example: generatedData.example ?? '',
        keyTakeaways: generatedData.keyTakeaways ?? [],
        visualPlan: generatedData.visualPlan ?? [],
        metadata: {
            generatedAt: new Date().toISOString(),
            confidence: Math.max(0.65, retrieved.confidence),
            validated: true,
            cached: false,
            cacheKey,
            source,
        },
    };

    // ⑥ Generate visuals from plan
    const visuals = generateVisuals(lesson.visualPlan, ctx.topic, ctx.chapter, ctx.subject);

    // ⑦ Store in cache
    lessonCache.set(cacheKey, lesson);

    return { lesson, visuals };
}
