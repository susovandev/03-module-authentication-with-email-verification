import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type IUserRole = 'user' | 'admin';
export interface IUserDocument extends Document {
	name: string;
	email: string;
	password: string;
	isEmailVerified: boolean;
	otp: string | undefined;
	otpExpiry: Date | undefined;
	refreshToken: string | undefined;
	resetPasswordToken: string | undefined;
	resetPasswordExpiry: Date | undefined;
	role: IUserRole;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(incomingPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		otp: {
			type: String,
		},
		otpExpiry: {
			type: Date,
		},
		resetPasswordToken: {
			type: String,
		},
		resetPasswordExpiry: {
			type: Date,
		},
		refreshToken: {
			type: String,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
	},
	{ timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = async function (incomingPassword: string): Promise<boolean> {
	return await bcrypt.compare(incomingPassword, this.password);
};

const userModel = model<IUserDocument>('User', userSchema);

export default userModel;
