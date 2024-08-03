import { ObjectId } from "mongodb";
import { Document, Schema, model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  orgNo: string;
  street: string;
  city: string;
  postal: string;
  phone?: string;
  email: string;
  company: ObjectId;
}

const schema = new Schema<ICustomer>(
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

export const Customer = model<ICustomer>("customer", schema);
