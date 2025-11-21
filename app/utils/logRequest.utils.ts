import Logger from './logger.utils';

export const logRequest = <T>(controller: string, action: string, body: T) => {
	Logger.info(`[${controller}] | ${action} | payload=${JSON.stringify(body)}`);
};
