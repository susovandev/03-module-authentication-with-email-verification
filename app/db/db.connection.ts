import mongoose from 'mongoose';
import envConfig from '../config/env.config';
import Logger from '../utils/logger.utils';
const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(envConfig.DB.URI);
		Logger.info(`MongoDB connected: ${connectionInstance.connection.host}`);
	} catch (error) {
		Logger.error('Error connecting to MongoDB:', error);
		throw error;
	}
};

export default connectDB;
