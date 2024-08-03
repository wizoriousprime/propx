import type { APP } from "api";

import { treaty } from "@elysiajs/eden";

export const api = treaty<APP>("localhost:3000");
