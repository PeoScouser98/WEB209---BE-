import mongooseAutoPopulate from "mongoose-autopopulate";
import mongoose, { ObjectId } from "mongoose";
import { IUser } from "./user.model";
import { IProject } from "./project.model";

export interface Task {
	_id: string | ObjectId;
	project: Partial<IProject>;
	title: string;
	description: string;
	assignees: Array<ObjectId | Partial<IUser>>;
	startedAt: Date;
	deadline: Date;
	createdAt?: Date;
	updatedAt?: Date;
	status: string;
}
const TaskSchema = new mongoose.Schema(
	{
		project: {
			type: mongoose.Types.ObjectId,
			ref: "Projects",
		},
		title: {
			type: String,
			trim: true,
			require: true,
			minLength: 3,
		},
		creator: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
			autopopulate: { select: "-password" },
		},
		description: {
			type: String,
			trim: true,
			require: true,
		},
		assignee: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
			autopopulate: { select: "-password" },
		},
		priority: {
			type: String,
			default: "Medium",
			enum: ["Low", "Medium", "High", "Very High"],
		},
		startedAt: {
			type: Date,
			require: true,
			default: new Date(),
		},
		deadline: {
			type: Date,
			require: true,
			default: function () {
				const today = new Date();
				const threeDaysLater = new Date();
				threeDaysLater.setDate(today.getDate() + 3);
				return threeDaysLater;
			},
		},
		status: {
			type: String,
			require: true,
			default: "TODO",
			enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
		},
	},
	{
		versionKey: false,
		timestamps: true,
		strictQuery: false,
		strictPopulate: false,
	}
);

TaskSchema.plugin(mongooseAutoPopulate);

const TaskModel = mongoose.model<Task>("Tasks", TaskSchema);

export default TaskModel;
