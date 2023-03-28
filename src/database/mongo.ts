import "dotenv/config";
import mongoose, { MongooseError } from "mongoose";

const connectMongoDB = async () => {
	try {
		const isProductionEnvironment =
			process.env.NODE_ENV?.toUpperCase()?.includes("PRODUCTION");
		console.log(
			`[INFO] ${process.env.NODE_ENV?.trim().toUpperCase()} MODE`
		);
		// -> check current environment to use remote database uri or local database uri
		const dbUri = isProductionEnvironment
			? process.env.REMOTE_DB_URI
			: process.env.LOCAL_DB_URI;
		mongoose.set("strictQuery", false);
		const data = await mongoose.connect(dbUri as string, {
			serverSelectionTimeoutMS: 5000, // cancel request after 5 seconds
		});
		if (!data) throw new Error("[ERROR] Failed to connect database!");
		console.log("[SUCCESS] Connected to database!");
	} catch (error) {
		const mongodbError = error as MongooseError;
		console.log(mongodbError.message);
	}
};

export default connectMongoDB;
