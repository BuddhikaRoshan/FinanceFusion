import { z } from "zod";

export const incomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  source: z.string().min(1, "Source is required"),
  date: z.union([z.date(), z.string().transform((val) => new Date(val))]),
  userId: z.string().min(1, "User ID is required"),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
