import { ObjectId } from "bson";
import { z } from "zod";

const objectIdSchema = z.string().refine((id) => ObjectId.isValid(id), {
  message: "Invalid ObjectId",
});
// Challenge Schema
export const ChallengeSchema = z.object({
  id: z.string().optional(), // Optional for creation
  challenge: z
    .string()
    .min(3, {
      message: "Challenge description must be at least 3 characters",
    })
    .max(500, {
      message: "Challenge description must be less than 500 characters",
    }),
  challengeEnd: z.coerce.date().nullable().optional(),
  userId: objectIdSchema,
  completed: z.boolean().default(false),
  createdAt: z.date().optional(), // Will be set automatically
  updatedAt: z.date().optional(), // Will be set automatically
});

// Challenge Create Schema (without auto-generated fields)
export const CreateChallengeSchema = ChallengeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Challenge Update Schema
export const UpdateChallengeSchema = ChallengeSchema.partial()
  .omit({ id: true, userId: true, createdAt: true })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type Challenge = z.infer<typeof ChallengeSchema>;
export type CreateChallenge = z.infer<typeof CreateChallengeSchema>;
export type UpdateChallenge = z.infer<typeof UpdateChallengeSchema>;
