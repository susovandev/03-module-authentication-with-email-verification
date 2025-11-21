import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config';
import Logger from './logger.utils';
import { IUserJwtPayload } from '../modules/auth/auth.types';
const signAccessTokenAndRefreshToken = (
	jwtPayload: IUserJwtPayload,
): { accessToken: string; refreshToken: string } => {
	const { sub, role, email } = jwtPayload;
	try {
		const accessToken = jwt.sign({ sub, role, email }, envConfig.JWT.ACCESS_TOKEN_SECRET_KEY!, {
			expiresIn: envConfig.JWT.ACCESS_TOKEN_MAX_AGE as jwt.SignOptions['expiresIn'],
		});

		const refreshToken = jwt.sign({ sub, role }, envConfig.JWT.REFRESH_TOKEN_SECRET_KEY!, {
			expiresIn: envConfig.JWT.REFRESH_TOKEN_MAX_AGE as jwt.SignOptions['expiresIn'],
		});

		return { accessToken, refreshToken };
	} catch (error) {
		Logger.warn(`Failed to sign access token and refresh token: ${error}`);
		throw error;
	}
};

export default signAccessTokenAndRefreshToken;
