import app from './app';
import envConfig from './config/env.config';

const env = envConfig.SERVER.NODE_ENV;
const port = envConfig.SERVER.PORT;

app.listen(port, () => {
	console.log(`Server running in ${env} mode on http://localhost:${port}`);
});
