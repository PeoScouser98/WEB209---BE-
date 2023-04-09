import { Model, PaginateModel } from "mongoose";
import { IUser } from "./user.type";

export interface IActivity {
	_id: string;
	createdBy: Partial<IUser>;
	log: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface IActivityModel extends Model<IActivity> {}
export interface IActivityPaginateModel extends PaginateModel<IActivity> {}
