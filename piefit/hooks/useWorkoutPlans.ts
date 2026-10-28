"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createWorkoutPlan,
  getWorkoutPlans,
  updateWorkoutPlan,
  type WorkoutPlan,
  type WorkoutPlanInput,
} from "@/services/workoutPlanService";

export function useWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setPlans(await getWorkoutPlans());
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar a semana.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const addPlan = useCallback(async (name: string) => {
    const created = await createWorkoutPlan({
      name,
      description: "",
      active: true,
      days: [],
    });
    setPlans((current) => [...current, created]);
    return created;
  }, []);

  const savePlan = useCallback(async (id: string, plan: WorkoutPlanInput) => {
    const updated = await updateWorkoutPlan(id, plan);
    setPlans((current) => current.map((item) => (item._id === id ? updated : item)));
    return updated;
  }, []);

  return { plans, isLoading, error, loadPlans, addPlan, savePlan };
}
