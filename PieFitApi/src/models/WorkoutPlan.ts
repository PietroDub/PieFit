import { model, models, Schema } from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

import { WEEKDAYS } from "../constants/weekdays.js";

const plannedExerciseSchema = new Schema({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  order: {
    type: Number,
    required: true,
    min: 0,
  },
  sets: {
    type: Number,
    required: true,
    min: 1,
  },
  minReps: {
    type: Number,
    min: 1,
  },
  maxReps: {
    type: Number,
    min: 1,
    validate: {
      validator(this: { minReps?: number }, value?: number) {
        return value === undefined || this.minReps === undefined || value >= this.minReps;
      },
      message: "maxReps must be greater than or equal to minReps.",
    },
  },
  targetWeight: {
    type: Number,
    min: 0,
  },
  restSeconds: {
    type: Number,
    min: 0,
  },
  notes: {
    type: String,
    default: "",
    trim: true,
    maxlength: 500,
  },
});

const workoutDaySchema = new Schema({
  weekday: {
    type: String,
    enum: WEEKDAYS,
    required: true,
  },
  name: {
    type: String,
    default: "",
    trim: true,
    maxlength: 120,
  },
  exercises: {
    type: [plannedExerciseSchema],
    default: [],
  },
});

const workoutPlanSchema = new Schema(
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
    active: {
      type: Boolean,
      default: true,
    },
    days: {
      type: [workoutDaySchema],
      default: [],
      validate: {
        validator(days: Array<{ weekday: string }>) {
          return new Set(days.map((day) => day.weekday)).size === days.length;
        },
        message: "A workout plan cannot contain the same weekday more than once.",
      },
    },
  },
  {
    timestamps: true,
  },
);

export type WorkoutPlan = InferSchemaType<typeof workoutPlanSchema>;

const existingWorkoutPlanModel = models.WorkoutPlan as
  | Model<WorkoutPlan>
  | undefined;

export const WorkoutPlanModel: Model<WorkoutPlan> =
  existingWorkoutPlanModel ??
  model<WorkoutPlan>("WorkoutPlan", workoutPlanSchema);
