"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createExercise,
  deleteExercise,
  getExercises,
  updateExercise,
  type Exercise,
} from "@/services/exerciseService";

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercises = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setExercises(await getExercises());
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os exercícios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExercises();
  }, [loadExercises]);

  const addExercise = useCallback(async (exercise: Omit<Exercise, "_id">) => {
    const created = await createExercise(exercise);
    setExercises((current) => [...current, created]);
    return created;
  }, []);

  const saveExercise = useCallback(async (id: string, exercise: Omit<Exercise, "_id">) => {
    const updated = await updateExercise(id, exercise);
    setExercises((current) => current.map((item) => (item._id === id ? updated : item)));
    return updated;
  }, []);

  const removeExercise = useCallback(async (id: string) => {
    await deleteExercise(id);
    setExercises((current) => current.filter((item) => item._id !== id));
  }, []);

  return { exercises, isLoading, error, loadExercises, addExercise, saveExercise, removeExercise };
}
