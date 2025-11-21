import type { Request, Response } from 'express';
import userService from './user.service';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../../utils/sendResponse.utils';
import { logRequest } from '../../utils/logRequest.utils';
import { asyncHandler } from '../../utils/asyncHandler.utils';

class UserController {
	fetchProfileHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('UserController', 'GET Profile', req.user?.sub);
		const { sub } = req.user!;

		// Delegate core logic to service layer
		const user = await userService.profile(sub);

		return sendResponse(res, StatusCodes.OK, 'Profile fetched successfully.', {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		});
	});
}

export default new UserController();
