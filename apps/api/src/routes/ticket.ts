import Elysia from "elysia";
import { setup } from "../config/setup";

export const ticketRouter = new Elysia().use(setup).get(
  "/ticket",
  async () => {
    return {
      hello: "ticket",
    };
  },
  {
    detail: {
      tags: ["Ticket"],
    },
  },
);
