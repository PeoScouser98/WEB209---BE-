import mongoose, { ObjectId } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { IUser } from "./user.model";

export interface IProject {
	_id: ObjectId;
	projectName: string;
	creator: ObjectId;
	members: Array<{
		_id: ObjectId;
		info: Omit<IUser, "password">;
		role: string;
		joinedAt: Date;
	}>;
	createdAt: Date;
	updatedAt: Date;
	estimatedCompleteDate: Date;
	tasks?: [];
}

const ProjectSchema = new mongoose.Schema(
	{
		projectName: {
			type: String,
			trim: true,
			minLength: 3,
			require: true,
		},
		creator: {
			type: mongoose.Types.ObjectId,
			ref: "Users",
			autopopulate: { select: "-password -__v" },
		},
		members: [
			{
				info: {
					type: mongoose.Types.ObjectId,
					ref: "Users",
					autopopulate: { select: "-password -__v" },
				},
				joinedAt: {
					type: Date,
					default: new Date(),
				},
				role: {
					type: String,
					enum: ["MEMBER", "PROJECT_MANAGER"],
				},
			},
		],

		estimatedCompleteDate: {
			type: Date,
			default: () => {
				const today = new Date();
				const sixMonthLater = new Date();
				sixMonthLater.setMonth(today.getMonth() + 7);
				return sixMonthLater;
			},
		},
	},
	{
		versionKey: false,
		strictPopulate: false,
		strictQuery: false,
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
);
ProjectSchema.plugin(mongooseAutoPopulate);
ProjectSchema.pre("save", function (next) {
	if (!this.creator) {
		return;
	}

	this.members.push({
		info: this.creator,
		role: "PROJECT_MANAGER",
		joinedAt: new Date(),
	});

	next();
});

const ProjectModel = mongoose.model<IProject>("Projects", ProjectSchema);

export default ProjectModel;
