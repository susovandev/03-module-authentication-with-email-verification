import transporter from './mail.config';
import envConfig from '../config/env.config';
import Logger from '../utils/logger.utils';

const sendEmail = async (to: string, subject: string, htmlTemplate: string) => {
	try {
		await transporter.sendMail({
			from: envConfig.MAIL.USER,
			to: to,
			subject: subject,
			html: htmlTemplate,
		});
	} catch (error) {
		Logger.error('Error sending email:', error);
		throw error;
	}
};

export default sendEmail;
