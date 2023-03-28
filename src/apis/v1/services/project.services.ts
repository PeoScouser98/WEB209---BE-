import mongoose, { MongooseError, Types } from "mongoose";
import ProjectModel, { Project } from "../models/project.model";
import TaskModel from "../models/task.model";

const ProjectService = {
	// get all joined project

	async getAllJoinedProjects(userId: string) {
		try {
			return await ProjectModel.find()
				.elemMatch("members", { info: userId })
				.lean()
				.exec();
		} catch (error) {
			throw error as MongooseError;
		}
	},
	// get 1 joined project
	async getJoinedProject(projectId: string, userId: string) {
		try {
			const joinedProject = await ProjectModel.findOne({ _id: projectId })
				.elemMatch("members", { info: userId })
				.exec();
			return joinedProject;
		} catch (error) {
			throw error as MongooseError;
		}
	},
	// get all project by creator
	async getAllProjectsByCreator(userId: string) {
		try {
			const joinedProjects = await ProjectModel.find({
				creator: userId,
			}).exec();
			return joinedProjects;
		} catch (error) {
			throw error as MongooseError;
		}
	},
	// get 1 project by creator
	async getProjectByCreator(projectId: string, userId: string) {
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
	},
	async createProject(newProjectData: Project) {
		try {
			console.log(newProjectData);
			return await new ProjectModel(newProjectData).save();
		} catch (error) {
			throw error as MongooseError;
		}
	},
	async updateProject(
		projectId: string,
		updateProjectData: Partial<Project>
	) {
		try {
			return await ProjectModel.findOneAndUpdate(
				{ _id: projectId },
				updateProjectData,
				{
					new: true,
				}
			).exec();
		} catch (error) {
			throw error as MongooseError;
		}
	},
	async addMemberToProject(projectId: string, memberId: string) {
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
	},

	async removeMemberFromProject(projectId: string, memberId: string) {
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
	},
	async deleteProject(projectId: string) {
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
	},
};

export default ProjectService;
