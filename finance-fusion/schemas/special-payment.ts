import { z } from "zod";
import { ObjectId } from "bson";

// Helper for MongoDB ObjectId validation
const objectIdSchema = z.string().refine((id) => ObjectId.isValid(id), {
  message: "Invalid ObjectId",
});

// SpecialPayment Schema
export const SpecialPaymentSchema = z.object({
  id: z.string().optional(), // Optional for creation, will be auto-generated
  paidAmount: z.number().positive({
    message: "Paid amount must be a positive number",
  }),
  paidDate: z.coerce.date({
    required_error: "Payment date is required",
    invalid_type_error: "Invalid date format",
  }),
  reason: z.string().max(500).optional(),
  userId: objectIdSchema,
  createdAt: z.date().optional(), // Will be set automatically
  updatedAt: z.date().optional(), // Will be set automatically
});

// SpecialPayment Create Schema (without auto-generated fields)
export const CreateSpecialPaymentSchema = SpecialPaymentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// SpecialPayment Update Schema
export const UpdateSpecialPaymentSchema = SpecialPaymentSchema.partial()
  .omit({ id: true, userId: true, createdAt: true })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type SpecialPayment = z.infer<typeof SpecialPaymentSchema>;
export type CreateSpecialPayment = z.infer<typeof CreateSpecialPaymentSchema>;
export type UpdateSpecialPayment = z.infer<typeof UpdateSpecialPaymentSchema>;
