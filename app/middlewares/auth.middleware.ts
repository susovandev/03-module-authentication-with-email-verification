import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../utils/apiErrors.utils';
import envConfig from '../config/env.config';
import { IUserJwtPayload } from '../modules/auth/auth.types';
import Logger from '../utils/logger.utils';

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	const accessToken =
		req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1] || req.body?.accessToken;
	if (!accessToken) {
		throw new UnauthorizedException(`Access token was invalid or missing.`);
	}
	try {
		const decodedToken = jwt.verify(
			accessToken,
			envConfig.JWT.ACCESS_TOKEN_SECRET_KEY!,
		) as IUserJwtPayload;

		if (!decodedToken) {
			throw new UnauthorizedException('Invalid access token');
		}

		req.user = decodedToken;
		next();
	} catch (error) {
		Logger.error(`[AuthMiddleware] JWT verification failed: ${JSON.stringify(error)}`);
		if (error instanceof jwt.TokenExpiredError) {
			return next(new UnauthorizedException('Access token expired'));
		}
		if (error instanceof jwt.JsonWebTokenError) {
			return next(new UnauthorizedException('Invalid access token'));
		}
		next(error);
	}
};

export default authMiddleware;
