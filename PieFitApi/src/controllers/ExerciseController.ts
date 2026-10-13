import type { Request, Response } from "express";

import { ExerciseModel } from "../models/Exercise.js";

export default class ExerciseController {
  static async getExercises(_req: Request, res: Response) {
    try {
      const exercises = await ExerciseModel.find();

      return res.status(200).json(exercises);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching exercises",
        error,
      });
    }
  }

  static async getExerciseById(req: Request, res: Response) {
    try {
      const exercise = await ExerciseModel.findById(req.params.id);

      if (!exercise) {
        return res.status(404).json({
          message: "Exercise not found",
        });
      }

      return res.status(200).json(exercise);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching exercise",
        error,
      });
    }
  }

  static async createExercise(req: Request, res: Response) {
    try {
      const newExercise = new ExerciseModel(req.body);
      const savedExercise = await newExercise.save();

      return res.status(201).json(savedExercise);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating exercise",
        error,
      });
    }
  }

  static async updateExercise(req: Request, res: Response) {
    try {
      const updatedExercise = await ExerciseModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );

      if (!updatedExercise) {
        return res.status(404).json({
          message: "Exercise not found",
        });
      }

      return res.status(200).json(updatedExercise);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating exercise",
        error,
      });
    }
  }

  static async deleteExercise(req: Request, res: Response) {
    try {
      const deletedExercise = await ExerciseModel.findByIdAndDelete(req.params.id);

      if (!deletedExercise) {
        return res.status(404).json({
          message: "Exercise not found",
        });
      }

      return res.status(200).json({
        message: "Exercise deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting exercise",
        error,
      });
    }
  }
}