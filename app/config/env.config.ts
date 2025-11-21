import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const _config = {
	SERVER: {
		PORT: process.env.PORT ?? 4000,
		NODE_ENV: process.env.NODE_ENV,
	},
	DB: {
		URI: process.env.DATABASE_URI as string,
	},
	MAIL: {
		SERVICE: process.env.MAIL_SERVICE as string,
		USER: process.env.MAIL_USERNAME as string,
		PASSWORD: process.env.MAIL_PASSWORD as string,
	},
	JWT: {
		ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
		ACCESS_TOKEN_MAX_AGE: process.env.ACCESS_TOKEN_MAX_AGE,
		REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
		REFRESH_TOKEN_MAX_AGE: process.env.REFRESH_TOKEN_MAX_AGE,
	},
	CLIENT: {
		URL: process.env.CLIENT_URL,
	},
};

const envConfig = Object.freeze(_config);

export default envConfig;
