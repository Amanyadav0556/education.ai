require('dotenv').config({ path: ['./.env', '../.env'] });
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
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);
app.use('/api/chat', chatRoutes);

const startDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acecoach';
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('✅ MongoDB Connected (Local/Cloud)');
    } catch (err) {
        console.log('⚠️ Local MongoDB Connection Failed. Booting In-Memory Database for development...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            await mongoose.connect(memoryUri);
            console.log(`✅ In-Memory MongoDB Connected: ${memoryUri}`);
        } catch (memErr) {
            console.error('❌ FATAL: Could not boot In-Memory Database.', memErr);
        }
    }
};
startDB();

const path = require('path');

// Serve React App in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

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
