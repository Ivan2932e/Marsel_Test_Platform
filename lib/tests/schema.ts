import { z } from "zod";

/**
 * Канонические типы данных теста.
 * Любой реальный тест Марсель добавляет файлом в lib/tests/items/<id>.ts
 * и регистрирует в lib/tests/registry.ts.
 *
 * Поля рассчитаны с заделом на будущее масштабирование платформы —
 * платные тесты, категории, признаки. Сейчас все «расширенные» поля
 * опциональны: ничего не ломает существующих заглушек, но даёт UI место,
 * куда расти, без миграций data-файлов.
 */

export const AnswerOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  value: z.number().int(),
});

export const QuestionTypeSchema = z.enum(["single", "scale", "multi"]);

export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: QuestionTypeSchema,
  options: z.array(AnswerOptionSchema).min(2),
  /** Подпись слева/справа для шкальных вопросов */
  scaleLabels: z
    .object({
      min: z.string(),
      max: z.string(),
    })
    .optional(),
});

export const CtaSchema = z.enum(["contact", "info"]);

export const ScoreRangeSchema = z
  .object({
    min: z.number(),
    max: z.number(),
    label: z.string().min(1),
    description: z.string().min(1),
    recommendation: z.string().min(1),
    cta: CtaSchema,
  })
  .refine((r) => r.min <= r.max, {
    message: "ScoreRange.min must be ≤ max",
  });

/** Уровень доступа. На бесплатных тестах сейчас всё; платные — после допсоглашения. */
export const TierSchema = z.enum(["free", "paid"]);

/** Денежная стоимость для платного теста. Опциональна. */
export const PriceSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.enum(["RUB"]),
});

/** Визуальный акцент для карточки в каталоге — без захардкоженных цветов в JSX. */
export const AccentSchema = z.enum(["sage", "clay", "sand"]);

export const TestSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    /** Свободный текст: «5 минут», «10–15 минут» */
    duration: z.string().min(1),
    /** Опциональное краткое введение, показывается на intro-экране */
    intro: z.string().optional(),
    questions: z.array(QuestionSchema).min(1),
    scoring: z.array(ScoreRangeSchema).min(1),

    // ── расширенные поля (опциональны для совместимости) ──
    /** Slug категории из categories.ts. Если нет — попадает в "Без категории". */
    category: z.string().min(1).optional(),
    /** "free" по умолчанию. */
    tier: TierSchema.optional(),
    /** Цена — обязательна для tier=paid, иначе игнорируется. */
    price: PriceSchema.optional(),
    /** Поднимает тест на верх каталога. */
    featured: z.boolean().optional(),
    /** Цветовой акцент карточки в каталоге. */
    accent: AccentSchema.optional(),
    /** Короткие метки: «когнитивный», «короткий», «на эмоции». */
    tags: z.array(z.string().min(1)).optional(),
  })
  .refine(
    (t) => {
      const ids = t.questions.map((q) => q.id);
      return new Set(ids).size === ids.length;
    },
    { message: "Question ids must be unique" },
  )
  .refine(
    (t) => {
      const sorted = [...t.scoring].sort((a, b) => a.min - b.min);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].min <= sorted[i - 1].max) return false;
      }
      return true;
    },
    { message: "ScoreRanges must not overlap" },
  )
  .refine((t) => !(t.tier === "paid" && !t.price), {
    message: "Paid tests must have a price",
  });

export type AnswerOption = z.infer<typeof AnswerOptionSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Cta = z.infer<typeof CtaSchema>;
export type ScoreRange = z.infer<typeof ScoreRangeSchema>;
export type Tier = z.infer<typeof TierSchema>;
export type Price = z.infer<typeof PriceSchema>;
export type Accent = z.infer<typeof AccentSchema>;
export type Test = z.infer<typeof TestSchema>;

export type AnswersMap = Record<string, string[]>;

export function tierOf(test: Test): Tier {
  return test.tier ?? "free";
}

export function isPaid(test: Test): boolean {
  return tierOf(test) === "paid";
}

export function calculateScore(test: Test, answers: AnswersMap): number {
  let total = 0;
  for (const q of test.questions) {
    const selected = answers[q.id] ?? [];
    for (const ans of selected) {
      const opt = q.options.find((o) => o.id === ans);
      if (opt) total += opt.value;
    }
  }
  return total;
}

export function resolveScoreRange(
  test: Test,
  score: number,
): ScoreRange | null {
  return (
    test.scoring.find((r) => score >= r.min && score <= r.max) ?? null
  );
}

export function maxPossibleScore(test: Test): number {
  let max = 0;
  for (const q of test.questions) {
    if (q.type === "multi") {
      max += q.options
        .map((o) => o.value)
        .filter((v) => v > 0)
        .reduce((a, b) => a + b, 0);
    } else {
      max += Math.max(...q.options.map((o) => o.value));
    }
  }
  return max;
}

export function parseTest(raw: unknown): Test {
  return TestSchema.parse(raw);
}
