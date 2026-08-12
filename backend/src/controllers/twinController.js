const LearningTwin = require('../models/LearningTwin');
const PracticeAttempt = require('../models/PracticeAttempt');

exports.getLearningTwin = async (req, res) => {
    try {
        let twin = await LearningTwin.findOne({ userId: req.user.id });
        if (!twin) {
            twin = new LearningTwin({ userId: req.user.id });
            await twin.save();
        }
        res.json(twin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Learning Twin profile' });
    }
};

exports.updateLearningBehavior = async (req, res) => {
    try {
        // This endpoint could be triggered asynchronously by an AI microservice 
        // to adjust vector calculations for things like Fatigue Degradation.
        const twin = await LearningTwin.findOneAndUpdate(
            { userId: req.user.id },
            { $set: { "learningBehavior": req.body } },
            { new: true }
        );
        res.json(twin);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update behavioral vectors' });
    }
};
