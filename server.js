import express from 'express';
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

// Async startup function
const startServer = async () => {
    // Connect to database first
    await connectDB();
    
    // Auto-seed if database is empty
    await autoSeed();
    
    const app = express();

    // Middleware
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
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Static files for uploads
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

    // Health check
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'World Trip API is running! 🚀' });
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

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ success: false, message: 'المسار غير موجود' });
    });

    const PORT = process.env.PORT || 5000;

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
};

// Start the server
startServer().catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
