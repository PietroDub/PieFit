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
  exercise: string | Exercise | null;
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
  if (typeof exercise === "string") {
    return exercise;
  }

  return exercise?._id ?? "";
}

export function exerciseName(exercise: PlannedExercise["exercise"]) {
  if (exercise == null || typeof exercise === "string") {
    return "Exercício";
  }

  return exercise.name;
}

export function planWithExercise(plan: WorkoutPlan, addition: DayExerciseInput): WorkoutPlanInput {
  return updateWeekday(plan, addition.weekday, (day) => {
    const exercises = day?.exercises ?? [];

    return {
      name: addition.dayName,
      exercises: [...exercises, plannedFromAddition(addition, exercises.length)],
    };
  });
}

export function planReplacingExercise(
  plan: WorkoutPlan,
  index: number,
  addition: DayExerciseInput,
): WorkoutPlanInput {
  return updateWeekday(plan, addition.weekday, (day) => {
    const exercises = day?.exercises ?? [];
    const current = exercises[index];

    if (!current) {
      return {
        name: addition.dayName,
        exercises: [...exercises, plannedFromAddition(addition, exercises.length)],
      };
    }

    return {
      name: addition.dayName,
      exercises: exercises.map((item, itemIndex) =>
        itemIndex === index ? plannedFromAddition(addition, itemIndex, item) : item,
      ),
    };
  });
}

export function planWithoutExercise(
  plan: WorkoutPlan,
  weekday: Weekday,
  index: number,
): WorkoutPlanInput {
  return updateWeekday(plan, weekday, (day) => ({
    name: day?.name ?? "",
    exercises: (day?.exercises ?? []).filter((_, itemIndex) => itemIndex !== index),
  }));
}

function updateWeekday(
  plan: WorkoutPlan,
  weekday: Weekday,
  change: (day: WorkoutDay | undefined) => { name: string; exercises: PlannedExercise[] },
): WorkoutPlanInput {
  const existing = plan.days.find((day) => day.weekday === weekday);
  const nextDay = change(existing);
  const days = plan.days.filter((day) => day.weekday !== weekday);

  days.push({
    weekday,
    name: nextDay.name,
    exercises: nextDay.exercises,
  });

  return {
    name: plan.name,
    description: plan.description,
    active: plan.active,
    days: days.map(dayToInput),
  };
}

function plannedFromAddition(
  addition: DayExerciseInput,
  order: number,
  existing?: PlannedExercise,
): PlannedExercise {
  return {
    exercise: addition.exerciseId,
    order,
    sets: addition.sets,
    notes: existing?.notes ?? "",
    ...(addition.minReps === undefined ? {} : { minReps: addition.minReps }),
    ...(addition.maxReps === undefined ? {} : { maxReps: addition.maxReps }),
    ...(addition.targetWeight === undefined ? {} : { targetWeight: addition.targetWeight }),
    ...(addition.restSeconds !== undefined
      ? { restSeconds: addition.restSeconds }
      : existing?.restSeconds === undefined
        ? {}
        : { restSeconds: existing.restSeconds }),
  };
}

function dayToInput(day: WorkoutDay): WorkoutDayInput {
  return {
    weekday: day.weekday,
    name: day.name,
    exercises: day.exercises.flatMap((item) => {
      const id = exerciseId(item.exercise);

      if (!id) {
        return [];
      }

      return [toInputExercise(item, id)];
    }).map((item, order) => ({ ...item, order })),
  };
}

function toInputExercise(item: PlannedExercise, id: string): PlannedExerciseInput {
  return {
    exercise: id,
    order: item.order,
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
