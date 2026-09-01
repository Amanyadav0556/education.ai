// ════════════════════════════════════════════════════════════════════════════
// IN-MEMORY LESSON CACHE
// Cache key: subject:chapter:topic:level:version
// ════════════════════════════════════════════════════════════════════════════

import { TopicLesson } from './types';

interface CacheEntry {
    lesson: TopicLesson;
    createdAt: number;
    ttl: number; // ms
}

const cache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

export const lessonCache = {
    get(key: string): TopicLesson | null {
        const entry = cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.createdAt > entry.ttl) {
            cache.delete(key);
            return null;
        }
        return entry.lesson;
    },

    set(key: string, lesson: TopicLesson, ttl = DEFAULT_TTL): void {
        cache.set(key, { lesson, createdAt: Date.now(), ttl });
    },

    has(key: string): boolean {
        return this.get(key) !== null;
    },

    clear(): void {
        cache.clear();
    },

    size(): number {
        return cache.size;
    },
};
