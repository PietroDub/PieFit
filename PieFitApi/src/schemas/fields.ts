import { z } from "zod";

export const resourceNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be between 2 and 120 characters.")
  .max(120, "Name must be between 2 and 120 characters.");

export const descriptionSchema = z
  .string()
  .trim()
  .max(1000, "Description must be at most 1000 characters.");
