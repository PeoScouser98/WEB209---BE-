import { Router } from "express";
import ProjectController from "../controllers/project.controller";
import * as AuthMiddleware from "../middlewares/auth.middleware";

const ProjectRouter = Router();

ProjectRouter.get(
	"/projects",
	AuthMiddleware.checkAuthenticated,
	ProjectController.getAllJoinedProjects
);
ProjectRouter.get(
	"/projects/created-by/:userId",
	AuthMiddleware.checkAuthenticated,
	ProjectController.getAllJoinedProjects
);
ProjectRouter.get(
	"/projects/:id",
	AuthMiddleware.checkAuthenticated,
	ProjectController.getJoinedProject
);
ProjectRouter.post(
	"/projects",
	AuthMiddleware.checkAuthenticated,
	ProjectController.createNewProject
);
ProjectRouter.patch(
	"/projects/:id",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsProjectCreator,
	ProjectController.updateProject
);
ProjectRouter.patch(
	"/projects/:id/add-member",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsMember,
	ProjectController.addMemberToProject
);
ProjectRouter.patch(
	"/projects/:id/remove-member",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsProjectCreator,
	ProjectController.removeMemberToProject
);
ProjectRouter.delete(
	"/projects/:id",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsProjectCreator,
	ProjectController.deleteProject
);

export default ProjectRouter;
