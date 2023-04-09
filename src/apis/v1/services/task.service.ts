import { Request, Response } from "express";
import { MongooseError } from "mongoose";
import TaskModel, { Task } from "../models/task.model";

const TaskService = {
	async getTasksByProject(projectId: string) {
		try {
			return await TaskModel.find({ project: projectId }).exec();
		} catch (error) {
			throw error as MongooseError;
		}
	},
	async updateTask(taskId: string, updateData: Partial<Task>) {
		try {
			return await TaskModel.findOneAndUpdate({ _id: taskId }, updateData, { new: true }).exec();
		} catch (error) {
			console.log(error);
			throw error as MongooseError;
		}
	},
	async createTask(newTaskData: Partial<Task>) {
		try {
			return await new TaskModel(newTaskData).save();
		} catch (error) {
			throw error as MongooseError;
		}
	},
	async deleteTask(taskId: string) {
		try {
			return await TaskModel.deleteOne({ _id: taskId }).exec();
		} catch (error) {
			throw error as MongooseError;
		}
	},
};

export default TaskService;
