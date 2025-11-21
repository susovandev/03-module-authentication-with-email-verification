import userModel from '../user/user.model';
import Logger from '../../utils/logger.utils';
import { ILoginDTO, IRegisterUserDTO, IResendOtpDTO, IVerifyOtpDTO } from './auth.types';
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
import signAccessTokenAndRefreshToken from '../../utils/token.utils';

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
	}
	async resendOTP(resendOtpDTO: IResendOtpDTO) {
		/**
		 * Get email from request body
		 * Check if user already exists
		 * Check if user account already verified
		 * Generate otp
		 * Save it
		 * Send New mail
		 */

		const { email } = resendOtpDTO;
		Logger.info(`[AuthService] resend OTP request received with email: ${email}`);

		// Check if user already exists
		const user = await userModel.findOne({ email }).select('+password');
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
	}
	async login(loginDTO: ILoginDTO) {
		/**
		 * Get email and password from request body
		 * Check if user already exists
		 * Check user account already verified
		 * Check user password correct
		 * Generate accessToken and RefreshToken
		 */
		const { email, password } = loginDTO;
		Logger.info(`[AuthService] Login user request received with email: ${email}`);

		// Check if user already exists
		const user = await userModel.findOne({ email }).select('+password');
		if (!user) {
			throw new NotFoundException('Email not registered');
		}
		// Check if user is already verified
		if (!user.isEmailVerified) {
			throw new ConflictException('Email not verified yet');
		}

		// Check user password
		const isPasswordCorrect = await user.comparePassword(password);
		if (!isPasswordCorrect) {
			throw new ConflictException('Invalid Credentials');
		}

		// Generate access and Refresh Token
		const { accessToken, refreshToken } = signAccessTokenAndRefreshToken({
			sub: user._id.toString(),
			role: user.role,
			email: user.email,
		});

		user.refreshToken = refreshToken;
		await user.save();

		return { accessToken, refreshToken };
	}
}

export default new AuthService();
