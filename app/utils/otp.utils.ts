import crypto from 'node:crypto';
const signOTP = (): { otp: string; otpExpiry: Date } => {
	const otp = crypto.randomInt(100000, 999999).toString();
	const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

	return { otp, otpExpiry };
};

export default signOTP;
