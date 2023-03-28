import "dotenv/config";
import { MongooseError } from "mongoose";
import passport from "passport";
import {
	Strategy as GoogleStrategy,
	StrategyOptionsWithRequest,
	VerifyFunctionWithRequest,
} from "passport-google-oauth2";
import User, { IUser } from "../apis/v1/models/user.model";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.OAUTH2_CLIENT_ID,
			clientSecret: process.env.OAUTH2_CLIENT_SECRET!,
			callbackURL: "http://localhost:9090/v1/api/auth/google/callback",
			passReqToCallback: true,
		} as StrategyOptionsWithRequest,
		async function (request, accessToken, refreshToken, profile, done) {
			const { email, displayName, picture } = profile;
			User.findOrCreate(
				{ email, displayName, picture },
				(error: MongooseError, user: IUser) => {
					return error ? done(null, false) : done(null, user);
				}
			);
		} as VerifyFunctionWithRequest
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((error, done) => {
	done(null, false);
});

export default passport;
