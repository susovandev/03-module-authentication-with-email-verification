import userModel from '../user/user.model';
import Logger from '../../utils/logger.utils';
import { IRegisterUserDTO } from './auth.types';
import { ConflictException, InternalServerException } from '../../utils/apiErrors.utils';
import signOTP from '../../utils/otp.utils';
import sendEmail from '../../mail/sendEmail.utils';
import { registerUserMailTemplate } from '../../mail/templates/auth/registerMail.template';

class AuthService {
	async register(userData: IRegisterUserDTO) {
		/**
		 * 1. Get name, email, password from request body
		 * 2. Check if user already exists
		 * 3. Generate OTP with expiry of 1 minute
		 * 4. Create user with otp and otp expiry
		 * 5. Create mail template
		 * 6. Send mail
		 */
		try {
			Logger.info(`[AuthService] register user request received with email: ${userData.email}`);

			const { name, email, password } = userData;

			// Check if user already exists
			const ifUserExists = await userModel.findOne({ email: userData.email });
			if (ifUserExists) {
				throw new ConflictException('Email already registered');
			}

			// Generate OTP
			const { otp, otpExpiry } = signOTP();

			// Create user
			const user = await userModel.create({
				name,
				email,
				password,
				otp,
				otpExpiry,
			});
			if (!user) {
				throw new InternalServerException('User registration failed');
			}

			// Send OTP to user's email
			const otpHtmlTemplate = registerUserMailTemplate(name, otp);
			await sendEmail(email, 'Email verification OTP', otpHtmlTemplate);
			return;
		} catch (error) {
			Logger.warn('[AuthService] register user request failed', error);
			throw error;
		}
	}
}

export default new AuthService();
