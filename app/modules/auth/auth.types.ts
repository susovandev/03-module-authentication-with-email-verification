export interface IRegisterUserDTO {
	name: string;
	email: string;
	password: string;
}

export interface IVerifyOtpDTO {
	email: string;
	otp: string;
}
