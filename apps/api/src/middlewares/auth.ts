import { Elysia } from "elysia";
import { setup } from "../config/setup";
import { BSON } from "mongodb";
import { User } from "../schemas/user.schema";
import { AuthorizationError } from "../utils/error";
import jwt from "@elysiajs/jwt";

export const isAuthenticated = (app: Elysia) =>
  app.use(setup).derive(async ({ request: { headers } }) => {
    const authToken = headers.get("authorization");
    if (!authToken) {
      throw new AuthorizationError("No token present");
    }

    const token = authToken.split(" ")[1];
    const profile = await jwt.verify(token);
    if (!profile) {
      throw new AuthorizationError("No profile attached to token");
    }

    const { id } = profile;
    const user = await User.findOne({
      _id: new BSON.ObjectId(id), //Number
    }).select("-hash -salt");

    if (!user) {
      throw new AuthorizationError("User does not exist");
    }

    return {
      user,
    };
  });
