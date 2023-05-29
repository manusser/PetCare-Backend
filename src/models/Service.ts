import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
	name: string;
	description: string;
	price: number;
	user: Schema.Types.ObjectId;
}

const serviceSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IService>("Service", serviceSchema);
