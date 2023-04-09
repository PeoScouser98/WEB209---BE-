import express from "express";
import * as ActivityController from "../controllers/activity.controller";
import { checkAuthenticated } from "../middlewares/auth.middleware";
const ActivityRouter = express.Router();

ActivityRouter.post("/activities", checkAuthenticated, ActivityController.createActivityLog);
ActivityRouter.get("/activities", checkAuthenticated, ActivityController.getCurrentActivityLog);

export default ActivityRouter;
