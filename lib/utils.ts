import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Русская плюрализация. `forms` — [для 1, для 2-4, для 0/5-20].
 * pluralRu(21, ["вопрос", "вопроса", "вопросов"]) === "вопрос"
 * pluralRu(2,  ["тест", "теста", "тестов"])      === "теста"
 * pluralRu(11, ["вопрос", "вопроса", "вопросов"]) === "вопросов"
 */
export function pluralRu(
  n: number,
  forms: readonly [string, string, string],
): string {
  const abs = Math.abs(n) % 100;
  const lastTwo = abs;
  const last = abs % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}
