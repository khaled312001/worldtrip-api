import mongoose from 'mongoose';

// Simplified DB Connection for Vercel
const connectDB = async () => {
    try {
        // If already connected, reuse it
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        // If connecting, wait for it
        if (mongoose.connection.readyState === 2) {
            console.log('⏳ Waiting for existing connection...');
            return new Promise((resolve) => {
                mongoose.connection.once('open', () => resolve(mongoose.connection));
            });
        }

        // Force new connection
        console.log('🔌 Connecting to MongoDB...');
        
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is missing!');
            return null;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Fail fast if network issue
            socketTimeoutMS: 45000, // Keep socket open longer
            family: 4 // Force IPv4 (fixes some Vercel DNS issues)
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;

    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        // Don't throw, let the caller handle null
        return null;
    }
};

export default connectDB;
