import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  date: z.union([z.date(), z.string().transform((val) => new Date(val))]),
  reason: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
