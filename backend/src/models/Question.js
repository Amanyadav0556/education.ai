const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    content: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
