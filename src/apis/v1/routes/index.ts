import express from "express";

import ProjectRouter from "./project.route";
import TaskRouter from "./task.route";
import userRouter from "./user.route";

const RootRouter = express.Router();

const AppRoutes = [ProjectRouter, userRouter, TaskRouter];

AppRoutes.forEach((route) => RootRouter.use(route));

export default RootRouter;
