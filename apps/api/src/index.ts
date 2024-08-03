import { Elysia, ValidationError } from "elysia";
import "./config/mongodb";
import swagger from "@elysiajs/swagger";
import { userRouter } from "./routes/user";
import { auth } from "./routes/auth";
import { reportRouter } from "./routes/report";
import { ticketRouter } from "./routes/ticket";
import { customerRouter } from "./routes/customer";
import { log, setup } from "./config/setup";
import { companyRouter } from "./routes/company";
import { error } from "./utils/error";
import { isAuthenticated } from "./middlewares/auth";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .use(setup)
  .use(
    swagger({
      documentation: {
        info: {
          title: "Property Guard Api",
          version: "0.0.1",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Company", description: "Company endpoints" },
          { name: "Customer", description: "Customer endpoints" },
          { name: "Report", description: "Report endpoints" },
          { name: "Ticket", description: "Ticket endpoints" },
          { name: "User", description: "User endpoints" },
        ],
      },
    }),
  )
  .group("/v1", (app) =>
    app
  
      .use(error())
      .use(auth)
      // .use(isAuthenticated)
      .use(userRouter)
      .use(reportRouter)
      .use(ticketRouter)
      .use(customerRouter)
      .use(companyRouter),
  )
  .listen(3000);

log.info({
  host: app.server?.hostname,
  port: process.env.PORT || app.server?.port,
  event: "START",
});

process.on("SIGTERM", async () => {
  try {
    log.info({
      event: "SIGTERM",
    });
  } catch (error) {
    log.info({
      event: "SIGTERM_FAIL",
    });
    log.error(error);
    process.exit(1);
  }
});

export type APP = typeof app;
