import * as Joi from 'joi';

export const registerUserValidationSchema = Joi.object({
	name: Joi.string().min(3).max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(50).required(),
});

export const verifyOTPValidationSchema = Joi.object({
	email: Joi.string().email().required(),
	otp: Joi.string().required(),
});
