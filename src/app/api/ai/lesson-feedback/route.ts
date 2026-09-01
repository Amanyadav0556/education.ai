import { NextRequest, NextResponse } from 'next/server';

// Simple feedback storage (in-memory for now — replace with DB later)
const feedbackStore: unknown[] = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { lessonId, helpful, detail } = body;
        if (!lessonId || typeof helpful !== 'boolean') {
            return NextResponse.json({ error: 'lessonId and helpful are required' }, { status: 400 });
        }
        feedbackStore.push({ lessonId, helpful, detail, timestamp: new Date().toISOString() });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
    }
}
