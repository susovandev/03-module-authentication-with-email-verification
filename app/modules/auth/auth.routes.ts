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

export default router;
