import express from 'express';
import type { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Initialize express application
const app: Application = express();

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

export default app;
