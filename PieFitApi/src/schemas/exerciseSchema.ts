import { z } from "zod";

import { descriptionSchema, resourceNameSchema } from "./fields.js";

export const createExerciseSchema = z.object({
  name: resourceNameSchema,
  description: descriptionSchema.default(""),
  muscleGroups: z.array(z.string()).default([]),
  equipment: z
    .string()
    .trim()
    .max(120, "Equipment must be at most 120 characters.")
    .default(""),
  active: z.boolean().default(true),
});

export const updateExerciseSchema = z.object({
  name: resourceNameSchema.optional(),
  description: descriptionSchema.optional(),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z
    .string()
    .trim()
    .max(120, "Equipment must be at most 120 characters.")
    .optional(),
  active: z.boolean().optional(),
});
