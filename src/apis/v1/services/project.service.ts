import UserModel from "../models/user.model";
import mongoose, { MongooseError } from "mongoose";
import transporter from "../../../configs/nodemailer.config";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { IUser } from "../models/user.model";
import { IProject } from "../models/project.model";
import { ResponseInvitationActions } from "../../../types/invitationResponse.type";
import { getInvitationMailTemplate } from "../../../helpers/invitationMailTemplate";

export const getAllJoinedProjects = async (userId: string) => {
	try {
		return await ProjectModel.find().elemMatch("members", { info: userId }).lean().exec();
	} catch (error) {
		throw error as MongooseError;
	}
};
// get 1 joined project
export const getJoinedProject = async (projectId: string, userId: string) => {
	try {
		const joinedProject = await ProjectModel.findOne({ _id: projectId }).elemMatch("members", { info: userId }).exec();
		return joinedProject;
	} catch (error) {
		throw error as MongooseError;
	}
};

// get all project by creator
export const getAllProjectsByCreator = async (userId: string) => {
	try {
		const joinedProjects = await ProjectModel.find({
			creator: userId,
		}).exec();
		return joinedProjects;
	} catch (error) {
		throw error as MongooseError;
	}
};

// get 1 project by creator
export const getProjectByCreator = async (projectId: string, userId: string) => {
	try {
		const joinedProject = await ProjectModel.findOne({
			_id: projectId,
			creator: userId,
		}).exec();
		console.log(joinedProject);
		return joinedProject;
	} catch (error) {
		throw error as MongooseError;
	}
};

// invite member to project
export const inviteMemberToProject = async (sender: string, receiver: string, projectId: string) => {
	try {
		const [project, senderUser, receiverUser] = await Promise.all([
			ProjectModel.findOne({ _id: projectId }),
			UserModel.findOne({ email: sender }),
			UserModel.findOne({ email: receiver }),
		]);

		await transporter.sendMail(
			{
				from: { name: "Rubik", address: sender },
				to: receiver,
				subject: "[RUBIK] Invatation for joining project",
				html: getInvitationMailTemplate(project!, senderUser!, receiverUser!),
			},
			(error, info) => {
				if (error) {
					console.log(error);
					throw new Error(error.message);
				}
				console.log(info);
			}
		);
		// handle logic ...
	} catch (error: any) {
		console.log(error.message);
	}
};

export const createProject = async (newProjectData: IProject) => {
	try {
		console.log(newProjectData);
		return await new ProjectModel(newProjectData).save();
	} catch (error) {
		throw error as MongooseError;
	}
};

export const updateProject = async (projectId: string, updateProjectData: Partial<IProject>) => {
	try {
		return await ProjectModel.findOneAndUpdate({ _id: projectId }, updateProjectData, {
			new: true,
		}).exec();
	} catch (error) {
		throw error as MongooseError;
	}
};

export const addMemberToProject = async (projectId: string, memberId: string) => {
	try {
		return await ProjectModel.findOneAndUpdate(
			{ _id: projectId, "members.info": { $ne: memberId } },
			{
				$push: { members: { info: memberId, role: "MEMBER" } },
			},
			{ new: true, upsert: true }
		).exec();
	} catch (error) {
		throw error;
	}
};

export const removeMemberFromProject = async (projectId: string, memberId: string) => {
	try {
		return await ProjectModel.findOneAndUpdate(
			{ _id: projectId },
			{
				$pull: { members: { info: memberId, role: "MEMBER" } },
			},
			{ new: true }
		).exec();
	} catch (error) {
		throw error as MongooseError;
	}
};
export const deleteProject = async (projectId: string) => {
	try {
		const projectObjectId = new mongoose.Types.ObjectId(projectId);
		const deletedProject = ProjectModel.deleteOne({
			_id: projectId,
		}).exec();
		const deletedTasks = TaskModel.deleteMany({
			project: projectObjectId,
		});
		return await Promise.all([deletedProject, deletedTasks]);
	} catch (error) {
		throw error as MongooseError;
	}
};
