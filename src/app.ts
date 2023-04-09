import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import session, { MemoryStore } from "express-session";
import cookieParser from "cookie-parser";

import "dotenv/config";

// Import routers
import RootRouter from "./apis/v1/routes";
import passport from "passport";

const options: swaggerJSDoc.OAS3Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Document",
			version: "1.0.0",
			description: "API documentation for Front-end",
		},
		servers: [
			{
				url: "http://localhost:3001/api",
			},
		],
	},
	apis: ["src/apis/v1/routes/*.ts"],
};

const app = express();
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:8080",
		methods: "GET, POST, PUT, DELETE, PATCH",
		credentials: true,
	})
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(
	compression({
		level: 6,
		threshold: 10 * 1024,
	})
);
app.use(
	session({
		store: new MemoryStore(),
		secret: process.env.SESSION_SECRET!,
		saveUninitialized: false,
	})
);

// Use app routes
app.use("/api/v1", RootRouter);

app.get("/", async (req, res) => {
	return res.status(200).json({
		status: 200,
		message: "Server now is running!",
	});
});

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(options)));
export default app;
