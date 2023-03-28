import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { MongooseError } from "mongoose";
import User, { IUser } from "../models/user.model";

export const login = async (data: Partial<IUser>) => {
	try {
		const user = (await User.findOne({
			email: data.email,
		}).exec()) as IUser;
		if (!user) throw new MongooseError("Account doesn't exist!");
		if (!user.authenticate(data.password as string))
			throw new MongooseError("Password is incorrect!");

		return user;
	} catch (error) {
		throw error;
	}
};
export const register = async (data: Partial<IUser>) => {
	try {
		const existedUser = await User.findOne({
			email: data.email,
		}).exec();
		if (existedUser) throw new Error("Account already exited!");
		const newUser = await new User(data).save();

		return newUser;
	} catch (error) {
		console.log((error as MongooseError).message);
		throw error as MongooseError | Error;
	}
};
export const getUser = async (credential: string) => {
	try {
		return await User.findOne({ _id: credential })
			.select("-password")
			.exec();
	} catch (error) {
		throw error as MongooseError;
	}
};
export const findUser = async (searchTerm: string) => {
	try {
		const searchTermPattern = new RegExp(searchTerm, "gi");
		const users = await User.find({
			$or: [
				{ email: searchTermPattern },
				{ username: searchTermPattern },
			],
		})
			.select("-password")
			.exec();
		console.log(searchTermPattern);
		return users;
	} catch (error) {
		throw error as MongooseError;
	}
};
export const changePassword = async (
	userId: string,
	previousPassword: string,
	newPassword: string
) => {
	try {
		const user = await User.findOne({ _id: userId }).exec();
		if (!user?.authenticate(previousPassword)) {
			throw new Error("Current password is incorrect!");
		}
		console.log(newPassword);
		const hashedPassword = bcrypt.hashSync(
			newPassword,
			bcrypt.genSaltSync(10)
		);
		return await User.updateOne(
			{
				_id: userId,
			},
			{ password: hashedPassword },
			{ new: true }
		);
	} catch (error) {
		throw error;
	}
};
export const editProfile = async (
	userId: string,
	updatedUserInfo: Partial<IUser>
) => {
	try {
		if (updatedUserInfo.username) {
			updatedUserInfo.photoUrl =
				"https://ui-avatars.com/api/?name=" +
				updatedUserInfo.username.charAt(0);
		}
		return await User.findOneAndUpdate({ _id: userId }, updatedUserInfo, {
			new: true,
		});
	} catch (error) {
		throw error as MongooseError;
	}
};
