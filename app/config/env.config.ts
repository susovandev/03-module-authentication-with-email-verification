import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const _config = {
	SERVER: {
		PORT: process.env.PORT ?? 4000,
		NODE_ENV: process.env.NODE_ENV,
	},
};

const envConfig = Object.freeze(_config);

export default envConfig;
