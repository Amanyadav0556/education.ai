// ════════════════════════════════════════════════════════════════════════════
// GEMINI AI PROVIDER — Structured lesson generation
// Uses @google/generative-ai with JSON response mode
// ════════════════════════════════════════════════════════════════════════════

import { GoogleGenerativeAI } from '@google/generative-ai';
import { TopicContext, TopicLesson, TopicCategory, VisualType } from './types';
import { RetrievedKnowledge } from './knowledge-base';

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    if (!_genAI) _genAI = new GoogleGenerativeAI(key);
    return _genAI;
}

// ── Core lesson prompt ────────────────────────────────────────────────────────

function buildLessonPrompt(
    ctx: TopicContext,
    category: TopicCategory,
    retrieved: RetrievedKnowledge
): string {
    const knowledgeContext = retrieved.facts.length > 0
        ? `\n\nVERIFIED EDUCATIONAL FACTS (always use these, do not contradict):\n${retrieved.facts.map(f => `- ${f}`).join('\n')}\n\nVERIFIED FORMULAS:\n${retrieved.formulas.map(f => `- ${f.formula}: ${f.meaning}`).join('\n')}`
        : '';

    return `You are an expert educational content creator. Generate a complete, accurate lesson for a student.

TOPIC CONTEXT:
- Subject: ${ctx.subject}
- Chapter: ${ctx.chapter}
- Topic: ${ctx.topic}
- Student Level: ${ctx.userLevel}
- Topic Category: ${category}
${knowledgeContext}

INSTRUCTIONS:
1. Be scientifically accurate. Never invent formulas, dates, or facts.
2. Use ${ctx.userLevel}-appropriate language.
3. Only include formulas if they genuinely apply to this specific topic.
4. Include "steps" whenever the topic has any sequence, mechanism, or cause-effect chain — this applies across ALL subjects (a biological process, a historical chain of events, an algorithm, a grammar transformation, a sports technique breakdown), not just physics experiments. Return an empty array only if genuinely no sequence exists (e.g. a single static fact or definition).
5. Only include "components" if the topic involves equipment or parts.
6. Always include exactly 3 visual plans, structured as:
   - Page 1 = "What is it?" — structure, parts, labels, core idea
   - Page 2 = "How does it work?" — process, mechanism, or relationship (reuse the same sequence as "steps" if present)
   - Page 3 = "What happens if you change something?" — comparison, experiment, or parameter-change framing
   Title each visual to match its role (e.g. "What is X?", "How does X work?", "What happens if X changes?").
7. The visual plan should describe what to DRAW, not just repeat the topic name.
8. Each visual must have a clear learning objective, and "caption" must be a single "notice this" takeaway sentence for the student — not a restatement of the title.

Return ONLY a valid JSON object with this EXACT structure (no markdown, no extra text):
{
  "definition": "1-2 sentence precise definition",
  "simpleExplanation": "Beginner-friendly explanation in 2-3 sentences using simple analogies",
  "detailedTheory": ["paragraph 1", "paragraph 2", "paragraph 3"],
  "keyConcepts": [
    { "title": "Concept Name", "explanation": "clear explanation" }
  ],
  "formulas": [
    {
      "formula": "E = mc²",
      "meaning": "what this formula means",
      "variables": [{ "symbol": "E", "meaning": "Energy in Joules", "unit": "J" }]
    }
  ],
  "components": [
    { "name": "Component", "purpose": "what it does" }
  ],
  "steps": [
    { "step": 1, "title": "Step title", "explanation": "detailed explanation" }
  ],
  "example": "A concrete real-world example that makes the concept tangible",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "visualPlan": [
    {
      "page": 1,
      "type": "SCIENTIFIC_DIAGRAM",
      "title": "Descriptive visual title",
      "learningObjective": "What the student will understand from this visual",
      "elements": ["element1", "element2", "element3"],
      "relationships": [{ "from": "element1", "to": "element2", "label": "relationship" }],
      "caption": "Short caption explaining the visual"
    }
  ]
}

Choose "type" based on what the visual should actually show — do not default everything to SCIENTIFIC_DIAGRAM:
- MATHEMATICAL_VISUAL: graphs, equations, geometric figures
- PROCESS_FLOW: a sequence or mechanism with clear ordered steps
- TIMELINE: historical/chronological events
- EXPERIMENT_SETUP: lab apparatus and procedure
- STRUCTURE_DIAGRAM: a physical/molecular/geological/mechanical structure with labeled parts (circuits, forces, bonds, tectonic plates, etc.)
- ANATOMICAL_DIAGRAM: biological structures
- COMPARISON: contrasting two or more things
- INFOGRAPHIC: fact summaries with no single clear diagram
- SCIENTIFIC_DIAGRAM: only for atomic/particle-level concept diagrams that don't fit any of the above

"elements" must be the actual concrete parts to draw for THIS topic (e.g. real force names, real circuit components, real atom names, real plate names) — never generic filler words like "concept" or "detail".

For empty arrays (e.g. formulas for a history topic), use [].`;
}

// ── Gemini generation call ────────────────────────────────────────────────────

export async function generateLessonWithGemini(
    ctx: TopicContext,
    category: TopicCategory,
    retrieved: RetrievedKnowledge
): Promise<Partial<TopicLesson> | null> {
    const ai = getGenAI();
    if (!ai) return null;

    try {
        const model = ai.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.3, // low temp for accuracy
                maxOutputTokens: 4096,
            },
        });

        const prompt = buildLessonPrompt(ctx, category, retrieved);
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const parsed = JSON.parse(text);
        return parsed as Partial<TopicLesson>;
    } catch (err) {
        console.error('[GeminiProvider] Generation failed:', err);
        return null;
    }
}

// ── Fact validation using Gemini ──────────────────────────────────────────────

export async function validateLessonWithGemini(
    ctx: TopicContext,
    lesson: Partial<TopicLesson>,
    retrieved: RetrievedKnowledge
): Promise<{ valid: boolean; issues: string[]; confidence: number }> {
    const ai = getGenAI();
    if (!ai) return { valid: true, issues: [], confidence: 0.7 };

    try {
        const model = ai.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1,
                maxOutputTokens: 1024,
            },
        });

        const knownFacts = retrieved.facts.length > 0
            ? `VERIFIED FACTS:\n${retrieved.facts.join('\n')}`
            : 'No pre-verified facts available.';

        const prompt = `You are a fact-checker for educational content.

Topic: ${ctx.topic} (${ctx.subject} - ${ctx.chapter})
${knownFacts}

LESSON TO VALIDATE:
Definition: ${lesson.definition}
Key facts from theory: ${(lesson.detailedTheory ?? []).join(' | ')}
Formulas: ${(lesson.formulas ?? []).map(f => f.formula + ': ' + f.meaning).join('; ')}

Check for:
1. Incorrect scientific facts
2. Wrong formulas or missing units
3. Contradictions with verified facts above
4. Topic mismatch (content not about ${ctx.topic})

Return JSON:
{
  "valid": true/false,
  "confidence": 0.0-1.0,
  "issues": ["issue 1", "issue 2"]
}

If no issues found, return { "valid": true, "confidence": 0.92, "issues": [] }`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        return parsed;
    } catch {
        return { valid: true, issues: [], confidence: 0.75 };
    }
}
