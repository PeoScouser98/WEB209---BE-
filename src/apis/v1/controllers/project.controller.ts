import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { MongooseError } from "mongoose";
import * as ProjectService from "../services/project.service";
import { ResponseInvitationActions } from "../../../types/invitationResponse.type";
import path from "path";

// get all joined projects
export const getAllJoinedProjects = async (req: Request, res: Response) => {
	try {
		const joinedProjects = await ProjectService.getAllJoinedProjects(req.cookies.uid);
		console.log(joinedProjects);
		return res.status(200).json(joinedProjects);
	} catch (error: any) {
		console.log(error.message);
		return res.status(404).json({
			message: (error as HttpError | MongooseError).message,
			status: (error as HttpError).status || 404,
		});
	}
};

// get 1 joined project
export const getJoinedProject = async (req: Request, res: Response) => {
	try {
		if (!req.cookies.uid) {
			throw createHttpError.BadRequest("User ID must be provided!");
		}
		const joinedProject = await ProjectService.getJoinedProject(req.params.id, req.cookies.uid);
		console.log(joinedProject);
		return res.status(200).json(joinedProject);
	} catch (error: any) {
		console.log(error.message);
		return res.status(404).json({
			message: (error as HttpError | MongooseError).message,
			status: (error as HttpError).status || 404,
		});
	}
};

// get 1 joined project
export const getProjectByCreator = async (req: Request, res: Response) => {
	try {
		if (!req.cookies.uid) {
			throw createHttpError.BadRequest("User ID must be provided!");
		}
		const joinedProjects = await ProjectService.getProjectByCreator(req.params.id, req.cookies.uid);
		return res.status(200).json(joinedProjects);
	} catch (error: any) {
		console.log(error.message);
		return res.status(404).json({
			message: (error as HttpError | MongooseError).message,
			status: (error as HttpError).status || 404,
		});
	}
};

// get all joined project
export const getAllProjectsByCreator = async (req: Request, res: Response) => {
	try {
		if (!req.cookies.uid) {
			throw createHttpError.BadRequest("User ID must be provided!");
		}
		const joinedProjects = await ProjectService.getAllProjectsByCreator(req.cookies.uid);
		return res.status(200).json(joinedProjects);
	} catch (error: any) {
		console.log(error.message);
		return res.status(404).json({
			message: (error as HttpError | MongooseError).message,
			status: (error as HttpError).status || 404,
		});
	}
};

// create new project
export const createNewProject = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			throw createHttpError.BadRequest("Provide fully new project data!");
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
};

// edit project
export const updateProject = async (req: Request, res: Response) => {
	try {
		if (!req.body || !req.params) throw createHttpError.InternalServerError("Failed to update project!");
		const updatedProject = await ProjectService.updateProject(req.params.id, req.body);
		return res.status(201).json(updatedProject);
	} catch (error) {
		return res.status(400).json({
			message: (error as HttpError).message,
			status: (error as HttpError).status,
		});
	}
};

// add member to project
export const addMemberToProject = async (req: Request, res: Response) => {
	try {
		if (!req.body.member) {
			throw createHttpError.BadRequest("Provide member ID to add to project!");
		}
		const addMemberToProjectResponse = await ProjectService.addMemberToProject(req.params.id, req.body.member);

		return res.status(201).json(addMemberToProjectResponse);
	} catch (error) {
		return res.status((error as HttpError)?.status || 500).json({
			message: "This user might join in your project or not exist!",
			status: (error as HttpError).status,
		});
	}
};

// remove member from project
export const removeMemberToProject = async (req: Request, res: Response) => {
	try {
		if (!req.body.member) {
			throw createHttpError.BadRequest("Provide member ID to add to project!");
		}
		const addMemberToProjectResponse = await ProjectService.removeMemberFromProject(req.params.id, req.body.member);

		return res.status(201).json(addMemberToProjectResponse);
	} catch (error) {
		return res.status((error as HttpError).status || 500).json({
			message: (error as HttpError).message,
			status: (error as HttpError).status || 500,
		});
	}
};

// delete project
export const deleteProject = async (req: Request, res: Response) => {
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
};

// send collaboration invitation
export const sendInvitaion = async (req: Request, res: Response) => {
	try {
		await ProjectService.inviteMemberToProject(req.body.sender, req.body.receiver, req.params.id);
		return res.status(200).json({
			message: "Invitation has sent",
			status: 200,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to send mail!",
		});
	}
};

export const responseInvitation = async (req: Request, res: Response) => {
	try {
		const projectId = req.params.id as string;
		const responseAction = req.query.response as ResponseInvitationActions;
		const newCollaborator = req.body.user as string;
		console.log(projectId);
		if (responseAction == ResponseInvitationActions.ACCEPT) {
			const addMemberToProjectResponse = await ProjectService.addMemberToProject(projectId, newCollaborator);
			return res.status(200).json(addMemberToProjectResponse);
		} else {
			return res.status(200).json({
				message: "You've declined invitation for joining this project!",
				status: 200,
			});
		}
	} catch (error) {
		return res.status(400).json({
			message: (error as Error).message,
			status: 400,
		});
	}
};

export const getInvitationDetail = async (req: Request, res: Response) => {
	try {
		return res.sendFile(path.resolve("src/views/acceptInvitationResponse.html"));
	} catch (error) {
		return res.status(404).json({
			message: "Page not found ! 404",
			status: 404,
		});
	}
};
