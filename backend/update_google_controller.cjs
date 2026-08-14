const fs = require('fs');
let file = 'src/controllers/authController.js';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('OAuth2Client')) {
    c = "const { OAuth2Client } = require('google-auth-library');\n" + c;
}

if (!c.includes('googleLogin')) {
    c += `
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
`;
}

fs.writeFileSync(file, c);
