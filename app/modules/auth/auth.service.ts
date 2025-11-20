import userModel from '../user/user.model';
import Logger from '../../utils/logger.utils';
import { IRegisterUserDTO, IVerifyOtpDTO } from './auth.types';
import {
	BadRequestException,
	ConflictException,
	InternalServerException,
	NotFoundException,
} from '../../utils/apiErrors.utils';
import signOTP from '../../utils/otp.utils';
import sendEmail from '../../mail/sendEmail.utils';
import { registerUserMailTemplate } from '../../mail/templates/auth/registerMail.template';
import { resendOtpMailTemplate } from '../../mail/templates/auth/resendMail.template';

class AuthService {
	async register(registerUserDTO: IRegisterUserDTO) {
		/**
		 * 1. Get name, email, password from request body
		 * 2. Check if user already exists
		 * 3. Generate OTP with expiry of 1 minute
		 * 4. Create user with otp and otp expiry
		 * 5. Create mail template
		 * 6. Send mail
		 */
		try {
			const { name, email, password } = registerUserDTO;
			Logger.info(`[AuthService] register user request received with email: ${email}`);

			// Check if user already exists
			const ifUserExists = await userModel.findOne({ email });
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
	async verifyOTP(verifyOtpDTO: IVerifyOtpDTO) {
		/**
		 * Get email and otp from request body
		 * Check if user already exists
		 * Check if OTP is valid
		 * Check if OTP is expired
		 * Set isEmailVerified to true
		 * Set otp and otpExpiry to null
		 */
		try {
			const { email, otp } = verifyOtpDTO;
			Logger.info(`[AuthService] verify OTP request received with email: ${email}`);

			// Check if user already exists
			const user = await userModel.findOne({ email });
			if (!user) {
				throw new NotFoundException('Email not registered');
			}

			// Check if user is already verified
			if (user.isEmailVerified) {
				throw new ConflictException('Email already verified');
			}

			// Check if OTP is valid
			if (user.otp !== otp) {
				throw new BadRequestException('Invalid OTP');
			}

			// Check if OTP is expired
			if (user.otpExpiry && user.otpExpiry < new Date()) {
				throw new BadRequestException('OTP expired');
			}

			// Update user
			user.isEmailVerified = true;
			user.otp = undefined;
			user.otpExpiry = undefined;
			await user.save();

			return;
		} catch (error) {
			Logger.warn('[AuthService] register user request failed', error);
			throw error;
		}
	}
	async resendOTP({ email }: { email: string }) {
		/**
		 * Get email from request body
		 * Check if user already exists
		 * Check if user account already verified
		 * Generate otp
		 * Save it
		 * Send New mail
		 */
		try {
			Logger.info(`[AuthService] resend OTP request received with email: ${email}`);

			// Check if user already exists
			const user = await userModel.findOne({ email });
			if (!user) {
				throw new NotFoundException('Email not registered');
			}

			// Check if user is already verified
			if (user.isEmailVerified) {
				throw new ConflictException('Email already verified');
			}

			// Generate OTP
			const { otp, otpExpiry } = signOTP();

			// Update user
			user.otp = otp;
			user.otpExpiry = otpExpiry;
			await user.save();

			// Send OTP to user's email
			const resendOtpHtmlTemplate = resendOtpMailTemplate(user.name, otp);
			await sendEmail(email, 'Email verification OTP', resendOtpHtmlTemplate);
			return;
		} catch (error) {
			Logger.warn('[AuthService] resend OTP request failed', error);
			throw error;
		}
	}
}

export default new AuthService();
