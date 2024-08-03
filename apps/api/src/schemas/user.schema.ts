import { Document, Model, Schema, model } from "mongoose";
import { ObjectId } from "mongodb";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export enum Role {
  "SUPERADMIN" = "SUPERADMIN",
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

export enum UserType {
  "COMPANY" = "COMPANY",
  "CLIENT" = "CLIENT",
}

export interface IUser extends Document {
  name: string;
  email: string;
  salt: string;
  hash: string;
  role: Role;
  userType: UserType;
  company: ObjectId;
}
interface IUserMethods {
  setPassword: (password: string) => void;
  validPassword: (password: string) => Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    salt: {
      type: String,
    },
    hash: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "company",
    },
  },
  {
    timestamps: true,
  },
);

schema.methods.setPassword = async function (password: string) {
  const { hash, salt } = await hashPassword(password);
  this.salt = salt;
  this.hash = hash;
};

schema.methods.validPassword = async function (password: string) {
  const match = await comparePassword(password, this.salt, this.hash);
  return match;
};

export const User = model<IUser, UserModel>("user", schema);
