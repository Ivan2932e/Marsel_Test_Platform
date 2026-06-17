"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ListChecks,
  Lock,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { TestCard } from "@/components/test/TestCard";
import { listTestsByCategory } from "@/lib/tests/registry";
import { pluralRu } from "@/lib/utils";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function HomePage() {
  return (
    <MarketingShell>
      <Hero />
      <Principles />
      <TestsCatalog />
    </MarketingShell>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden grain"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-sand/40 blur-3xl" />
        <div className="absolute top-40 -right-32 w-[480px] h-[480px] rounded-full bg-sage-light/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-white border border-line text-[12.5px] text-ink-muted mb-7 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-sage" />
              <span>Самопроверка без регистрации и сбора данных</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.15 }}
              className="font-display text-[clamp(2.4rem,6.4vw,4.2rem)] leading-[1.04] tracking-tight text-ink text-balance"
            >
              Небольшая пауза,
              <br />
              <span className="italic text-ink-soft">чтобы услышать себя</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.32 }}
              className="mt-6 md:mt-7 max-w-xl text-[16px] md:text-[18px] leading-[1.55] text-ink-soft text-pretty"
            >
              Короткие тесты, чтобы заметить, что происходит у вас внутри —
              без оценок, диагнозов и «правильных» ответов. Не замена терапии,
              а способ навести фокус.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
              className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button asChild size="lg">
                <Link href="#tests">
                  Выбрать тест
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/test">Все категории</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-10 md:mt-12 flex items-center gap-3 text-[13px] text-ink-muted"
            >
              <Lock className="w-3.5 h-3.5 text-sage-deep" strokeWidth={1.6} />
              <span>Ответы остаются на вашем устройстве</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.25 }}
            className="relative mx-auto lg:mx-0 w-full max-w-[420px] lg:max-w-none"
          >
            <div className="relative aspect-[4/5] rounded-[40%_60%_55%_45%/50%_45%_55%_50%] overflow-hidden ring-soft bg-gradient-to-br from-sand/60 via-warm-white to-sage-light/30">
              <div className="absolute inset-0 grain opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <p className="font-display italic text-[22px] sm:text-[26px] leading-snug text-ink-soft text-center text-balance">
                  «Иногда заметить —
                  <br />
                  уже половина дела»
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.7 }}
              className="absolute -bottom-4 -left-2 md:-left-6 bg-warm-white border border-line rounded-2xl px-5 py-4 ring-soft max-w-[230px]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-sage" />
                <span className="text-[12px] text-ink-muted">
                  без регистрации
                </span>
              </div>
              <p className="font-display text-[17px] leading-snug text-ink">
                3–10 минут, и в любой момент можно прерваться
              </p>
            </motion.div>

            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-sage/15 backdrop-blur-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const items = [
    {
      icon: <Lock className="h-4 w-4" strokeWidth={1.6} />,
      eyebrow: "01",
      title: "Ничего не сохраняется",
      text: "Ответы существуют только в вашем браузере и удаляются сразу после результата. На сервере — пусто.",
    },
    {
      icon: <Timer className="h-4 w-4" strokeWidth={1.6} />,
      eyebrow: "02",
      title: "3–10 минут",
      text: "Можно пройти на ходу, в очереди или вечером. Прерваться и продолжить — тоже можно, прогресс держится во вкладке.",
    },
    {
      icon: <ListChecks className="h-4 w-4" strokeWidth={1.6} />,
      eyebrow: "03",
      title: "Понятный результат",
      text: "Без терминов и шкал — короткое описание состояния и человеческая рекомендация, что с этим делать.",
    },
  ];

  return (
    <section className="relative px-6 lg:px-10 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ...spring }}
          className="max-w-2xl mb-14 md:mb-20"
        >
          <p className="text-[12.5px] uppercase tracking-[0.18em] text-sage-deep mb-4">
            Как это устроено
          </p>
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.08] text-ink text-balance">
            Никаких аккаунтов и форм.
            <br />
            <span className="italic text-ink-soft">Только вы и текст.</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.eyebrow}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...spring, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-line bg-warm-white p-7 ring-soft transition-shadow duration-300 hover:ring-soft-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tabular text-[12px] text-ink-faint">
                  {it.eyebrow}
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage/10 text-sage-deep">
                  {it.icon}
                </span>
              </div>
              <h3 className="mt-7 font-display text-xl leading-snug text-ink">
                {it.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted text-pretty">
                {it.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestsCatalog() {
  const groups = listTestsByCategory();
  const total = groups.reduce((acc, g) => acc + g.tests.length, 0);

  return (
    <section id="tests" className="relative px-6 lg:px-10 pb-24 md:pb-32 scroll-mt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={spring}
          className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap"
        >
          <div className="max-w-xl">
            <p className="text-[12.5px] uppercase tracking-[0.18em] text-sage-deep mb-4">
              Доступные тесты
            </p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.08] text-ink text-balance">
              Выберите,
              <span className="italic text-ink-soft"> с чего хочется начать</span>
            </h2>
          </div>
          {total > 0 ? (
            <span className="font-mono-tabular text-[12px] text-ink-faint">
              {total} · {pluralRu(total, ["тест", "теста", "тестов"])}
            </span>
          ) : null}
        </motion.div>

        {groups.length === 0 ? (
          <p className="text-center text-ink-muted py-12">
            Тесты появятся здесь, как только будут добавлены.
          </p>
        ) : (
          <div className="space-y-14 md:space-y-20">
            {groups.map((group, gi) => (
              <motion.div
                key={group.category?.id ?? "uncategorized"}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ...spring, delay: gi * 0.06 }}
              >
                <div className="mb-7 md:mb-9 flex items-baseline justify-between gap-6 flex-wrap">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-sage-deep">
                      Категория
                    </p>
                    <h3 className="mt-2 font-display text-[22px] sm:text-[26px] leading-tight text-ink">
                      {group.category?.label ?? "Без категории"}
                    </h3>
                    {group.category?.description ? (
                      <p className="mt-2 max-w-md text-[13.5px] text-ink-muted">
                        {group.category.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-mono-tabular text-[12px] text-ink-faint">
                    {group.tests.length} ·{" "}
                    {pluralRu(group.tests.length, [
                      "тест",
                      "теста",
                      "тестов",
                    ])}
                  </span>
                </div>

                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.tests.map((t, i) => (
                    <TestCard key={t.id} test={t} index={i} />
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
