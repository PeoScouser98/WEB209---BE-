import { Request, Response } from "express";
import * as ActivityService from "../services/activity.service";
import { MongooseError } from "mongoose";
import { HttpError } from "http-errors";

export const createActivityLog = async (req: Request, res: Response) => {
	try {
		console.log(req.profile);
		const newLog = await ActivityService.createActivityLog(req.profile?.auth, req.body.log);
		console.log(newLog);
		return res.status(201).json(newLog);
	} catch (error) {
		console.log((error as any).message);
		return res.status(400).json({
			message: (error as HttpError | MongooseError).message,
			status: 400,
		});
	}
};

export const getCurrentActivityLog = async (req: Request, res: Response) => {
	try {
		const currentUserActivities = await ActivityService.getCurrentActivities(req.profile?.auth?._id);
		return res.status(200).json(currentUserActivities);
	} catch (error) {
		return res.status(404).json({
			message: "Not found!",
			status: 404,
		});
	}
};
