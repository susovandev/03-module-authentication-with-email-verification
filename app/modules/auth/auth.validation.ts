import * as Joi from 'joi';

export const registerValidationSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(20).required(),
});

export const verifyOTPValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.string().required(),
});

export const resendEmailValidationSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const loginValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(20).required(),
});

export const forgetPasswordValidationSchema = Joi.object({
	email: Joi.string().email().required(),
});

export const resetPasswordValidationSchema = Joi.object({
	newPassword: Joi.string().min(6).max(20).required(),
	confirmPassword: Joi.string().min(6).max(20).required(),
});
