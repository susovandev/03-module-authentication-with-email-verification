export interface IRegisterUserDTO {
	name: string;
	email: string;
	password: string;
}

export interface IVerifyOtpDTO {
	email: string;
	otp: string;
}

export interface IResendOtpDTO {
	email: string;
}

export interface IResetPasswordDTO {
	email: string;
}
export interface ILoginDTO {
	email: string;
	password: string;
}

export interface IUserJwtPayload {
	sub: string;
	role: string;
	email?: string;
}
