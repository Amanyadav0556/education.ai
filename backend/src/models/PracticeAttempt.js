const mongoose = require('mongoose');

const PracticeAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: String },
    isCorrect: { type: Boolean, required: true },
    timeTakenSeconds: { type: Number },
    hintUsed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PracticeAttempt', PracticeAttemptSchema);
