import { ObjectId } from "mongoose";
import { IUser } from "../apis/v1/models/user.model";

export interface IProject {
	_id: ObjectId;
	projectName: string;
	creator: ObjectId;
	members: Array<{
		_id: ObjectId;
		info: Partial<IUser>;
		role: string;
		joinedAt: Date;
	}>;
	createdAt: Date;
	updatedAt: Date;
	estimatedCompleteDate: Date;
	tasks?: [];
}
