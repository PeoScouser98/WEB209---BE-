import mongoose, { ObjectId } from "mongoose";

export interface IUser extends mongoose.Document {
	_id: string | ObjectId;
	displayName: string;

	email: string;
	picture: string;
	role: string;
	createdAt?: Date;
	updatedAt?: Date;

	[key: string]: any;
}
