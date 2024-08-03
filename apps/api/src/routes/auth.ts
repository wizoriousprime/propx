import Elysia, { t } from "elysia";
import { setup } from "../config/setup";
import { Role, User, UserType } from "../schemas/user.schema";
import { Company } from "../schemas/company.schema";
import { AuthorizationError, RecordNotFound } from "../utils/error";
import { UserDTO } from "../models/userDTO";
import { BSON, MongoServerError } from "mongodb";

export const auth = new Elysia()
  .use(setup)
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      const { email, password } = body;

      const user = await User.findOne({ email }).populate("company", "name");
      if (!user) {
        throw new RecordNotFound(`Record not found: User - ${email}`);
      }

      const validPassword = await user.validPassword(password);

      if (validPassword) {
        set.status = 200;
        return {
          success: true,
          data: await jwt.sign({
            id: user._id,
            company: user.company as unknown as string,
            name: user.name,
            email: user.email,
            role: user.role,
            userType: user.userType,
          }),
          message: "Account login successfully",
        };
      }

      throw new AuthorizationError("Wrong password");
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          default: "wisam.hassoun@gmail.com",
        }),
        password: t.String({ minLength: 8, default: "potatismos" }),
      }),
      detail: {
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/register",
    async ({ body, log, set }) => {
      const company = await Company.findOne({ _id: body.company });

      if (!company) {
        throw new RecordNotFound(`Record not found: Company - ${body.company}`);
      }

      try {
        const { email, name, password, company } = body;
        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.setPassword(password);
        newUser.userType = UserType.COMPANY;
        newUser.role = Role.ADMIN;
        newUser.company = new BSON.ObjectId(company);
        await newUser.save();

        log.info(newUser);

        return {
          success: true,
          message: "Account created",
          data: newUser,
        };
      } catch (e: any) {
        log.warn(e);
        throw new MongoServerError(e);
      }
    },
    {
      body: UserDTO,
      detail: {
        tags: ["Auth"],
      },
    },
  );
