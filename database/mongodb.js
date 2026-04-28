import mongoose from 'mongoose';
import {DB_URL} from "../config/env.js";

if (!DB_URL) {
    throw new Error('DB_URL is not defined');
}

const connectMongoDB = async () => {

    try {
        await mongoose.connect(DB_URL);
        console.log('MongoDB connected');

    }catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export default connectMongoDB;