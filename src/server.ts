import app from "./app";
import "dotenv/config";
import connectMongoDB from "./database/mongo";
import http from "http";
import { IUser } from "./apis/v1/models/user.model";
import client from "./database/redis";
declare global {
	namespace Express {
		interface Request {
			auth: string;
			profile: IUser;
		}
	}
}

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`[SUCCESS] Server is listening on port ${PORT}`);
	console.log(
		`[INFO] API document is available on: http://localhost:${PORT}/api/docs`
	);
});

client
	.connect()
	.then(() => {
		console.log("[SUCCESS] Connected to Redis");
	})
	.catch((error) => console.log("[ERROR] " + error.message));

connectMongoDB();
