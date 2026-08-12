const PracticeAttempt = require('../models/PracticeAttempt');
const Question = require('../models/Question');
const LearningTwin = require('../models/LearningTwin');
const Progress = require('../models/Progress');

exports.getQuestions = async (req, res) => {
    try {
        const { topic, difficulty, limit = 10 } = req.query;
        const query = {};
        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;

        const questions = await Question.find(query).limit(Number(limit));
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch practice questions' });
    }
};

exports.submitAttempt = async (req, res) => {
    try {
        const { questionId, selectedAnswer, timeTakenSeconds, hintUsed } = req.body;
        const userId = req.user.id; // from auth middleware

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const isCorrect = question.correctAnswer === selectedAnswer;

        // Record the attempt
        const attempt = new PracticeAttempt({
            userId,
            questionId,
            selectedAnswer,
            isCorrect,
            timeTakenSeconds,
            hintUsed
        });
        await attempt.save();

        // Update Progress Data
        const today = new Date().toISOString().split('T')[0];
        let progress = await Progress.findOne({ userId, date: today });
        if (!progress) {
            progress = new Progress({ userId, date: today });
        }
        progress.questionsAttempted += 1;
        if (isCorrect) progress.questionsCorrect += 1;
        progress.studyTimeMinutes += (timeTakenSeconds / 60);
        await progress.save();

        res.json({
            success: true,
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation
        });

    } catch (error) {
        console.error('Submit attempt error:', error);
        res.status(500).json({ error: 'Failed to submit practice attempt' });
    }
};
