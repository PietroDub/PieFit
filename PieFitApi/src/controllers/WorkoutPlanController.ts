import type { Request, Response } from "express";

import { WorkoutPlanModel } from "../models/WorkoutPlan.js";

export default class WorkoutPlanController {
  static async getWorkoutPlans(_req: Request, res: Response) {
    try {
      const workoutPlans = await WorkoutPlanModel.find().populate(
        "days.exercises.exercise",
      );

      return res.status(200).json(workoutPlans);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching workout plans",
        error,
      });
    }
  }

  static async getWorkoutPlanById(req: Request, res: Response) {
    try {
      const workoutPlan = await WorkoutPlanModel.findById(req.params.id).populate(
        "days.exercises.exercise",
      );

      if (!workoutPlan) {
        return res.status(404).json({
          message: "Workout plan not found",
        });
      }

      return res.status(200).json(workoutPlan);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching workout plan",
        error,
      });
    }
  }

  static async createWorkoutPlan(req: Request, res: Response) {
    try {
      const newWorkoutPlan = new WorkoutPlanModel(req.body);
      const savedWorkoutPlan = await newWorkoutPlan.save();
      await savedWorkoutPlan.populate("days.exercises.exercise");

      return res.status(201).json(savedWorkoutPlan);
    } catch (error) {
      return res.status(500).json({
        message: "Error creating workout plan",
        error,
      });
    }
  }

  static async updateWorkoutPlan(req: Request, res: Response) {
    try {
      const updatedWorkoutPlan = await WorkoutPlanModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      ).populate("days.exercises.exercise");

      if (!updatedWorkoutPlan) {
        return res.status(404).json({
          message: "Workout plan not found",
        });
      }

      return res.status(200).json(updatedWorkoutPlan);
    } catch (error) {
      return res.status(500).json({
        message: "Error updating workout plan",
        error,
      });
    }
  }

  static async deleteWorkoutPlan(req: Request, res: Response) {
    try {
      const deletedWorkoutPlan = await WorkoutPlanModel.findByIdAndDelete(
        req.params.id,
      );

      if (!deletedWorkoutPlan) {
        return res.status(404).json({
          message: "Workout plan not found",
        });
      }

      return res.status(200).json({
        message: "Workout plan deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting workout plan",
        error,
      });
    }
  }
}
