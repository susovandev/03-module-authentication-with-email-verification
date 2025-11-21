import ms, { StringValue } from 'ms';
import { CookieOptions } from 'express';
import envConfig from './env.config';

const cookieConfigOptions = (maxAge?: StringValue): CookieOptions => {
	const baseOptions: CookieOptions = {
		httpOnly: true,
		secure: envConfig.SERVER.NODE_ENV === 'production',
		sameSite: envConfig.SERVER.NODE_ENV === 'production' ? 'none' : 'lax',
	};

	if (maxAge) {
		baseOptions.maxAge = ms(maxAge) as number;
	}

	return baseOptions;
};

export default cookieConfigOptions;
