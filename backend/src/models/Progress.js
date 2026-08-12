const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    studyTimeMinutes: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);
