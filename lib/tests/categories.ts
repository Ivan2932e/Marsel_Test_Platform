/**
 * Категории тестов. Свободно расширяются — добавил slug сюда,
 * проставил `category` у нужных тестов в lib/tests/items/*, и они
 * сгруппируются автоматически на странице каталога.
 *
 * Категория без зарегистрированных тестов в каталог не попадает.
 */
export type Category = {
  /** Slug используется в URL и в поле `category` у теста. */
  id: string;
  label: string;
  /** Короткое описание для группы в каталоге. */
  description: string;
};

export const categories: readonly Category[] = [
  {
    id: "self",
    label: "Про себя",
    description:
      "Самопонимание, ценности, опора. Тесты на «как у меня сейчас».",
  },
  {
    id: "emotions",
    label: "Эмоции и состояние",
    description: "Тревога, выгорание, настроение. Поймать, что фоном.",
  },
  {
    id: "relations",
    label: "Отношения",
    description:
      "Близость, привязанность, конфликты. С собой и с другими.",
  },
] as const;

const byId = new Map(categories.map((c) => [c.id, c] as const));

export function getCategoryById(id: string): Category | null {
  return byId.get(id) ?? null;
}
