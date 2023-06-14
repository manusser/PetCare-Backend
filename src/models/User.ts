import mongoose, { Schema, Document } from "mongoose";
import { IService } from "./Service";
export interface IUser extends Document {
	name: string;
	password: string;
	email: string;
	avatar: string;
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
        telefono: {
            type: Number,
            required: false
        },
        direccion: {
            type: String,
            required: false
        },
		password: {
			type: String,
			required: true,
		},
		services: {
			type: Array<IService>,
			required: false,
		},
        mascotas: {
            type: Array,
            required: false
        }
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IUser>("User", userSchema);
