import morgan, { StreamOptions } from 'morgan';
import Logger from '../utils/logger.utils.js';
import envConfig from './env.config.js';

const stream: StreamOptions = {
	write: (message) => Logger.http(message),
};

const skip = () => {
	const env = envConfig.SERVER.NODE_ENV || 'development';
	return env !== 'development';
};

const morganConfig = morgan(':method :url :status :res[content-length] - :response-time ms', {
	stream,
	skip,
});

export default morganConfig;
