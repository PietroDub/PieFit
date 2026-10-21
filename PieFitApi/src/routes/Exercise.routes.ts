import { Router } from "express";

import ExerciseController from "../controllers/ExerciseController.js";
import { validateBody } from "../http/validateBody.js";
import {
  createExerciseSchema,
  updateExerciseSchema,
} from "../schemas/exerciseSchema.js";

const exerciseRoutes = Router();

exerciseRoutes.get("/", ExerciseController.getExercises);
exerciseRoutes.get("/:id", ExerciseController.getExerciseById);
exerciseRoutes.post("/", validateBody(createExerciseSchema), ExerciseController.createExercise);
exerciseRoutes.put(
  "/:id",
  validateBody(updateExerciseSchema),
  ExerciseController.updateExercise,
);
exerciseRoutes.delete("/:id", ExerciseController.deleteExercise);

export default exerciseRoutes;
