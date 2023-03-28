import crypto from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import User from "../apis/v1/models/user.model";
import app from "../app";

describe("check login response data", () => {
	//TODO: tạo fake user id (id default của mongodb chỉ nhận 1 chuỗi là một random string 12 byte)
	const fakeUserId = crypto.randomBytes(12).toString("hex");

	//TODO: Tạo 1 mock database mongodb và các mock data trước khi thực hiện test case
	beforeAll(async () => {
		const mongoServer = await MongoMemoryServer.create();
		mongoose.set("strictQuery", false);
		await mongoose.connect(mongoServer.getUri(), {
			dbName: "manage_projects",
		});

		const fakeUser = await new User({
			_id: new mongoose.Types.ObjectId(fakeUserId),
			email: "test@email.com",
			password: "123123",
			username: "test",
		}).save();
		console.log(fakeUser);
	});

	const newProject = {
		projectName: "DỰ ÁN 1",
		budget: 10000000,
		estimatedCompleteDate: new Date(),
	};

	// fake access token
	const accessToken = jwt.sign(
		{ auth: fakeUserId },
		process.env.SECRET_KEY!,
		{
			expiresIn: "1h",
		}
	);

	test("after creating project, response body must have projectName property", async () => {
		// TODO: Declare mock function
		const mockCreateProject = jest.fn(() => newProject);
		jest.spyOn(User, "create").mockImplementation(() =>
			mockCreateProject()
		);

		// TODO: Execute
		/**
		 * @param {Express} app
		 * @returns {Response} res
		 */
		const res = await request(app)
			.post("/v1/api/projects")
			.set("authorization", `Bearer ${accessToken}`)
			.send(newProject);

		// TODO: Check result
		expect(res.body).toHaveProperty("projectName", newProject.projectName);
		expect(res.body).toHaveProperty("budget", newProject.budget);
		expect(res.body).toHaveProperty("members");
		expect(res.body).toHaveProperty("creator");
		expect(res.body).toHaveProperty("estimatedCompleteDate");

		// reset all mock data and mock function
		jest.resetAllMocks();
	});
});
