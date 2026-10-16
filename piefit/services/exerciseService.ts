export type Exercise = {
  _id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string;
  active: boolean;
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
  .replace(/\/$/, "");

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

  if (!response.ok) {
    throw new Error(`A API retornou um erro (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export function getExercises(): Promise<Exercise[]> {
  return request<Exercise[]>("/exercises");
}

export function getExerciseById(id: string): Promise<Exercise> {
  return request<Exercise>(`/exercises/${encodeURIComponent(id)}`);
}

export function createExercise(exercise: Omit<Exercise, "_id">): Promise<Exercise> {
  return request<Exercise>("/exercises", {
    method: "POST",
    body: JSON.stringify(exercise),
  });
}

export function updateExercise(
  id: string,
  exercise: Partial<Omit<Exercise, "_id">>,
): Promise<Exercise> {
  return request<Exercise>(`/exercises/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(exercise),
  });
}

export function deleteExercise(id: string): Promise<void> {
  return request<void>(`/exercises/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
