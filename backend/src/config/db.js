import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error('❌ MONGODB_URI not set in .env');
}

async function connectDB() {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
}

export default connectDB;
