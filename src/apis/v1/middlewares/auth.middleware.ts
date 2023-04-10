import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import * as ProjectService from "../services/project.service";

export const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies?.access_token;

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;

		req.profile = decoded.auth;
		next();
	} catch (error) {
		return res.status(401).json({
			message: (error as HttpError | JsonWebTokenError).message,
			status: (error as HttpError).status || 401,
		});
	}
};
export const checkIsProjectCreator = async (req: Request | any, res: Response, next: NextFunction) => {
	try {
		const projectId = req.params.projectId || req.params.id || req.query.projectId;
		const createdProject = await ProjectService.getProjectByCreator(projectId, req.cookies.uid);
		if (!createdProject) {
			throw createHttpError.Forbidden("You are not project creator!");
		}
		next();
	} catch (error) {
		return res.status(403).json({
			message: (error as HttpError).message,
			status: (error as HttpError).status,
		});
	}
};
export const checkIsMember = async (req: Request | any, res: Response, next: NextFunction) => {
	try {
		const projectId = req.params.id || req.params.projectId || req.query.projectId;
		const projectJoinedIn = await ProjectService.getJoinedProject(projectId, req.cookies.uid);
		if (!projectJoinedIn) throw createHttpError.Unauthorized("You are not a member of this project!");
		next();
	} catch (error) {
		return res.status(403).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode,
		});
	}
};
