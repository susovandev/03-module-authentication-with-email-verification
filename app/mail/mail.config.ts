import nodemailer from 'nodemailer';
import envConfig from '../config/env.config';

const transporter = nodemailer.createTransport({
	service: envConfig.MAIL.SERVICE,
	auth: {
		user: envConfig.MAIL.USER,
		pass: envConfig.MAIL.PASSWORD,
	},
});

export default transporter;
