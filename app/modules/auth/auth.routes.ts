import { Router } from 'express';
import authController from './auth.controller';
import validateRequest from '../../middlewares/validation.middleware';
import { registerUserValidationSchema } from './auth.validation';

const router = Router();

router
	.route('/register')
	.post(validateRequest(registerUserValidationSchema), authController.registerHandler);
export default router;
