import { StatusCodes } from 'http-status-codes';
export abstract class ApiError extends Error {
	abstract status: boolean;
	abstract statusCode: number;
	constructor(message: string) {
		super(message);
	}
}

export class BadRequestException extends ApiError {
	status = false;
	statusCode = StatusCodes.BAD_REQUEST;
	constructor(message: string = 'Bad request') {
		super(message);
	}
}

export class UnauthorizedException extends ApiError {
	status = false;
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor(message: string = 'Unauthorized') {
		super(message);
	}
}

export class ForbiddenException extends ApiError {
	status = false;
	statusCode = StatusCodes.FORBIDDEN;
	constructor(message: string = 'Forbidden') {
		super(message);
	}
}

export class NotFoundException extends ApiError {
	status = false;
	statusCode = StatusCodes.NOT_FOUND;
	constructor(message: string = 'Not found') {
		super(message);
	}
}

export class ConflictException extends ApiError {
	status = false;
	statusCode = StatusCodes.CONFLICT;
	constructor(message: string = 'Conflict') {
		super(message);
	}
}

export class InternalServerException extends ApiError {
	status = false;
	statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	constructor(message: string = 'Internal server error') {
		super(message);
	}
}
