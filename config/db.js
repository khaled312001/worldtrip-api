import mongoose from 'mongoose';

// Cached connection for Serverless (Vercel)
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // 1. Check if MONGODB_URI is present in Production
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is missing in Vercel Environment Variables!');
            // Log error but don't crash process immediately, let requests fail gracefully
            return null;
        }
    }

    // 2. Return cached connection if available
    if (cached.conn) {
        return cached.conn;
    }

    // 3. Connect to MongoDB Atlas (Production) or Local (URI provided)
    if (process.env.MONGODB_URI) {
        if (!cached.promise) {
            const opts = {
                bufferCommands: true, // Allow Mongoose to buffer commands while connecting
            };

            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
                console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
                return mongoose;
            }).catch(err => {
                console.error('❌ MongoDB Connection Error:', err);
                throw err;
            });
        }
        
        try {
            cached.conn = await cached.promise;
        } catch (e) {
            cached.promise = null;
            throw e;
        }
        return cached.conn;
    }

    // 4. Fallback: MongoDB Memory Server (ONLY for local dev, NEVER in production)
    if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 Starting MongoDB Memory Server (Dev Mode)...');
        try {
            // Dynamic import to avoid bundling in production
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            
            if (!global.mongoServer) {
                global.mongoServer = await MongoMemoryServer.create();
            }
            
            const mongoUri = global.mongoServer.getUri();
            const conn = await mongoose.connect(mongoUri);
            console.log(`✅ MongoDB Memory Server Connected: ${conn.connection.host}`);
            return conn;
        } catch (err) {
            console.error('❌ Failed to start Memory Server:', err);
            // Fallback to local default if memory server fails
            const conn = await mongoose.connect('mongodb://127.0.0.1:27017/worldtrip');
            return conn;
        }
    }
};

export default connectDB;
