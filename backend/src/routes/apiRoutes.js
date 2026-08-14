const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getQuestions, submitAttempt } = require('../controllers/practiceController');
const { getLearningTwin } = require('../controllers/twinController');

// All endpoints in this file use the auth middleware
router.use(authMiddleware);

// Practice Routes
router.get('/practice/questions', getQuestions);
router.post('/practice/submit', submitAttempt);

// Learning Twin Routes
router.get('/twin', getLearningTwin);
router.get('/twin/insights', require('../controllers/twinController').getInsights);
router.get('/twin/deep-analysis', require('../controllers/twinController').getDeepAnalysis);

module.exports = router;
