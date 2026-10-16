"use client";

import { useEffect, useState } from "react";
import { getExercises, type Exercise } from "@/services/exerciseService";

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExercises()
      .then(setExercises)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar os exercícios.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center bg-zinc-100 dark:bg-zinc-950 font-sans p-6 text-zinc-900 dark:text-zinc-100">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight border-b-2 border-zinc-300 dark:border-zinc-800 pb-4 inline-block">
          Rotina de Treinos
        </h1>
      </header>

      <section className="w-full max-w-4xl">
        {isLoading && (
          <p role="status" className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Carregando exercícios...
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        {!isLoading && !error && exercises.length === 0 && (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Nenhum exercício cadastrado ainda.
          </p>
        )}

        {!isLoading && !error && exercises.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {exercises.map((exercise) => (
              <article
                key={exercise._id}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h2 className="mb-3 border-b border-zinc-100 pb-2 text-xl font-bold text-blue-600 dark:border-zinc-800 dark:text-blue-400">
                  {exercise.name}
                </h2>
                {exercise.description && (
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {exercise.description}
                  </p>
                )}
                {exercise.muscleGroups.length > 0 && (
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                    Grupos musculares: {exercise.muscleGroups.join(", ")}
                  </p>
                )}
                {exercise.equipment && (
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Equipamento: {exercise.equipment}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
