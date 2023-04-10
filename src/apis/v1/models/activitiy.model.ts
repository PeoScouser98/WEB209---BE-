import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { IActivity, IActivityModel, IActivityPaginateModel } from "../../../types/activity.type";
import mongoosePaginate from "mongoose-paginate-v2";

const ActititySchema = new mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
			autopopulate: true,
			require: true,
		},
	
		log: {
			type: String,
			require: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

ActititySchema.plugin(mongooseAutoPopulate);
ActititySchema.plugin(mongoosePaginate);

const ActivityModel = mongoose.model<IActivityModel, IActivityPaginateModel>("activities", ActititySchema);

export default ActivityModel;
