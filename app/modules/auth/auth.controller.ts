import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../utils/apiResponse.utils';
import Logger from '../../utils/logger.utils';
import authService from './auth.service';

class AuthController {
	public async registerHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] register user request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			await authService.register(req.body);

			// Send structured API response
			return res
				.status(StatusCodes.CREATED)
				.json(
					new ApiResponse(StatusCodes.CREATED, 'Registration successful, OTP sent to your email'),
				);
		} catch (error) {
			Logger.warn('[AuthController] register user request failed', error);
			next(error);
		}
	}
	public async verifyOTPHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] verify OTP request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			await authService.verifyOTP(req.body);

			// Send structured API response
			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'OTP verified successfully'));
		} catch (error) {
			Logger.warn('[AuthController] verify OTP request failed', error);
			next(error);
		}
	}
	public async resendOTPHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] resend OTP request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			await authService.resendOTP(req.body);

			// Send structured API response
			return res
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'OTP resent successfully'));
		} catch (error) {
			Logger.warn('[AuthController] resend OTP request failed', error);
			next(error);
		}
	}
}

export default new AuthController();
