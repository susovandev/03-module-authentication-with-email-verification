import crypto from 'node:crypto';

const getResetPasswordToken = () => {
	const resetToken = crypto.randomBytes(20).toString('hex');
	const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
	const resetPasswordExpiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

	return { resetPasswordToken, resetPasswordExpiry };
};

export default getResetPasswordToken;
