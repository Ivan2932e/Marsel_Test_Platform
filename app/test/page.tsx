"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { TestCard } from "@/components/test/TestCard";
import { listTestsByCategory } from "@/lib/tests/registry";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function TestsCatalogPage() {
  const groups = listTestsByCategory();

  return (
    <MarketingShell>
      <main className="relative px-6 lg:px-10 pt-28 md:pt-36 pb-20 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="max-w-2xl"
          >
            <p className="text-[12.5px] uppercase tracking-[0.18em] text-sage-deep mb-4">
              Каталог тестов
            </p>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.06] text-ink text-balance">
              Выберите,
              <span className="italic text-ink-soft"> с чего хочется начать</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-ink-muted text-pretty max-w-xl">
              Каждый тест — самостоятельный. Можно проходить в любом порядке
              или один и тот же несколько раз, чтобы заметить, что меняется.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-white border border-line text-[12.5px] text-ink-muted">
              <Lock className="w-3.5 h-3.5 text-sage-deep" strokeWidth={1.6} />
              <span>Никаких данных не сохраняется</span>
            </div>
          </motion.div>

          <div className="mt-16 md:mt-20 space-y-16 md:space-y-20">
            {groups.map((group, gi) => (
              <motion.section
                key={group.category?.id ?? "uncategorized"}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...spring, delay: gi * 0.06 }}
              >
                <div className="mb-8 md:mb-10 flex items-baseline justify-between gap-6 flex-wrap">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-sage-deep">
                      Категория
                    </p>
                    <h2 className="mt-2 font-display text-[26px] sm:text-[32px] leading-tight text-ink">
                      {group.category?.label ?? "Без категории"}
                    </h2>
                    {group.category?.description ? (
                      <p className="mt-2 max-w-md text-[14px] text-ink-muted">
                        {group.category.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-mono-tabular text-[12px] text-ink-faint">
                    {group.tests.length} ·{" "}
                    {group.tests.length === 1 ? "тест" : "тестов"}
                  </span>
                </div>

                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.tests.map((t, i) => (
                    <TestCard key={t.id} test={t} index={i} />
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>

          {groups.length === 0 ? (
            <p className="mt-20 text-center text-ink-muted">
              Тесты появятся здесь, как только будут добавлены.
            </p>
          ) : null}
        </div>
      </main>
    </MarketingShell>
  );
}
