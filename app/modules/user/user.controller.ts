import type { Request, Response, NextFunction } from 'express';
import Logger from '../../utils/logger.utils';
import userService from './user.service';
import ApiResponse from '../../utils/apiResponse.utils';
import { StatusCodes } from 'http-status-codes';

class UserController {
	async fetchProfileHandler(req: Request, res: Response, next: NextFunction) {
		try {
			const { sub } = req.user!;

			Logger.info(`[UserController] Get profile request for id: ${sub}`);

			// Delegate core logic to service layer
			const user = await userService.profile(sub);

			// Clear cookies and Send structured API response
			return res.status(StatusCodes.OK).json(
				new ApiResponse(StatusCodes.OK, 'Profile fetched successfully', {
					_id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					createdAt: user.createdAt,
				}),
			);
		} catch (error) {
			Logger.warn('[UserController] Get profile request failed', error);
			next(error);
		}
	}
}

export default new UserController();
