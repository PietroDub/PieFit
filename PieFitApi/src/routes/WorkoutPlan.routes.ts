import { Router } from "express";

import WorkoutPlanController from "../controllers/WorkoutPlanController.js";

const workoutPlanRoutes = Router();

workoutPlanRoutes.get("/", WorkoutPlanController.getWorkoutPlans);
workoutPlanRoutes.get("/:id", WorkoutPlanController.getWorkoutPlanById);
workoutPlanRoutes.post("/", WorkoutPlanController.createWorkoutPlan);
workoutPlanRoutes.put("/:id", WorkoutPlanController.updateWorkoutPlan);
workoutPlanRoutes.delete("/:id", WorkoutPlanController.deleteWorkoutPlan);

export default workoutPlanRoutes;
