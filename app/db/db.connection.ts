import mongoose from 'mongoose';
import envConfig from '../config/env.config';
const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(envConfig.DB.URI);
		console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		throw error;
	}
};

export default connectDB;
