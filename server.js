import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { autoSeed } from './seed/autoSeed.js';

// Route imports
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import destinationsRoutes from './routes/destinations.js';
import packagesRoutes from './routes/packages.js';
import bookingsRoutes from './routes/bookings.js';
import messagesRoutes from './routes/messages.js';
import contentRoutes from './routes/content.js';
import settingsRoutes from './routes/settings.js';
import reportsRoutes from './routes/reports.js';
import uploadRoutes from './routes/upload.js';

// Load env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize cached connection and auto-seed
connectDB().then(() => autoSeed());

const app = express();

// Middleware to ensure DB connection (Critical for Serverless Cold Starts)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed in middleware:', error);
        next(error);
    }
});

// CORS Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'http://127.0.0.1:5173', 
        'http://localhost:8080', 
        'http://127.0.0.1:8080',
        'https://travelbarmagly.vercel.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads (Note: Vercel doesn't persist these!)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check (Simple)
app.get('/api/health', async (req, res) => {
    try {
        const status = mongoose.connection ? mongoose.connection.readyState : 0;
        const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
        
        // Count documents to verify data presence
        const counts = {
            users: await mongoose.model('User').countDocuments().catch(() => -1),
            destinations: await mongoose.model('Destination').countDocuments().catch(() => -1),
            packages: await mongoose.model('Package').countDocuments().catch(() => -1)
        };
        
        res.json({ 
            status: 'ok', 
            message: 'World Trip API is running! 🚀',
            dbState: states[status] || 'unknown',
            counts,
            envCheck: {
                hasMongoURI: !!process.env.MONGODB_URI,
                nodeEnv: process.env.NODE_ENV,
                hasJwtSecret: !!process.env.JWT_SECRET
            }
        });
    } catch (err) {
        res.json({ status: 'error', message: 'API running but health check failed', error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Root route for Vercel
app.get('/', (req, res) => {
    res.send('World Trip API is running');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'المسار غير موجود' });
});

const PORT = process.env.PORT || 5000;

// Only listen if not on Vercel (Vercel exports the app)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🌍 World Trip API Server                    ║
║                                               ║
║   Server running on port ${PORT}                 ║
║   http://localhost:${PORT}                       ║
║                                               ║
╚═══════════════════════════════════════════════╝
        `);
    });
}

export default app;
