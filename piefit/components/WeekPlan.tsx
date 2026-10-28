"use client";

import { useMemo, useState, type FormEvent } from "react";

import { useWorkoutPlans } from "@/hooks/useWorkoutPlans";
import type { Exercise } from "@/services/exerciseService";
import {
  WEEKDAYS,
  WEEKDAY_LABEL,
  exerciseName,
  planWithExercise,
  type Weekday,
} from "@/services/workoutPlanService";

const TODAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
  new Date().getDay()
] as Weekday;

type Props = {
  exercises: Exercise[];
};

const emptyAddition = {
  dayName: "",
  exerciseId: "",
  sets: "3",
  minReps: "",
  maxReps: "",
  targetWeight: "",
  restSeconds: "",
};

export function WeekPlan({ exercises }: Props) {
  const { plans, isLoading, error, loadPlans, addPlan, savePlan } = useWorkoutPlans();
  const [planId, setPlanId] = useState<string | null>(null);
  const [weekday, setWeekday] = useState<Weekday>(TODAY);
  const [isCreating, setIsCreating] = useState(false);
  const [planName, setPlanName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyAddition);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const plan = useMemo(
    () => plans.find((item) => item._id === planId) ?? plans.find((item) => item.active) ?? plans[0],
    [planId, plans],
  );
  const day = plan?.days.find((item) => item.weekday === weekday);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSaving(true);

    try {
      const created = await addPlan(planName.trim());
      setPlanId(created._id);
      setPlanName("");
      setIsCreating(false);
    } catch (requestError: unknown) {
      setFormError(
        requestError instanceof Error ? requestError.message : "Não foi possível criar a semana.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!plan) {
      return;
    }

    const sets = Number(form.sets);
    const minReps = optionalNumber(form.minReps);
    const maxReps = optionalNumber(form.maxReps);
    const targetWeight = optionalNumber(form.targetWeight);
    const restSeconds = optionalNumber(form.restSeconds);

    if (!form.exerciseId || !Number.isInteger(sets) || sets < 1) {
      setFormError("Escolha um exercício e informe as séries.");
      return;
    }

    if (minReps !== undefined && maxReps !== undefined && maxReps < minReps) {
      setFormError("A repetição máxima precisa ser maior ou igual à mínima.");
      return;
    }

    setFormError(null);
    setIsSaving(true);

    try {
      const updated = await savePlan(
        plan._id,
        planWithExercise(plan, {
          weekday,
          dayName: form.dayName.trim(),
          exerciseId: form.exerciseId,
          sets,
          ...(minReps === undefined ? {} : { minReps }),
          ...(maxReps === undefined ? {} : { maxReps }),
          ...(targetWeight === undefined ? {} : { targetWeight }),
          ...(restSeconds === undefined ? {} : { restSeconds }),
        }),
      );
      setPlanId(updated._id);
      setForm(emptyAddition);
      setIsAdding(false);
    } catch (requestError: unknown) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar o dia.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <main className="flex flex-1 flex-col px-4 py-4">
        {isLoading && (
          <p role="status" className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Carregando semana...
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
              onClick={() => void loadPlans()}
              className="mt-3 h-12 w-full rounded-xl border border-red-300 font-semibold dark:border-red-800"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {!isLoading && !error && !plan && (
          <p className="py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Nenhuma semana cadastrada ainda.
          </p>
        )}

        {!isLoading && !error && plan && (
          <div className="flex flex-col gap-4">
            {plans.length > 1 && (
              <label className="flex flex-col gap-1 text-sm font-medium">
                Semana
                <select
                  value={plan._id}
                  onChange={(event) => setPlanId(event.target.value)}
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                >
                  {plans.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {plans.length === 1 && <h2 className="text-lg font-semibold">{plan.name}</h2>}

            <div className="flex gap-2 overflow-x-auto pb-1">
              {WEEKDAYS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setWeekday(item)}
                  className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${
                    item === weekday
                      ? "bg-blue-600 text-white"
                      : "border border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {WEEKDAY_LABEL[item]}
                </button>
              ))}
            </div>

            {!day || day.exercises.length === 0 ? (
              <p className="py-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Nada em {WEEKDAY_LABEL[weekday].toLowerCase()}.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {day.name && <h3 className="text-base font-semibold">{day.name}</h3>}
                {day.exercises.map((item, index) => (
                  <li key={`${exerciseIdOf(item.exercise)}-${index}`}>
                    <article className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="text-lg font-semibold leading-snug">
                        {exerciseName(item.exercise)}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {formatPrescription(item)}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <div className="sticky bottom-0 mt-auto border-t border-zinc-200 bg-zinc-100/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        {!plan || isCreating ? (
          <form onSubmit={(event) => void handleCreate(event)} className="flex flex-col gap-3">
            {isCreating && (
              <label className="flex flex-col gap-1 text-sm font-medium">
                Nome da semana
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  autoFocus
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
            )}
            {formError && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                {formError}
              </p>
            )}
            {isCreating ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
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
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white"
              >
                Criar semana
              </button>
            )}
          </form>
        ) : isAdding ? (
          <form onSubmit={(event) => void handleAdd(event)} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Exercício
              <select
                required
                value={form.exerciseId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, exerciseId: event.target.value }))
                }
                className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Selecione</option>
                {exercises.map((exercise) => (
                  <option key={exercise._id} value={exercise._id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Nome do dia
              <input
                maxLength={120}
                value={form.dayName}
                placeholder={day?.name || "Peito"}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dayName: event.target.value }))
                }
                className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Séries"
                value={form.sets}
                min={1}
                onChange={(sets) => setForm((current) => ({ ...current, sets }))}
              />
              <NumberField
                label="Carga"
                value={form.targetWeight}
                min={0}
                onChange={(targetWeight) => setForm((current) => ({ ...current, targetWeight }))}
              />
              <NumberField
                label="Reps mín."
                value={form.minReps}
                min={1}
                onChange={(minReps) => setForm((current) => ({ ...current, minReps }))}
              />
              <NumberField
                label="Reps máx."
                value={form.maxReps}
                min={1}
                onChange={(maxReps) => setForm((current) => ({ ...current, maxReps }))}
              />
            </div>
            {exercises.length === 0 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Cadastre um exercício antes de montar o dia.
              </p>
            )}
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
                disabled={isSaving || exercises.length === 0}
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
            Incluir em {WEEKDAY_LABEL[weekday].toLowerCase()}
          </button>
        )}
      </div>
    </>
  );
}

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <input
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-xl border border-zinc-300 bg-white px-3 text-base font-normal dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}

function optionalNumber(value: string) {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function exerciseIdOf(exercise: string | Exercise) {
  return typeof exercise === "string" ? exercise : exercise._id;
}

function formatPrescription(item: {
  sets: number;
  minReps?: number;
  maxReps?: number;
  targetWeight?: number;
  restSeconds?: number;
}) {
  const reps =
    item.minReps !== undefined && item.maxReps !== undefined
      ? `${item.minReps}–${item.maxReps} reps`
      : item.minReps !== undefined
        ? `${item.minReps} reps`
        : item.maxReps !== undefined
          ? `${item.maxReps} reps`
          : null;
  const parts = [`${item.sets} séries`, reps, item.targetWeight !== undefined ? `${item.targetWeight} kg` : null];

  return parts.filter(Boolean).join(" · ");
}
