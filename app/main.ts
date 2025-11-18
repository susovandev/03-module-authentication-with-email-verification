import app from './app';
import envConfig from './config/env.config';
import connectDB from './db/db.connection';

const env = envConfig.SERVER.NODE_ENV;
const port = envConfig.SERVER.PORT;

connectDB()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server running in ${env} mode on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1);
	});
