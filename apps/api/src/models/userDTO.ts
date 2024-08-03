import { t } from "elysia";

export const UserDTO = t.Object({
  name: t.String({
    minLength: 3,
    default: "John Doe",
  }),
  password: t.String({
    minLength: 8,
    default: "potatismos",
  }),
  email: t.String({
    format: "email",
    default: "wisam.hassoun@gmail.com",
  }),
  company: t.String({ default: "65b23de3003ff61914cca706" }),
});
