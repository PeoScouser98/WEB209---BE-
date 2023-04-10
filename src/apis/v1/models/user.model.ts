import bcrypt from "bcrypt";
import mongoose, { Model, MongooseError, ObjectId } from "mongoose";

export interface IUser extends mongoose.Document {
	_id: string | ObjectId;
	displayName: string;

	email: string;
	picture: string;
	role: string;
	createdAt?: Date;
	updatedAt?: Date;

	[key: string]: any;
}

export interface UserModel extends Model<IUser> {
	findOrCreate: (queryObject: { [key: string]: any }, newDoc: Omit<IUser, "_id">) => IUser;
}

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			require: true,
			trim: true,
			unique: true,
			validate: {
				validator: function (value: string) {
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value);
				},
				message: (props: any) => `${props.value} is not a valid email address!`,
			},
		},

		displayName: {
			type: String,
			trim: true,
			require: true,
		},
		picture: {
			type: String,
			trim: true,
			require: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

UserSchema.statics.findOrCreate = function (queryObject, callback) {
	const _this = this;
	_this.findOne(queryObject, (err: MongooseError, result: IUser) => {
		return result
			? callback(err, result)
			: _this.create(queryObject, (err: MongooseError, result: IUser) => {
					console.log(result);
					return callback(err, result);
			  });
	});
};

const User = mongoose.model<IUser, UserModel>("Users", UserSchema);
export default User;
