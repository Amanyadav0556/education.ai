const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { messages } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
            let simulatedReply = "";

            if (lastMessage.match(/\b(math|solve|algebra|geometry|equation)\b/i)) {
                simulatedReply = "Let's break that Math concept down step-by-step. 📐\n\nFor most algebra problems on the Digital SAT, remember to check if you can plug the answers back in! \n\nIf you're dealing with **Quadratics**, the most important formula to remember is the Vertex Form: `y = a(x-h)² + k`.\n- `(h, k)` represents the exact vertex of the parabola.\n- If `a` is positive, it opens upwards.\n\nCould you paste the specific question you're struggling with so we can solve it together?";
            } else if (lastMessage.match(/\b(read|writing|grammar|english)\b/i)) {
                simulatedReply = "For SAT Evidence-Based Reading & Writing, one of the best strategies is to **read the question before the passage**! 📖\n\nFor grammar questions:\n1. Check for subject-verb agreement first.\n2. A semicolon `;` functions exactly like a period `.` — if the answers contain both for the same boundary, they are usually both wrong.\n\nWant to run through a quick grammar drill?";
            } else if (lastMessage.match(/\b(digital|format|test day)\b/i)) {
                simulatedReply = "### The Digital SAT Format 💻\n\nThe new Digital SAT is adaptive and shorter!\n- **Reading & Writing**: 2 modules (64 mins total).\n- **Math**: 2 modules (70 mins total). You CAN use the built-in Desmos calculator for the entire Math section.\n\nMake sure your testing device is fully charged and you have the Bluebook app installed. Is your test coming up soon?";
            } else if (lastMessage.match(/\b(score|analysis|progress)\b/i)) {
                simulatedReply = "Looking at your recent mock exams, your **Learning Score is currently in the Top 10%**! 🏆\n\nYou're doing exceptionally well in Geometry, but we need to bring up your Science Passages comprehension. If we spend 15 minutes a day exclusively on Science Passages, you could boost your overall score by another 40-50 points. Ready to start a drill?";
            } else if (lastMessage.match(/\b(hi|hello|hey)\b/i)) {
                simulatedReply = "Hello! 👋 I am AceCoach AI. I'm currently running in local Simulation Mode, but I'm fully equipped to help you prep! \n\nWe can go over a custom study plan, review some advanced math formulas, or dissect your recent mock exam scores. What are we tackling today?";
            } else if (lastMessage.includes('plan') || lastMessage.includes('schedule') || lastMessage.includes('routine')) {
                simulatedReply = "### Your 30-Day Accelerated SAT Study Plan 🚀\n\nI've analyzed your target score and mapped out a custom progression roadmap for you:\n\n**Weeks 1-2: Core Foundation & Weakness Targeting**\n- **Math**: Focus on *Advanced Algebra* & *Trigonometry* (Your mock exam data shows a 45% accuracy here).\n- **Reading**: Master *Command of Evidence* questions.\n- *Goal*: 30 mins of targeted drills every weekday.\n\n**Week 3: Speed & Strategy**\n- Implement the Pomodoro technique to train your pacing.\n- Complete 2 Full-length practice exams.\n\n**Week 4: Final Polish**\n- Review only missed questions.\n- Light vocabulary reviews.\n\nWould you like me to automatically inject this schedule into your daily calendar?";
            } else {
                // simple math evaluation fallback
                try {
                    let sanitizedMath = lastMessage.replace(/what is|sum of|sum|and|plus|add|minus|subtract|times|multiply|divided by|divide/gi, (m) => {
                        m = m.toLowerCase();
                        if (m === 'sum of' || m === 'sum' || m === 'plus' || m === 'and' || m === 'add') return '+';
                        if (m === 'minus' || m === 'subtract') return '-';
                        if (m === 'times' || m === 'multiply') return '*';
                        if (m === 'divided by' || m === 'divide') return '/';
                        if (m === 'what is') return '';
                        return m;
                    });
                    sanitizedMath = sanitizedMath.replace(/[^\d\+\-\*\/\.\(\)\s]/g, '').trim();
                    if (sanitizedMath && /[\+\-\*\/]/.test(sanitizedMath) && !/[a-zA-Z]/.test(sanitizedMath)) {
                        const answer = eval(sanitizedMath);
                        if (answer !== undefined && !isNaN(answer)) {
                            simulatedReply = `The answer is ${answer}.`;
                        }
                    }
                } catch (e) { }

                if (!simulatedReply) {
                    try {
                        const wikiTopic = lastMessage.replace(/tell me about|what is|how does|explain|who is/gi, '').trim();
                        if (wikiTopic.length > 2) {
                            const wikiSearch = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiTopic)}&utf8=&format=json`);
                            const searchData = await wikiSearch.json();
                            if (searchData.query.search.length > 0) {
                                const title = searchData.query.search[0].title;
                                const wikiExtract = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=3&exintro=1&explaintext=1&format=json&titles=${encodeURIComponent(title)}`);
                                const extractData = await wikiExtract.json();
                                const pages = extractData.query.pages;
                                const summary = pages[Object.keys(pages)[0]].extract;
                                if (summary && summary.length > 20) {
                                    simulatedReply = `Here's what I found about ${title}:\n\n${summary}`;
                                }
                            }
                        }
                    } catch (err) { }
                }

                if (!simulatedReply) {
                    simulatedReply = `I hear you! You're asking about: "${lastMessage.substring(0, 40)}..."\n\n*Note: To unlock the fully dynamic Gemini AI tutor, please grab a FREE API key from Google AI Studio and put it in backend/.env as GEMINI_API_KEY!*`;
                }
            }

            return res.json({ success: true, reply: simulatedReply });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are AceCoach AI, an elite educational tutor and mentor. Your goal is to guide the student, explain concepts simply, and use the Socratic method when applicable to help them learn."
        });

        // Convert exactly the previous OpenAI message format from frontend to Gemini format
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const lastUserMessage = messages[messages.length - 1]?.content || "...";

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastUserMessage);
        const responseText = result.response.text();

        res.json({ success: true, reply: responseText });

    } catch (error) {
        console.error("Gemini AI Error:", error.message);
        res.status(500).json({ success: false, error: 'Gemini Engine Error: ' + (error.message || 'Unknown failure') });
    }
});

module.exports = router;
