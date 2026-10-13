import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController.js";

const exerciseRoutes = Router();

exerciseRoutes.get("/", ExerciseController.getExercises);
exerciseRoutes.get("/:id", ExerciseController.getExerciseById);
exerciseRoutes.post("/", ExerciseController.createExercise);
exerciseRoutes.put("/:id", ExerciseController.updateExercise);
exerciseRoutes.delete("/:id", ExerciseController.deleteExercise);
