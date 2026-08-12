const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { messages } = req.body;

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-xxxxxx')) {
            // Extract the user's latest query
            const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

            let simulatedReply = "";

            if (lastMessage.includes('plan') || lastMessage.includes('prepration') || lastMessage.includes('preparation') || lastMessage.includes('schedule')) {
                simulatedReply = "### Your 30-Day Accelerated SAT Study Plan 🚀\n\nI've analyzed your target score and mapped out a custom progression roadmap for you:\n\n**Weeks 1-2: Core Foundation & Weakness Targeting**\n- **Math**: Focus on *Advanced Algebra* & *Trigonometry* (Your mock exam data shows a 45% accuracy here).\n- **Reading**: Master *Command of Evidence* questions.\n- *Goal*: 30 mins of targeted drills every weekday.\n\n**Week 3: Speed & Strategy**\n- Implement the Pomodoro technique (available in your **Study Plan** tab) to train your pacing.\n- Complete 2 Full-length practice exams.\n\n**Week 4: Final Polish**\n- Review only missed questions.\n- Light vocabulary reviews.\n\nWould you like me to automatically inject this schedule into your daily calendar?";
            } else if (lastMessage.includes('math') || lastMessage.includes('solve') || lastMessage.includes('algebra')) {
                simulatedReply = "Absolutely! Let's break down that math concept. \n\nWhen dealing with **Quadratics**, the most important formula to remember is the Vertex Form: `y = a(x-h)² + k`.\n- `(h, k)` represents the exact vertex of the parabola.\n- If `a` is positive, it opens upwards!\n\nWant to try a quick practice problem on this?";
            } else if (lastMessage.includes('hi') || lastMessage.includes('hello')) {
                simulatedReply = "Hello there! I am AceCoach AI. I'm currently running in local Simulation Mode, but I'm fully equipped to help you prep! \n\nWe can go over a custom study plan, review some advanced math formulas, or dissect your recent mock exam scores. What are we tackling today?";
            } else {
                simulatedReply = `*(Simulation Mode)* That is a great question!\n\nBased on your query regarding **"${lastMessage.substring(0, 30)}..."**, I recommend checking out the **Free Resources** tab. I've automatically generated comprehensive AI Notes that cover this exact topic in deep detail.\n\nIf you want to dive deeper, just ask me to generate a specific practice drill!`;
            }

            return res.json({
                success: true,
                reply: simulatedReply
            });
        }

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // System prompt to act as an EdTech tutor
        const systemMessage = {
            role: 'system',
            content: 'You are AceCoach AI, an elite educational tutor and mentor. Your goal is to guide the student, explain concepts simply, and use the Socratic method when applicable to help them learn.'
        };

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [systemMessage, ...messages],
            temperature: 0.7,
        });

        res.json({ success: true, reply: response.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI Error:", error.message);
        res.status(500).json({ success: false, error: 'OpenAI Engine Error: ' + (error.message || 'Unknown failure') });
    }
});

module.exports = router;
