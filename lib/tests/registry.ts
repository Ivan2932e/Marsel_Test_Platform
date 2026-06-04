import { categories, type Category } from "./categories";
import { tierOf, type Test } from "./schema";
import { placeholderTest } from "./items/placeholder";

/**
 * Реестр всех доступных тестов.
 *
 * Чтобы добавить новый тест:
 *   1. Создать `lib/tests/items/<id>.ts` с экспортом Test, провалидированным через `parseTest`.
 *   2. Импортировать его сюда и добавить в массив `tests`.
 * Никаких изменений в компонентах или маршрутах не требуется.
 */
const tests: readonly Test[] = [placeholderTest];

export function listTests(): readonly Test[] {
  return tests;
}

export function getTestById(id: string): Test | null {
  return tests.find((t) => t.id === id) ?? null;
}

export function getAllTestIds(): string[] {
  return tests.map((t) => t.id);
}

export function listFreeTests(): readonly Test[] {
  return tests.filter((t) => tierOf(t) === "free");
}

export function listPaidTests(): readonly Test[] {
  return tests.filter((t) => tierOf(t) === "paid");
}

export function listFeaturedTests(): readonly Test[] {
  return tests.filter((t) => t.featured);
}

export type CategoryGroup = {
  category: Category | null;
  tests: readonly Test[];
};

/**
 * Группирует тесты по категориям в порядке, заданном в categories.ts.
 * Тесты без проставленного `category` уходят в группу «Без категории».
 * Категории без тестов в результат не попадают.
 */
export function listTestsByCategory(): readonly CategoryGroup[] {
  const groups: CategoryGroup[] = categories
    .map((c) => ({
      category: c,
      tests: tests.filter((t) => t.category === c.id),
    }))
    .filter((g) => g.tests.length > 0);

  const uncategorized = tests.filter(
    (t) => !t.category || !categories.some((c) => c.id === t.category),
  );
  if (uncategorized.length > 0) {
    groups.push({ category: null, tests: uncategorized });
  }

  return groups;
}
