import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { MongooseError } from "mongoose";
import ProjectService from "../services/project.services";

const ProjectController = {
	// get all joined projects
	async getAllJoinedProjects(req: Request, res: Response) {
		try {
			const joinedProjects = await ProjectService.getAllJoinedProjects(
				req.cookies.uid
			);
			console.log(joinedProjects);
			return res.status(200).json(joinedProjects);
		} catch (error: any) {
			console.log(error.message);
			return res.status(404).json({
				message: (error as HttpError | MongooseError).message,
				status: (error as HttpError).status || 404,
			});
		}
	},
	// get 1 joined project
	async getJoinedProject(req: Request, res: Response) {
		try {
			if (!req.cookies.uid) {
				throw createHttpError.BadRequest("User ID must be provided!");
			}
			const joinedProject = await ProjectService.getJoinedProject(
				req.params.id,
				req.cookies.uid
			);
			console.log(joinedProject);
			return res.status(200).json(joinedProject);
		} catch (error: any) {
			console.log(error.message);
			return res.status(404).json({
				message: (error as HttpError | MongooseError).message,
				status: (error as HttpError).status || 404,
			});
		}
	},
	// get 1 joined project
	async getProjectByCreator(req: Request, res: Response) {
		try {
			if (!req.cookies.uid) {
				throw createHttpError.BadRequest("User ID must be provided!");
			}
			const joinedProjects = await ProjectService.getProjectByCreator(
				req.params.id,
				req.cookies.uid
			);
			return res.status(200).json(joinedProjects);
		} catch (error: any) {
			console.log(error.message);
			return res.status(404).json({
				message: (error as HttpError | MongooseError).message,
				status: (error as HttpError).status || 404,
			});
		}
	},
	// get all joined project
	async getAllProjectsByCreator(req: Request, res: Response) {
		try {
			if (!req.cookies.uid) {
				throw createHttpError.BadRequest("User ID must be provided!");
			}
			const joinedProjects = await ProjectService.getAllProjectsByCreator(
				req.cookies.uid
			);
			return res.status(200).json(joinedProjects);
		} catch (error: any) {
			console.log(error.message);
			return res.status(404).json({
				message: (error as HttpError | MongooseError).message,
				status: (error as HttpError).status || 404,
			});
		}
	},
	// create new project
	async createNewProject(req: Request, res: Response) {
		try {
			if (!req.body) {
				throw createHttpError.BadRequest(
					"Provide fully new project data!"
				);
			}
			const newProject = await ProjectService.createProject({
				creator: req.cookies.uid,
				...req.body,
			});
			return res.status(201).json(newProject);
		} catch (error) {
			console.log((error as Error).message);
			return res.status(400).json({
				message: (error as HttpError).message,
				status: (error as HttpError).status || 404,
			});
		}
	},
	// edit project
	async updateProject(req: Request, res: Response) {
		try {
			if (!req.body || !req.params)
				throw createHttpError.InternalServerError(
					"Failed to update project!"
				);
			const updatedProject = await ProjectService.updateProject(
				req.params.id,
				req.body
			);
			return res.status(201).json(updatedProject);
		} catch (error) {
			return res.status(400).json({
				message: (error as HttpError).message,
				status: (error as HttpError).status,
			});
		}
	},
	// add member to project
	async addMemberToProject(req: Request, res: Response) {
		try {
			if (!req.body.member) {
				throw createHttpError.BadRequest(
					"Provide member ID to add to project!"
				);
			}
			const addMemberToProjectResponse =
				await ProjectService.addMemberToProject(
					req.params.id,
					req.body.member
				);

			return res.status(201).json(addMemberToProjectResponse);
		} catch (error) {
			return res.status((error as HttpError)?.status || 500).json({
				message: "This user might join in your project or not exist!",
				status: (error as HttpError).status,
			});
		}
	},
	// remove member from project
	async removeMemberToProject(req: Request, res: Response) {
		try {
			if (!req.body.member) {
				throw createHttpError.BadRequest(
					"Provide member ID to add to project!"
				);
			}
			const addMemberToProjectResponse =
				await ProjectService.removeMemberFromProject(
					req.params.id,
					req.body.member
				);

			return res.status(201).json(addMemberToProjectResponse);
		} catch (error) {
			return res.status((error as HttpError).status || 500).json({
				message: (error as HttpError).message,
				status: (error as HttpError).status || 500,
			});
		}
	},
	// delete project
	async deleteProject(req: Request, res: Response) {
		try {
			if (!req.params.id) {
				throw createHttpError.NotFound("Cannot find project ID");
			}
			const response = await ProjectService.deleteProject(req.params.id);
			return res.status(204).json(response);
		} catch (error) {
			return res.status((error as HttpError).status).json({
				message: (error as HttpError).message,
				status: (error as HttpError).status || 500,
			});
		}
	},
};

export default ProjectController;
