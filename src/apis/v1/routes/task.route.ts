import { Router } from "express";
import * as TaskController from "../controllers/task.controller";
import * as AuthMiddleware from "../middlewares/auth.middleware";
const TaskRouter = Router();

TaskRouter.get("/tasks/:projectId", TaskController.getTasksByProject);
TaskRouter.post(
	"/tasks/:projectId",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsMember,
	TaskController.createTask
);
TaskRouter.patch(
	"/tasks/:taskId",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsMember,
	TaskController.updateTask
);
TaskRouter.delete(
	"/tasks/:taskId",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsMember,
	TaskController.deleteTask
);

export default TaskRouter;
