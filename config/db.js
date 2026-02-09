import mongoose from 'mongoose';

let mongoServer;

const connectDB = async () => {
    try {
        // Use MongoDB Atlas or configured MongoDB URI if available
        if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb')) {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return;
        }

        // Fallback to MongoDB Memory Server for development only
        console.log('🔄 Starting MongoDB Memory Server (development mode)...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Memory Server Connected: ${conn.connection.host}`);
        console.log('⚠️  Note: Data will be lost when server stops (in-memory database)');
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

export const getMongoServer = () => mongoServer;

export default connectDB;
