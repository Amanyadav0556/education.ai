const User = require('../models/User');
const LearningTwin = require('../models/LearningTwin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'acecoach_super_secret_dev_key';

exports.signup = async (req, res) => {
    try {
        const { name, email, password, educationLevel, targetExam, mainGoal } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name, email, password: hashedPassword, educationLevel, targetExam, mainGoal
        });
        await user.save();

        // Create Learning Twin profile simultaneously
        const twin = new LearningTwin({ userId: user._id });
        await twin.save();

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, name, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching profile' });
    }
};
