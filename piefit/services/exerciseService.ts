export type Exercise = {
  _id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  active: boolean;
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(
  /\/$/,
  "",
);

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se ela está disponível.");
  }

  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "Não foi possível completar a operação.");
  }

  return data;
}

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
