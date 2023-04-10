import "dotenv/config";
import { Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as UserService from "../services/user.service";
import client from "../../../database/redis";
import { IUser } from "../models/user.model";

export const signinOrSignupWithGoogle = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;
		if (!user) {
			throw createHttpError.NotFound("User not found!");
		}
		const accessToken = jwt.sign({ auth: user }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1h",
		});
		const refreshToken = jwt.sign({ auth: user }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "30d" });

		// await Promise.all([client.set(`rft_${user._id}`, refreshToken), client.set(`act_${user._id}`, accessToken)]);
		res.cookie("access_token", accessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000 * 24,
		});
		res.cookie("uid", user._id.toString(), {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30,
		});
		res.redirect(process.env.CLIENT_URL + "/signin/success");
	} catch (error) {
		return res.status(400).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode,
		});
	}
};

export const signout = async (req: Request, res: Response) => {
	try {
		if (!req.cookies.uid) {
			throw createHttpError.Unauthorized("Invalid user!");
		}
		// const [accessToken, refreshToken] = await Promise.all([client.get(`act_${req.cookies.uid}`), client.get(`rft_${req.cookies.uid}`)]);
		// if (!accessToken || !refreshToken) {
		// 	throw createHttpError.BadRequest("Failed to signout!");
		// }

		res.clearCookie("connect.sid", { path: "/" });
		res.clearCookie("uid", { path: "/" });
		res.clearCookie("access_token", { path: "/" });
		// await Promise.all([client.del(`act_${req.cookies.uid}`), client.del(`rft_${req.cookies.uid}`)]);
		return res.status(200).json({ message: "Signed out!" });
	} catch (error) {
		return res.status((error as HttpError).status || 400).json({
			message: (error as HttpError).message,
			status: (error as HttpError).status || 400,
		});
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		console.log(req.profile);
		return res.status(200).json(req.profile);
	} catch (error) {
		return res.status((error as HttpError).statusCode).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode,
		});
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const storedRefreshToken = await client.get(`rft_${req.cookies.uid}`);
		if (!storedRefreshToken) {
			throw createHttpError.Unauthorized("Failed to get new access token!");
		}
		const decoded = jwt.verify(storedRefreshToken!, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

		const newAccessToken = jwt.sign({ auth: decoded }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1h" });

		res.cookie("access_token", newAccessToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 1000 * 24,
		});
		return res.status(200).json(newAccessToken);
	} catch (error) {
		return res.status((error as HttpError).statusCode).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode,
		});
	}
};

export const findUser = async (req: Request, res: Response) => {
	try {
		const foundUsers = await UserService.findUser(req.body.searchTerm as string);
		return res.status(200).json(foundUsers);
	} catch (error) {
		return res.status((error as HttpError).statusCode).json({
			message: (error as HttpError).message,
			statusCode: (error as HttpError).statusCode,
		});
	}
};

export const editProfile = async (req: Request, res: Response) => {
	try {
		const updatedProfile = await UserService.editProfile(req.auth, req.body);
		return res.status(201).json(updatedProfile);
	} catch (error) {
		return res.status(400).json({
			message: (error as HttpError).message,
			status: (error as HttpError).status,
		});
	}
};
