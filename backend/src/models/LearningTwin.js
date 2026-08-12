const mongoose = require('mongoose');

const LearningTwinSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    strengths: [{ type: String }],
    weakTopics: [{ type: String }],

    topicMastery: {
        type: Map,
        of: Number, // Example: { "Arrays": 88, "Binary Search": 72 }
        default: {}
    },

    learningBehavior: {
        accuracy: { type: Number, default: 0 },
        averageSolvingTimeSeconds: { type: Number, default: 0 },
        hintDependency: { type: Number, default: 0 },
        consistencyScore: { type: Number, default: 0 }
    },

    aiRecommendations: [{ type: String }],
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('LearningTwin', LearningTwinSchema);
