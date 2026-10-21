import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

const { model, models, Schema } = mongoose;

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

const existingExerciseModel = models.Exercise as
  | Model<Exercise>
  | undefined;

export const ExerciseModel: Model<Exercise> =
  existingExerciseModel ??
  model<Exercise>("Exercise", exerciseSchema);