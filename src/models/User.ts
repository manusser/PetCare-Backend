import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	password: string;
	email: string;
    avatar: string;
}

export interface IServices extends Document {
	name: string;
	caracteristics: string;
	price: number;
}

const userSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		services: {
			type: Array<IServices>,
			required: false,
		}
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IUser>("User", userSchema);
