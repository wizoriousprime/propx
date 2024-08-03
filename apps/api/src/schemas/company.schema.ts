import { Document, Schema, model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  orgNo: string;
  street: string;
  city: string;
  postal: string;
  phone?: string;
  email: string;
}

const schema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
    },
    orgNo: {
      type: String,
      unique: true,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postal: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Company = model<ICompany>("company", schema);
