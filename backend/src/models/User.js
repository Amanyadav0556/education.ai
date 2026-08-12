const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    educationLevel: { type: String, default: 'High School' },
    targetExam: { type: String, default: 'SAT' },
    mainGoal: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
