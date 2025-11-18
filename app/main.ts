import app from './app';
import envConfig from './config/env.config';
import connectDB from './db/db.connection';
import Logger from './utils/logger.utils';

const env = envConfig.SERVER.NODE_ENV;
const port = envConfig.SERVER.PORT;

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
