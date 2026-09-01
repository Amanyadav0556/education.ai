// ════════════════════════════════════════════════════════════════════════════
// API ROUTE: POST /api/ai/topic-lesson
// All AI calls go through this server-side route — keys never exposed to client
// ════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { runLessonPipeline } from '@/lib/ai/pipeline';
import { TopicContext, UserLevel } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { subject, subjectId, chapter, topic, userLevel } = body;

        if (!subject || !chapter || !topic) {
            return NextResponse.json(
                { error: 'subject, chapter, and topic are required' },
                { status: 400 }
            );
        }

        const ctx: TopicContext = {
            subject: String(subject),
            subjectId: String(subjectId ?? subject).toLowerCase().replace(/\s+/g, '-'),
            chapter: String(chapter),
            topic: String(topic),
            userLevel: (['beginner', 'intermediate', 'advanced'].includes(userLevel)
                ? userLevel
                : 'beginner') as UserLevel,
        };

        const result = await runLessonPipeline(ctx);

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
            },
        });
    } catch (err) {
        console.error('[API/topic-lesson] Error:', err);
        return NextResponse.json(
            { error: 'Failed to generate lesson. Please try again.' },
            { status: 500 }
        );
    }
}
