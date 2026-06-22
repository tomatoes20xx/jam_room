import { z } from "zod";
import { ROLES } from "./enums.js";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  role: z.enum(ROLES),
});
export type User = z.infer<typeof userSchema>;
