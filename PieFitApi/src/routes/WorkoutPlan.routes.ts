import { Router } from "express";

import WorkoutPlanController from "../controllers/WorkoutPlanController.js";
import { validateBody } from "../http/validateBody.js";
import {
  createWorkoutPlanSchema,
  updateWorkoutPlanSchema,
} from "../schemas/workoutPlanSchema.js";

const workoutPlanRoutes = Router();

workoutPlanRoutes.get("/", WorkoutPlanController.getWorkoutPlans);
workoutPlanRoutes.get("/:id", WorkoutPlanController.getWorkoutPlanById);
workoutPlanRoutes.post(
  "/",
  validateBody(createWorkoutPlanSchema),
  WorkoutPlanController.createWorkoutPlan,
);
workoutPlanRoutes.put(
  "/:id",
  validateBody(updateWorkoutPlanSchema),
  WorkoutPlanController.updateWorkoutPlan,
);
workoutPlanRoutes.delete("/:id", WorkoutPlanController.deleteWorkoutPlan);

export default workoutPlanRoutes;
