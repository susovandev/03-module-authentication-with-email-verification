import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from 'joi';

const formatJoiError = (error: ValidationError) => {
	return error.details.map((d) => ({
		field: d.path.join('.'),
		message: d.message.replace(/['"]/g, ''),
	}));
};

const validateRequest =
	(schema: ObjectSchema, property: 'body' | 'query' | 'params' = 'body') =>
	(req: Request, res: Response, next: NextFunction): void => {
		const { error } = schema.validate(req[property], { abortEarly: false });

		if (error) {
			res.status(StatusCodes.BAD_REQUEST).json({
				statusCode: StatusCodes.BAD_REQUEST,
				success: false,
				message: 'Validation error',
				errors: formatJoiError(error),
			});
			return;
		}
		next();
	};

export default validateRequest;
