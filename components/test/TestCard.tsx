"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, ListChecks, Lock } from "lucide-react";
import type { Test } from "@/lib/tests/schema";
import { isPaid } from "@/lib/tests/schema";
import { cn } from "@/lib/utils";

const accentClass: Record<NonNullable<Test["accent"]>, string> = {
  sage: "from-sage-light/35 via-warm-white to-cream",
  clay: "from-clay/25 via-warm-white to-cream",
  sand: "from-sand/40 via-warm-white to-cream",
};

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

type Props = {
  test: Test;
  index: number;
};

export function TestCard({ test, index }: Props) {
  const accent = test.accent ?? "sage";
  const paid = isPaid(test);

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...spring, delay: index * 0.06 }}
    >
      <Link
        href={paid ? `/test/${test.id}` : `/test/${test.id}`}
        className="group block rounded-3xl border border-line bg-warm-white ring-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:ring-soft-hover hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <div
          className={cn(
            "relative h-32 rounded-t-3xl overflow-hidden bg-gradient-to-br",
            accentClass[accent],
          )}
        >
          <div className="grain absolute inset-0 opacity-50" />
          <div className="absolute top-4 left-5 right-5 flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              {paid ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink text-cream text-[11px] uppercase tracking-[0.12em]">
                  <Lock className="w-3 h-3" strokeWidth={1.6} />
                  Платный
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-warm-white/80 border border-line text-[11px] uppercase tracking-[0.12em] text-sage-deep">
                  Бесплатно
                </span>
              )}
              {test.featured && !paid ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-warm-white/80 border border-line text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                  Рекомендуем
                </span>
              ) : null}
            </div>
            <ArrowUpRight
              className="w-5 h-5 text-ink-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
              strokeWidth={1.6}
            />
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <h3 className="font-display text-[22px] sm:text-[26px] leading-[1.12] text-ink text-balance">
            {test.title}
          </h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted text-pretty">
            {test.subtitle}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 pt-4 border-t border-line/70">
            <div className="flex items-center gap-x-5 gap-y-1 text-xs text-ink-faint flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5" strokeWidth={1.6} />
                <span className="font-mono-tabular text-ink-muted">
                  {test.questions.length}
                </span>
                <span>вопросов</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.6} />
                {test.duration}
              </span>
            </div>
            {paid && test.price ? (
              <span className="font-mono-tabular text-sm text-ink">
                {test.price.amount.toLocaleString("ru-RU")} ₽
              </span>
            ) : null}
          </div>

          {test.tags && test.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {test.tags.map((tag) => (
                <li
                  key={tag}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-cream/80 border border-line text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
    </motion.li>
  );
}
