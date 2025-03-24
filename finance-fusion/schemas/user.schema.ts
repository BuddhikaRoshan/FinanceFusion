import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6),
  contactNumber: z.string().optional(),
  position: z.enum([
    "Government Employee",
    "Private Employee",
    "Self Employee",
    "Other",
  ]),
  incomeSources: z.array(z.string()),
  financialGoals: z.array(z.string()),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type UserFormData = z.infer<typeof userSchema>;
