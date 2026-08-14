const fs = require('fs');

const code = `
exports.getDeepAnalysis = async (req, res) => {
    try {
        const PracticeAttempt = require('../models/PracticeAttempt');
        const attempts = await PracticeAttempt.find({ userId: req.user.id })
            .populate('questionId')
            .sort({ createdAt: -1 });

        if (!attempts || attempts.length < 5) {
            return res.json({ hasData: false, message: "Not enough data yet. Complete more practice sessions to unlock deeper analysis." });
        }

        // --- Overall Base Stats ---
        let totalTime = 0, totalCorrect = 0, totalHints = 0, fastIncorrect = 0, slowIncorrect = 0;
        let difficultyStats = { Easy: { acc: 0, t: 0, c: 0 }, Medium: { acc: 0, t: 0, c: 0 }, Hard: { acc: 0, t: 0, c: 0 } };
        let topicMap = {};

        attempts.forEach(a => {
            if (!a.questionId) return;
            totalTime += a.timeTakenSeconds || 0;
            if (a.isCorrect) totalCorrect++;
            if (a.hintUsed) totalHints++;
            
            const diff = a.questionId.difficulty || 'Medium';
            if (difficultyStats[diff]) {
                difficultyStats[diff].t++;
                if (a.isCorrect) difficultyStats[diff].c++;
            }

            const t = a.questionId.topic;
            if (!topicMap[t]) topicMap[t] = { t: 0, c: 0, fails: 0, time: 0, name: t, diff: diff };
            topicMap[t].t++;
            topicMap[t].time += (a.timeTakenSeconds || 0);
            if (a.isCorrect) topicMap[t].c++;
            else {
                topicMap[t].fails++;
                if ((a.timeTakenSeconds || 0) < 15) fastIncorrect++;
                if ((a.timeTakenSeconds || 0) > 60) slowIncorrect++;
            }
        });

        const overallAccuracy = Math.round((totalCorrect / attempts.length) * 100);

        // --- Strong & Weak Topics ---
        let topicsArr = Object.values(topicMap).map(t => ({
            ...t,
            accuracy: Math.round((t.c / t.t) * 100),
            avgTime: Math.round(t.time / (t.t || 1))
        }));

        let strongTopics = topicsArr.filter(t => t.accuracy >= 75).sort((a, b) => b.accuracy - a.accuracy);
        let weakTopics = topicsArr.filter(t => t.accuracy < 75).sort((a, b) => a.accuracy - b.accuracy);

        // --- Pattern Analysis & Logic Building ---
        let logicGuidance = [];
        let mistakePatterns = [];

        if (fastIncorrect > attempts.length * 0.15) {
            mistakePatterns.push("Rushing through problem interpretation");
            logicGuidance.push({ issue: "Rushing / Careless Reading", advise: "Before selecting an answer or coding, pause to ensure you fully comprehend the constraints. Don't rush simple 'Easy' difficulty problems." });
        }
        if (totalHints > attempts.length * 0.2) {
            mistakePatterns.push("High Hint Dependency");
            logicGuidance.push({ issue: "Algorithm Selection / Step-by-Step", advise: "You rely on hints frequently to get started. Before asking for a hint, write out the brute-force approach first to see if a pattern emerges naturally." });
        }
        if (slowIncorrect > attempts.length * 0.15) {
            mistakePatterns.push("Edge-case handling / Complexity struggles");
            logicGuidance.push({ issue: "Edge Cases & Implementation", advise: "Before submitting, manually trace your logic against: Empty input, single elements, or extreme maximum bounds. Your extended time points to implementation bugs." });
        }
        if (mistakePatterns.length === 0) {
            mistakePatterns.push("Minor execution errors");
            logicGuidance.push({ issue: "Minor execution slips", advise: "Your logic appears solid, but occasionally a small variable or condition boundary is slightly off. Keep a sharp eye on off-by-one bounds." });
        }

        // --- Action Plan ---
        let actionPlan = weakTopics.slice(0, 3).map((w, i) => {
            let priorityLevel = (w.accuracy < 45) ? "Priority 1" : (w.accuracy < 60 ? "Priority 2" : "Priority 3");
            return {
                priority: priorityLevel,
                topic: w.name,
                accuracy: w.accuracy,
                status: w.accuracy < 50 ? "Weak" : "Needs Improvement",
                recommendation: \`Focus on foundational logic for \${w.name} and solve \${w.accuracy < 50 ? '5 Easy + 2 Medium' : '3 Easy + 4 Medium'} problems.\`
            };
        });

        // Add strong recommendation
        if (strongTopics.length > 0) {
            actionPlan.push({
                priority: "Optimization",
                topic: strongTopics[0].name,
                accuracy: strongTopics[0].accuracy,
                status: "Strong",
                recommendation: "Move exclusively toward Medium/Hard problems and focus on optimizing time complexity."
            });
        }

        // Calculate diff stats safely
        Object.keys(difficultyStats).forEach(d => {
            difficultyStats[d].accuracy = difficultyStats[d].t > 0 ? Math.round((difficultyStats[d].c / difficultyStats[d].t) * 100) : 0;
        });

        // Generate AI string
        let strongNames = strongTopics.length > 0 ? strongTopics.slice(0, 2).map(s => s.name).join(' and ') : 'various topics';
        let weakNames = weakTopics.length > 0 ? weakTopics.slice(0, 2).map(w => w.name).join(' and ') : 'optimization concepts';
        let aiSummaryString = \`You are strong in \${strongNames}, but your performance drops significantly in \${weakNames}. Your main pattern shows struggles with \${mistakePatterns[0].toLowerCase()}. Focus heavily on \${weakTopics.length > 0 ? weakTopics[0].name : 'optimizing calculations'} for the next 7 days.\`;

        res.json({
            hasData: true,
            overall: {
                accuracy: overallAccuracy,
                completionRate: Math.min(100, attempts.length * 2), // Example metric
                attempts: attempts.length
            },
            aiSummary: aiSummaryString,
            strongTopics: strongTopics.slice(0, 4),
            weakTopics: weakTopics.slice(0, 4),
            logicBuilding: logicGuidance,
            mistakePatterns: mistakePatterns,
            difficulties: difficultyStats,
            actionPlan: actionPlan
        });

    } catch (e) {
        console.error("Deep Analytics Engine Error:", e);
        res.status(500).json({ error: "Failed to generate deep analysis" });
    }
};
`;

const existing = fs.readFileSync('backend/src/controllers/twinController.js', 'utf8');
fs.writeFileSync('backend/src/controllers/twinController.js', existing + code);
