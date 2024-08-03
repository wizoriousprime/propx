import Elysia from "elysia";
import { setup } from "../config/setup";
import { User } from "../schemas/user.schema";

export const userRouter = new Elysia().use(setup).get(
  "/user",
  async ({ log }) => {
    log.warn("This is a warning message");
    return await User.find().populate("company", "name");
  },
  {
    detail: {
      tags: ["User"],
    },
  },
);
