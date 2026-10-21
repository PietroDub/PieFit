import { z } from "zod";

import { WEEKDAYS } from "../constants/weekdays.js";
import { descriptionSchema, resourceNameSchema } from "./fields.js";

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id.");

const plannedExerciseSchema = z
  .object({
    exercise: objectIdSchema,
    order: z.number().min(0, "Order must be at least 0."),
    sets: z.number().min(1, "Sets must be at least 1."),
    minReps: z.number().min(1, "minReps must be at least 1.").optional(),
    maxReps: z.number().min(1, "maxReps must be at least 1.").optional(),
    targetWeight: z.number().min(0, "targetWeight must be at least 0.").optional(),
    restSeconds: z.number().min(0, "restSeconds must be at least 0.").optional(),
    notes: z
      .string()
      .trim()
      .max(500, "Notes must be at most 500 characters.")
      .default(""),
  })
  .superRefine((value, ctx) => {
    if (
      value.maxReps !== undefined &&
      value.minReps !== undefined &&
      value.maxReps < value.minReps
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxReps"],
        message: "maxReps must be greater than or equal to minReps.",
      });
    }
  });

const workoutDaySchema = z.object({
  weekday: z.enum(WEEKDAYS, { message: "Weekday must be a day of the week." }),
  name: z
    .string()
    .trim()
    .max(120, "Name must be at most 120 characters.")
    .default(""),
  exercises: z.array(plannedExerciseSchema).default([]),
});

function rejectDuplicateWeekdays(
  days: Array<{ weekday: string }> | undefined,
  ctx: z.RefinementCtx,
) {
  if (days === undefined) {
    return;
  }

  const weekdays = days.map((day) => day.weekday);

  if (new Set(weekdays).size !== weekdays.length) {
    ctx.addIssue({
      code: "custom",
      path: ["days"],
      message: "A workout plan cannot contain the same weekday more than once.",
    });
  }
}

export const createWorkoutPlanSchema = z
  .object({
    name: resourceNameSchema,
    description: descriptionSchema.default(""),
    active: z.boolean().default(true),
    days: z.array(workoutDaySchema).default([]),
  })
  .superRefine((value, ctx) => {
    rejectDuplicateWeekdays(value.days, ctx);
  });

export const updateWorkoutPlanSchema = z
  .object({
    name: resourceNameSchema.optional(),
    description: descriptionSchema.optional(),
    active: z.boolean().optional(),
    days: z.array(workoutDaySchema).optional(),
  })
  .superRefine((value, ctx) => {
    rejectDuplicateWeekdays(value.days, ctx);
  });
