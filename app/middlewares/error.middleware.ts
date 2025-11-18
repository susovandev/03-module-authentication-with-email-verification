import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/apiErrors.utils.js';
import Logger from '../utils/logger.utils.js';
import envConfig from '../config/env.config.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	Logger.warn('Global Error Middleware Executed');

	if (err instanceof ApiError) {
		res.status(err.statusCode).json({
			status: err.status,
			statusCode: err.statusCode,
			message: err.message,
			...(envConfig.SERVER.NODE_ENV === 'development' && { stack: err.stack }),
		});
	}

	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		status: false,
		statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
		message: 'Internal server error',
		...(envConfig.SERVER.NODE_ENV === 'development' && { stack: err }),
	});
};

export default globalErrorHandler;
