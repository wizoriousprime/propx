import Elysia from "elysia";
import { setup } from "../config/setup";
import { Customer } from "../schemas/customer.schema";
import { CustomerDTO } from "../models/customerDTO";
import { BSON, MongoServerError } from "mongodb";

export const customerRouter = new Elysia()
  .use(setup)
  .get(
    "/customer",
    async () => {
      return await Customer.find();
    },
    {
      detail: {
        tags: ["Customer"],
      },
    },
  )
  .post(
    "/customer",
    async ({ set, body, log }) => {
      try {
        const newCustomer = await Customer.create({
          ...body,
          company: new BSON.ObjectId(body.company),
        });
        log.info(newCustomer);
        return {
          success: true,
          message: "Customer created",
          data: newCustomer,
        };
      } catch (e: any) {
        log.warn({ error: e });
        throw new MongoServerError(e);
      }
    },
    {
      body: CustomerDTO,
      detail: {
        tags: ["Customer"],
      },
    },
  );
