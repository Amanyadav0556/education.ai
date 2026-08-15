if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: ['./.env', '../.env'] });
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const coreRoutes = require('./src/routes/apiRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

const app = express();

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null,
            'https://education-ai-hazel.vercel.app',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000'
        ].filter(Boolean);

        // Allow requests with no origin (like mobile apps, postman, or curl) or if origin is in the allowed list
        if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);
app.use('/api/chat', chatRoutes);

const startDB = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/acecoach';
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('✅ MongoDB Connected (Local/Cloud)');
    } catch (err) {
        console.error('⚠️ MongoDB Connection Failed:', err.message);
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ FATAL: Cannot fallback to in-memory database in production.');
            process.exit(1);
        }
        console.log('Booting In-Memory Database for development...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            await mongoose.connect(memoryUri);
            console.log(`✅ In-Memory MongoDB Connected: ${memoryUri}`);
        } catch (memErr) {
            console.error('❌ FATAL: Could not boot In-Memory Database.', memErr);
            process.exit(1);
        }
    }
};
startDB();

// Health-check endpoint for Railway/Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const path = require('path');

// Serve React App only if frontend/dist exists (prevent crashes in isolated backend deployments)
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.use((req, res, next) => {
        if (req.method !== 'GET') return next();
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
}

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('🔥 Server Error Captured:', err.message || err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Prevent Node crashes from Unhandled Rejections / Exceptions
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend listening on port ${PORT}`);
});
