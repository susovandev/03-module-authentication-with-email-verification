import userModel, { IUserDocument } from '../user/user.model';
import {
	ILoginDTO,
	IRegisterUserDTO,
	IResendOtpDTO,
	IForgetPasswordDTO,
	IVerifyOtpDTO,
	IResetPasswordDTO,
} from './auth.types';
import {
	BadRequestException,
	ConflictException,
	InternalServerException,
	NotFoundException,
} from '../../utils/apiErrors.utils';
import signOTP from '../../utils/otp.utils';
import { registerUserMailTemplate } from '../../mail/templates/auth/registerMail.template';
import { resendOtpMailTemplate } from '../../mail/templates/auth/resendMail.template';
import signAccessTokenAndRefreshToken from '../../utils/token.utils';
import envConfig from '../../config/env.config';
import { resetPasswordMailTemplate } from '../../mail/templates/auth/resetPassword.template';
import getResetPasswordToken from '../../utils/getResetPasswordToken.utils';
import { logRequest } from '../../utils/logRequest.utils';
import sendMail from '../../mail/sendEmail.utils';

class AuthService {
	private async findUserByEmail(email: string, selectedPassword = false) {
		const user = await userModel.findOne({ email }).select(selectedPassword ? '+password' : '');
		if (!user) {
			throw new NotFoundException('Email not registered');
		}
		return user;
	}
	private async ensureUserVerified(user: IUserDocument) {
		if (!user.isEmailVerified) {
			throw new ConflictException('Email not verified yet.');
		}
	}
	private async ensureUserNotVerified(user: IUserDocument) {
		if (user.isEmailVerified) {
			throw new ConflictException('Email already verified.');
		}
	}
	async register(registerUserDTO: IRegisterUserDTO) {
		const { name, email, password } = registerUserDTO;
		logRequest('AuthService', 'Register', email);

		const ifUserExists = await userModel.findOne({ email });
		if (ifUserExists) {
			throw new ConflictException('Email already registered');
		}

		const { otp, otpExpiry } = signOTP();

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
		await sendMail(email, 'Email verification OTP', registerUserMailTemplate(name, otp));
	}
	async verifyOTP(verifyOtpDTO: IVerifyOtpDTO) {
		const { email, otp } = verifyOtpDTO;
		logRequest('AuthService', 'Verify OTP', email);

		const user = await this.findUserByEmail(email);

		this.ensureUserNotVerified(user);

		if (user.otp !== otp) {
			throw new BadRequestException('Invalid OTP');
		}
		if (user.otpExpiry && user.otpExpiry < new Date()) {
			throw new BadRequestException('OTP expired');
		}

		// Update user
		Object.assign(user, { isEmailVerified: true, otp: undefined, otpExpiry: undefined });
		await user.save({ validateBeforeSave: false });
	}
	async resendOTP(resendOtpDTO: IResendOtpDTO) {
		const { email } = resendOtpDTO;
		logRequest('AuthService', 'Resend OTP', email);

		// Check if user already exists
		const user = await this.findUserByEmail(email);

		// Check if user is already verified
		this.ensureUserNotVerified(user);

		// Generate OTP
		const { otp, otpExpiry } = signOTP();

		// Update user
		Object.assign(user, { otp: otp, otpExpiry: otpExpiry });
		await user.save({ validateBeforeSave: false });

		// Send OTP to user's email
		await sendMail(email, 'Email verification OTP', resendOtpMailTemplate(user.name, otp));
	}
	async login(loginDTO: ILoginDTO) {
		const { email, password } = loginDTO;
		logRequest('AuthService', 'Login', email);

		const user = await this.findUserByEmail(email, true);

		this.ensureUserVerified(user);

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
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	}
	async forgetPassword(forgetPasswordDTO: IForgetPasswordDTO) {
		const { email } = forgetPasswordDTO;
		logRequest('AuthService', 'Forget password', email);

		// Check if user already exists
		const user = await this.findUserByEmail(email);
		// Check if user is already verified
		this.ensureUserVerified(user);

		// Generate OTP
		const { resetPasswordToken, resetPasswordExpiry } = getResetPasswordToken();

		// Update user
		Object.assign(user, {
			resetPasswordToken: resetPasswordToken,
			resetPasswordExpiry: resetPasswordExpiry,
		});
		await user.save({ validateBeforeSave: false });

		// Generate reset link
		const resetLink = `${envConfig.CLIENT.URL}/reset-password?resetPasswordToken=${resetPasswordToken}`;

		// Send OTP to user's email
		await sendMail(email, 'Reset Password', resetPasswordMailTemplate(user.name, resetLink));
	}
	async resetPassword(resetPasswordDTO: IResetPasswordDTO) {
		const { resetPasswordToken, newPassword, confirmPassword } = resetPasswordDTO;
		logRequest('AuthService', 'Reset password', resetPasswordToken);

		if (newPassword !== confirmPassword) {
			throw new BadRequestException('Passwords do not match');
		}
		// If user exists
		const user = await userModel.findOne({
			resetPasswordToken,
			resetPasswordExpiry: { $gt: Date.now() },
		});
		if (!user) {
			throw new BadRequestException('Token is invalid or expired');
		}

		Object.assign(user, {
			resetPasswordToken: undefined,
			resetPasswordExpiry: undefined,
			password: newPassword,
		});
		await user.save({ validateBeforeSave: false });
	}
	async logout(id: string) {
		logRequest('AuthService', 'Logout', id);
		const resetRefreshToken = await userModel.findByIdAndUpdate(
			id,
			{ $unset: { refreshToken: 1 } },
			{ new: true },
		);
		if (!resetRefreshToken) {
			throw new NotFoundException('User not found');
		}
	}
}

export default new AuthService();
