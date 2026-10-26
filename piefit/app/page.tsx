"use client";

import { useState, type FormEvent } from "react";

import { useExercises } from "@/hooks/useExercises";
import type { Exercise } from "@/services/exerciseService";

const emptyForm = {
  name: "",
  muscleGroups: "",
  equipment: "",
  description: "",
};

export default function Home() {
  const { exercises, isLoading, error, loadExercises, addExercise } = useExercises();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSaving(true);

    const exercise: Omit<Exercise, "_id"> = {
      name: form.name.trim(),
      description: form.description.trim(),
      muscleGroups: form.muscleGroups
        .split(",")
        .map((group) => group.trim())
        .filter(Boolean),
      equipment: form.equipment.trim(),
      active: true,
    };

    try {
      await addExercise(exercise);
      setForm(emptyForm);
      setIsAdding(false);
    } catch (requestError: unknown) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o exercício.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-100/95 px-4 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">
            PieFit
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Exercícios</h1>
        </header>

        <main className="flex flex-1 flex-col px-4 py-4">
          {isLoading && (
            <p role="status" className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Carregando exercícios...
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void loadExercises()}
                className="mt-3 h-12 w-full rounded-xl border border-red-300 font-semibold dark:border-red-800"
              >
                Tentar de novo
              </button>
            </div>
          )}

          {!isLoading && !error && exercises.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Nenhum exercício cadastrado ainda.
            </p>
          )}

          {!isLoading && !error && exercises.length > 0 && (
            <ul className="flex flex-col gap-3">
              {exercises.map((exercise) => (
                <li key={exercise._id}>
                  <article className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="text-lg font-semibold leading-snug">{exercise.name}</h2>
                    {exercise.description && (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {exercise.description}
                      </p>
                    )}
                    {exercise.muscleGroups.length > 0 && (
                      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {exercise.muscleGroups.join(" · ")}
                      </p>
                    )}
                    {exercise.equipment && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {exercise.equipment}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </main>

        <div className="sticky bottom-0 mt-auto border-t border-zinc-200 bg-zinc-100/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          {isAdding ? (
            <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Nome
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoFocus
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Grupos musculares
                <input
                  value={form.muscleGroups}
                  placeholder="peito, tríceps"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, muscleGroups: event.target.value }))
                  }
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Equipamento
                <input
                  maxLength={120}
                  value={form.equipment}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, equipment: event.target.value }))
                  }
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Descrição
                <textarea
                  maxLength={1000}
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
              {formError && (
                <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                  {formError}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setFormError(null);
                  }}
                  className="h-12 rounded-xl border border-zinc-300 font-semibold dark:border-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-12 rounded-xl bg-blue-600 font-semibold text-white disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white"
            >
              Adicionar exercício
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
