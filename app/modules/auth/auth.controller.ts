import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiResponse from '../../utils/apiResponse.utils';
import Logger from '../../utils/logger.utils';
import authService from './auth.service';
import cookieConfigOptions from '../../config/cookie.config';
import envConfig from '../../config/env.config';
import ms from 'ms';
import { IResetPasswordDTO } from './auth.types';

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
	public async loginHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] Login user request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			const { accessToken, refreshToken } = await authService.login(req.body);

			// Send access token and refresh token in cookie and structured API response
			res
				.cookie(
					'accessToken',
					accessToken,
					cookieConfigOptions(envConfig.JWT.ACCESS_TOKEN_MAX_AGE as ms.StringValue),
				)
				.cookie(
					'refreshToken',
					refreshToken,
					cookieConfigOptions(envConfig.JWT.REFRESH_TOKEN_MAX_AGE as ms.StringValue),
				)
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'Logged in successfully.'));
		} catch (error) {
			Logger.warn('[AuthController] Login user request failed', error);
			next(error);
		}
	}
	public async forgetPasswordHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] Forget password request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			await authService.forgetPassword(req.body);

			// Send access token and refresh token in cookie and structured API response
			res
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'Forget password email sent successfully.'));
		} catch (error) {
			Logger.warn('[AuthController] Forget password request failed', error);
			next(error);
		}
	}
	public async resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
		try {
			Logger.info(
				`[AuthController] Reset password request received with info: ${JSON.stringify(req.body)}`,
			);

			// Delegate core logic to service layer
			const request = {
				resetPasswordToken: req.query.resetPasswordToken,
				newPassword: req.body.newPassword,
				confirmPassword: req.body.confirmPassword,
			};
			await authService.resetPassword(request as IResetPasswordDTO);

			// Send access token and refresh token in cookie and structured API response
			res
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'Password reset successfully.'));
		} catch (error) {
			Logger.warn('[AuthController] Reset password request failed', error);
			next(error);
		}
	}
	async logoutHandler(req: Request, res: Response, next: NextFunction) {
		try {
			const { sub } = req.user!;

			Logger.info(`[AuthController] Logout request for id: ${sub}`);

			// Delegate core logic to service layer
			await authService.logout(sub);

			// Clear cookies and Send structured API response
			res
				.clearCookie('accessToken', cookieConfigOptions())
				.clearCookie('refreshToken', cookieConfigOptions())
				.status(StatusCodes.OK)
				.json(new ApiResponse(StatusCodes.OK, 'Logout successfully'));
			return;
		} catch (error) {
			Logger.warn('[AuthController] Logout request failed', error);
			next(error);
		}
	}
}

export default new AuthController();
