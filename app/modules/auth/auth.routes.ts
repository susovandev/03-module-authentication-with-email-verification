import { Router } from 'express';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validation.middleware';
import { registerUserValidationSchema, verifyOTPValidationSchema } from './auth.validation';

const router = Router();

router
	.route('/register')
	.post(validateRequest(registerUserValidationSchema), authController.registerHandler);

router
	.route('/verify-otp')
	.post(validateRequest(verifyOTPValidationSchema), authController.verifyOTPHandler);
export default router;
