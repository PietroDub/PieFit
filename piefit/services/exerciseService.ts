import { request } from "@/services/api";

export type Exercise = {
  _id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  active: boolean;
};

export const getExercises = () => request<Exercise[]>("/exercises");

export const getExerciseById = (id: string) => request<Exercise>(`/exercises/${id}`);

export const createExercise = (exercise: Omit<Exercise, "_id">) =>
  request<Exercise>("/exercises", {
    method: "POST",
    body: JSON.stringify(exercise),
  });

export const updateExercise = (id: string, exercise: Partial<Omit<Exercise, "_id">>) =>
  request<Exercise>(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(exercise),
  });

export const deleteExercise = (id: string) =>
  request<{ message: string }>(`/exercises/${id}`, {
    method: "DELETE",
  });
