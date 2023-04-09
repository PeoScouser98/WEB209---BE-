import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import TaskService from "../services/task.service";

export const getTasksByProject = async (req: Request, res: Response) => {
	try {
		if (!req.params.projectId) {
			throw createHttpError.NotFound("Project ID is not valid!");
		}
		const tasksOfProject = await TaskService.getTasksByProject(req.params.projectId);
		return res.status(200).json(tasksOfProject);
	} catch (error) {
		return res.status((error as HttpError).statusCode).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode || 500,
		});
	}
};

export const createTask = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		if (!req.body) {
			throw createHttpError.BadRequest("Task data must be provided!");
		}
		const newTask = await TaskService.createTask({
			creator: req.cookies.uid,
			...req.body,
		});
		return res.status(201).json(newTask);
	} catch (error) {
		return res.status(500).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode || 500,
		});
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		if (!req.params.taskId || !req.body || !req.query.projectId) {
			throw createHttpError.NotFound("Unacceptable request!");
		}

		const updatedTask = await TaskService.updateTask(req.params.taskId, req.body);
		console.log(updatedTask);
		return res.status(202).json(updatedTask);
	} catch (error) {
		console.log(error);
		return res.status((error as HttpError).statusCode || 500).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode || 500,
		});
	}
};
export const deleteTask = async (req: Request, res: Response) => {
	try {
		if (!req.params.taskId) {
			throw createHttpError.NotFound("Task ID is invalid!");
		}
		const deleteTaskResult = await TaskService.deleteTask(req.params.taskId);
		return res.status(204).json(deleteTaskResult);
	} catch (error) {
		return res.status((error as HttpError).statusCode).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode || 500,
		});
	}
};
