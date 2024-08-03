import Elysia from "elysia";
import { setup } from "../config/setup";
import { CompanyDTO } from "../models/companyDTO";
import { Company } from "../schemas/company.schema";
import { MongoServerError } from "mongodb";

export const companyRouter = new Elysia()
  .use(setup)
  .get("/company", async () => await Company.find({}), {
    detail: {
      tags: ["Company"],
    },
  })
  .post(
    "/company",
    async ({ set, body, log }) => {
      try {
        const newCompany = await Company.create(body);
        log.info(newCompany);
        return {
          success: true,
          message: "Company created",
          data: newCompany,
        };
      } catch (e: any) {
        throw new MongoServerError(e);
      }
    },
    {
      body: CompanyDTO,
      detail: {
        tags: ["Company"],
      },
    },
  );
