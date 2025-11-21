import { Response } from 'express';
import ApiResponse from './apiResponse.utils';

export const sendResponse = <T>(res: Response, code: number, message: string, data?: T) => {
	return res.status(code).json(new ApiResponse(code, message, data));
};
