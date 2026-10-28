import type { Exercise } from "@/services/exerciseService";
import { request } from "@/services/api";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export type PlannedExercise = {
  exercise: string | Exercise;
  order: number;
  sets: number;
  minReps?: number;
  maxReps?: number;
  targetWeight?: number;
  restSeconds?: number;
  notes?: string;
};

export type WorkoutDay = {
  weekday: Weekday;
  name: string;
  exercises: PlannedExercise[];
};

export type WorkoutPlan = {
  _id: string;
  name: string;
  description: string;
  active: boolean;
  days: WorkoutDay[];
};

export type WorkoutPlanInput = {
  name: string;
  description?: string;
  active?: boolean;
  days?: WorkoutDayInput[];
};

type WorkoutDayInput = {
  weekday: Weekday;
  name: string;
  exercises: PlannedExerciseInput[];
};

type PlannedExerciseInput = {
  exercise: string;
  order: number;
  sets: number;
  minReps?: number;
  maxReps?: number;
  targetWeight?: number;
  restSeconds?: number;
  notes: string;
};

export type DayExerciseInput = {
  weekday: Weekday;
  dayName: string;
  exerciseId: string;
  sets: number;
  minReps?: number;
  maxReps?: number;
  targetWeight?: number;
  restSeconds?: number;
};

export function exerciseId(exercise: PlannedExercise["exercise"]) {
  return typeof exercise === "string" ? exercise : exercise._id;
}

export function exerciseName(exercise: PlannedExercise["exercise"]) {
  return typeof exercise === "string" ? "Exercício" : exercise.name;
}

export function planWithExercise(plan: WorkoutPlan, addition: DayExerciseInput): WorkoutPlanInput {
  const days = plan.days.map((day) => ({
    weekday: day.weekday,
    name: day.name,
    exercises: day.exercises.map((item, index) => toInputExercise(item, index)),
  }));

  const planned = toAddedExercise(addition);
  const dayIndex = days.findIndex((day) => day.weekday === addition.weekday);

  if (dayIndex === -1) {
    days.push({
      weekday: addition.weekday,
      name: addition.dayName,
      exercises: [{ ...planned, order: 0 }],
    });
  } else {
    const day = days[dayIndex];

    if (day) {
      days[dayIndex] = {
        weekday: day.weekday,
        name: addition.dayName || day.name,
        exercises: [...day.exercises, { ...planned, order: day.exercises.length }],
      };
    }
  }

  return {
    name: plan.name,
    description: plan.description,
    active: plan.active,
    days,
  };
}

function toAddedExercise(addition: DayExerciseInput): PlannedExerciseInput {
  return {
    exercise: addition.exerciseId,
    order: 0,
    sets: addition.sets,
    notes: "",
    ...(addition.minReps === undefined ? {} : { minReps: addition.minReps }),
    ...(addition.maxReps === undefined ? {} : { maxReps: addition.maxReps }),
    ...(addition.targetWeight === undefined ? {} : { targetWeight: addition.targetWeight }),
    ...(addition.restSeconds === undefined ? {} : { restSeconds: addition.restSeconds }),
  };
}

function toInputExercise(item: PlannedExercise, order: number): PlannedExerciseInput {
  return {
    exercise: exerciseId(item.exercise),
    order,
    sets: item.sets,
    notes: item.notes ?? "",
    ...(item.minReps === undefined ? {} : { minReps: item.minReps }),
    ...(item.maxReps === undefined ? {} : { maxReps: item.maxReps }),
    ...(item.targetWeight === undefined ? {} : { targetWeight: item.targetWeight }),
    ...(item.restSeconds === undefined ? {} : { restSeconds: item.restSeconds }),
  };
}

export const getWorkoutPlans = () => request<WorkoutPlan[]>("/workout-plans");

export const createWorkoutPlan = (plan: WorkoutPlanInput) =>
  request<WorkoutPlan>("/workout-plans", {
    method: "POST",
    body: JSON.stringify(plan),
  });

export const updateWorkoutPlan = (id: string, plan: WorkoutPlanInput) =>
  request<WorkoutPlan>(`/workout-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(plan),
  });
