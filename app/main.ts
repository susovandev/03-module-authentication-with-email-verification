import app from './app';
import envConfig from './config/env.config';
import connectDB from './db/db.connection';
import Logger from './utils/logger.utils';

const env = envConfig.SERVER.NODE_ENV;
const port = envConfig.SERVER.PORT;

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
	Logger.error('Unhandled Promise Rejection:', error);
	process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	Logger.error('Uncaught Exception:', error);
	process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
	Logger.warn('SIGTERM signal received. Shutting down gracefully...');
	process.exit(0);
});

// Graceful shutdown on SIGINT (CTRL + C)
process.on('SIGINT', () => {
	Logger.warn('SIGINT signal received (Ctrl + C). Shutting down...');
	process.exit(0);
});

// Log when process exits
process.on('exit', () => {
	Logger.info('Process exited.');
});

connectDB()
	.then(() => {
		app.listen(port, () => {
			Logger.info(`Server running in ${env} mode on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		Logger.error('Error connecting to MongoDB:', error);
		process.exit(1);
	});
