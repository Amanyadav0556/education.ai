const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const LearningTwin = require('../models/LearningTwin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'acecoach_super_secret_dev_key';

exports.signup = async (req, res) => {
    try {
        const { name, email, password, educationLevel, targetExam, mainGoal } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must contain at least 8 characters.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name, email: email.toLowerCase(), password: hashedPassword, educationLevel, targetExam, mainGoal
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

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect email or password.' });
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

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
            return res.status(500).json({ error: 'OAuth setup missing: SERVER MISSING GOOGLE_CLIENT_ID. Please add GOOGLE_CLIENT_ID to backend and frontend .env files.' });
        }
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        
        let user = await User.findOne({ email: payload.email.toLowerCase() });
        if (!user) {
            user = new User({ 
                name: payload.name || 'Google User', 
                email: payload.email.toLowerCase(), 
                password: await bcrypt.hash(Date.now().toString() + Math.random().toString(), 10), 
                educationLevel: 'High School', 
                targetExam: 'SAT' 
            });
            await user.save();
            const twin = new LearningTwin({ userId: user._id });
            await twin.save();
        }
        
        const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, profilePic: payload.picture } });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ error: 'Google authentication failed. Token may be invalid or expired.' });
    }
};
