import { Router } from 'express';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validation.middleware';
import {
	forgetPasswordValidationSchema,
	loginValidationSchema,
	registerValidationSchema,
	resendEmailValidationSchema,
	resetPasswordValidationSchema,
	verifyOTPValidationSchema,
} from './auth.validation';
import authMiddleware from '../../middlewares/auth.middleware';

const router: Router = Router();

router
	.route('/register')
	.post(validateRequest(registerValidationSchema), authController.registerHandler);

router
	.route('/verify-otp')
	.post(validateRequest(verifyOTPValidationSchema), authController.verifyOTPHandler);

router
	.route('/resend-otp')
	.post(validateRequest(resendEmailValidationSchema), authController.resendOTPHandler);

router.route('/login').post(validateRequest(loginValidationSchema), authController.loginHandler);

router
	.route('/forget-password')
	.post(validateRequest(forgetPasswordValidationSchema), authController.forgetPasswordHandler);

router
	.route('/reset-password')
	.post(validateRequest(resetPasswordValidationSchema), authController.resetPasswordHandler);

router.route('/logout').post(authMiddleware, authController.logoutHandler);

export default router;
