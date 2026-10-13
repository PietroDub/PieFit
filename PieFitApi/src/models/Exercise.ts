import { model, models, Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    muscleGroups: {
      type: [String],
      default: [],
    },
    equipment: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

exerciseSchema.index({ name: 1 });

export type Exercise = InferSchemaType<typeof exerciseSchema>;

export const ExerciseModel =
  models.Exercise ?? model<Exercise>("Exercise", exerciseSchema);
