import express from 'express';
import type { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Initialize express application
const app: Application = express();

// Morgan Middleware for logging
import morganConfig from './config/morgan.config';
app.use(morganConfig);

// Body-parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (_req: Request, res: Response) => {
	return res.status(StatusCodes.OK).json({
		statusCode: StatusCodes.OK,
		status: true,
		message: 'OK',
	});
});

// 404 Middleware
import routeNotFoundHandler from './middlewares/404.middleware';
app.use(routeNotFoundHandler);

// Error Middleware
import globalErrorHandler from './middlewares/error.middleware';
app.use(globalErrorHandler);
export default app;
