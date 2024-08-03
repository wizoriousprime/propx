import Elysia from "elysia";
import { setup } from "../config/setup";

export const reportRouter = new Elysia().use(setup).get(
  "/report",
  async () => {
    return { hello: "report" };
  },
  {
    detail: {
      tags: ["Report"],
    },
  },
);
