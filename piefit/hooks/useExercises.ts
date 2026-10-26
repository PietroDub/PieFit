"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createExercise,
  getExercises,
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

  return { exercises, isLoading, error, loadExercises, addExercise };
}
