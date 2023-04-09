import { MongooseError, ObjectId } from "mongoose";
import { IUser } from "../../../types/user.type";
import ActivityModel from "../models/activitiy.model";

export const createActivityLog = async (user: Partial<IUser>, logMessage: string) => {
	try {
		return await new ActivityModel({ createdBy: user._id, log: logMessage }).save();
	} catch (error) {
		throw error as MongooseError;
	}
};

export const getCurrentActivities = async (userId: string | ObjectId) => {
	try {
		return await ActivityModel.paginate({ createdBy: userId }, { sort: { createdAt: -1 }, limit: 20 });
	} catch (error) {
		throw error as MongooseError;
	}
};
