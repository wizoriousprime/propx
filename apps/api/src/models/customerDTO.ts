import { t } from "elysia";

export const CustomerDTO = t.Object({
  name: t.String({ minLength: 3 }),
  orgNo: t.String({ minLenght: 8 }),
  street: t.String({ minLength: 3 }),
  city: t.String({ minLength: 2 }),
  postal: t.String({ minLength: 4 }),
  phone: t.String(),
  email: t.String({ minLength: 8, format: "email", default: "" }),
  company: t.String(),
});
