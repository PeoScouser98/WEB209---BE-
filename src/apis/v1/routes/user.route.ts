import { Request, Response, Router } from "express";
import passport from "passport";
import * as UserController from "../controllers/user.controller";
import * as AuthMiddleware from "../middlewares/auth.middleware";
import "dotenv/config";
import "../../../auth/googlePassport.auth";

const userRouter = Router();

userRouter.get(
	"/user",
	AuthMiddleware.checkAuthenticated,
	UserController.getUser
);
userRouter.get("/refresh-token", UserController.refreshToken);
userRouter.post("/find-user", UserController.findUser);
userRouter.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);
userRouter.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: process.env.CLIENT_URL + "/",
	}),
	UserController.signinOrSignupWithGoogle
);

userRouter.patch(
	"/edit-profile",
	AuthMiddleware.checkAuthenticated,
	UserController.editProfile
);
userRouter.post("/signout", UserController.signout);
export default userRouter;

/**
 * @openapi
 * /login:
 *   tags:
 *     - Auth
 *   post:
 *     description: Basic Auth signin with email and password
 *     requestBody:
 *       type: object
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example: {email: 'test@gmail.com', password: '123123'}
 *     responses:
 *       200:
 *         description: ok
 */
