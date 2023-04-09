import express from "express";

import ProjectRouter from "./project.route";
import TaskRouter from "./task.route";
import userRouter from "./user.route";
import ActivityRouter from "./activity.route";
const RootRouter = express.Router();
const AppRoutes = [ProjectRouter, userRouter, TaskRouter, ActivityRouter];
AppRoutes.forEach((route) => RootRouter.use(route));

export default RootRouter;
