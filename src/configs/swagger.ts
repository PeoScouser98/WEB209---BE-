import * as swaggerJSDoc from "swagger-jsdoc";
const options: swaggerJSDoc.OAS3Options = {
	definition: {
		openapi: "3.0.0",
		basePath: "api",
		info: {
			title: "API Document",
			version: "1.0.0",
			description: "API documentation for Front-end",
		},
		servers: [
			{
				url: "http://localhost:3001",
			},
		],
	},
	apis: ["./apis/v1/routes/*.ts"],
};

export default options;
