import { Router } from 'express';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validation.middleware';
import {
	registerUserValidationSchema,
	resendOTPValidationSchema,
	verifyOTPValidationSchema,
} from './auth.validation';

const router = Router();

router
	.route('/register')
	.post(validateRequest(registerUserValidationSchema), authController.registerHandler);

router
	.route('/verify-otp')
	.post(validateRequest(verifyOTPValidationSchema), authController.verifyOTPHandler);

router
	.route('/resend-otp')
	.post(validateRequest(resendOTPValidationSchema), authController.resendOTPHandler);
export default router;
