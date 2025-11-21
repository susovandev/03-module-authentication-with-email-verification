import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authService from './auth.service';
import cookieConfigOptions from '../../config/cookie.config';
import envConfig from '../../config/env.config';
import ms from 'ms';
import { IResetPasswordDTO } from './auth.types';
import { sendResponse } from '../../utils/sendResponse.utils';
import { logRequest } from '../../utils/logRequest.utils';
import { asyncHandler } from '../../utils/asyncHandler.utils';

class AuthController {
	public registerHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Register', req.body);

		// Delegate core logic to service layer
		await authService.register(req.body);

		return sendResponse(
			res,
			StatusCodes.CREATED,
			'Registration successful, OTP sent to your email',
		);
	});

	public verifyOTPHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Verify OTP', req.body);

		// Delegate core logic to service layer
		await authService.verifyOTP(req.body);

		return sendResponse(res, StatusCodes.OK, 'OTP verified successfully.');
	});

	public resendOTPHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Resend OTP', req.body);

		// Delegate core logic to service layer
		await authService.resendOTP(req.body);

		return sendResponse(res, StatusCodes.OK, 'OTP resent successfully.');
	});

	public loginHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Login', req.body);

		// Delegate core logic to service layer
		const { accessToken, refreshToken } = await authService.login(req.body);

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
			);
		return sendResponse(res, StatusCodes.OK, 'Logged in successfully.');
	});

	public forgetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Forget Password', req.body);

		// Delegate core logic to service layer
		await authService.forgetPassword(req.body);

		return sendResponse(res, StatusCodes.OK, 'Forget password email sent successfully.');
	});

	public resetPasswordHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Reset Password', { ...req.body, ...req.query });
		const request = {
			resetPasswordToken: req.query.resetPasswordToken,
			newPassword: req.body.newPassword,
			confirmPassword: req.body.confirmPassword,
		};
		// Delegate core logic to service layer
		await authService.resetPassword(request as IResetPasswordDTO);

		return sendResponse(res, StatusCodes.OK, 'Password reset successfully.');
	});

	public logoutHandler = asyncHandler(async (req: Request, res: Response) => {
		logRequest('AuthController', 'Logout', req.user?.sub);
		const { sub } = req.user!;

		// Delegate core logic to service layer
		await authService.logout(sub);

		res
			.clearCookie('accessToken', cookieConfigOptions())
			.clearCookie('refreshToken', cookieConfigOptions());
		return sendResponse(res, StatusCodes.OK, 'Logout successfully.');
	});
}

export default new AuthController();
