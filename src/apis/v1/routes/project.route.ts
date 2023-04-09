import { Router } from "express";
import * as ProjectController from "../controllers/project.controller";
import * as AuthMiddleware from "../middlewares/auth.middleware";

const ProjectRouter = Router();

ProjectRouter.get("/projects", AuthMiddleware.checkAuthenticated, ProjectController.getAllJoinedProjects);
ProjectRouter.get("/projects/created-by/:userId", AuthMiddleware.checkAuthenticated, ProjectController.getAllJoinedProjects);
ProjectRouter.get("/projects/:id", AuthMiddleware.checkAuthenticated, ProjectController.getJoinedProject);
ProjectRouter.post("/projects", AuthMiddleware.checkAuthenticated, ProjectController.createNewProject);
ProjectRouter.patch("/projects/:id", AuthMiddleware.checkAuthenticated, AuthMiddleware.checkIsProjectCreator, ProjectController.updateProject);
ProjectRouter.patch("/projects/:id/add-member", AuthMiddleware.checkAuthenticated, AuthMiddleware.checkIsMember, ProjectController.addMemberToProject);
ProjectRouter.patch(
	"/projects/:id/remove-member",
	AuthMiddleware.checkAuthenticated,
	AuthMiddleware.checkIsProjectCreator,
	ProjectController.removeMemberToProject
);
ProjectRouter.delete("/projects/:id", AuthMiddleware.checkAuthenticated, AuthMiddleware.checkIsProjectCreator, ProjectController.deleteProject);
ProjectRouter.post("/projects/:id/send-invitation", AuthMiddleware.checkAuthenticated, AuthMiddleware.checkIsProjectCreator, ProjectController.sendInvitaion);
ProjectRouter.patch("/projects/:id/invitation", ProjectController.responseInvitation);
ProjectRouter.get("/projects/invitation/detail", ProjectController.getInvitationDetail);

export default ProjectRouter;
