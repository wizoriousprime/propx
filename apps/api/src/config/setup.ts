import Elysia from "elysia";
import { createPinoLogger } from "@bogeychan/elysia-logger";
import jwt from "@elysiajs/jwt";

export const log = createPinoLogger(/* ... */);

export const setup = new Elysia()
  .decorate("version", 1 as number)
  .decorate("log", log)
  .use(
    log.into({
      customProps(ctx) {
        return {
          version: ctx.version,
        };
      },
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "1d",
    }),
  );
