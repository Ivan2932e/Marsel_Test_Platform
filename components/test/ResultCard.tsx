"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedScore } from "./AnimatedScore";
import { LANDING_URL } from "@/lib/env";
import { easeOutSoft } from "@/lib/motion";
import type { ScoreRange, Test } from "@/lib/tests/schema";

type Props = {
  test: Test;
  score: number;
  maxScore: number;
  range: ScoreRange;
  onRestart: () => void;
  pdfButton: React.ReactNode;
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOutSoft },
  },
};

export function ResultCard({
  test,
  score,
  maxScore,
  range,
  onRestart,
  pdfButton,
}: Props) {
  const contactHref =
    range.cta === "contact" ? `${LANDING_URL}#contact` : LANDING_URL;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: easeOutSoft }}
      className="mx-auto w-full max-w-2xl rounded-[2rem] bg-warm-white border border-line ring-soft p-7 sm:p-12 grain"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.span
          variants={item}
          className="text-[11px] uppercase tracking-[0.2em] text-sage-deep"
        >
          Результат · {test.title}
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-6 font-display text-[34px] leading-[1.1] sm:text-[46px] text-balance"
        >
          {range.label}
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-4 inline-flex items-baseline gap-1.5 text-[12.5px] uppercase tracking-[0.16em] text-ink-faint font-mono-tabular"
        >
          <span>Балл:</span>
          <AnimatedScore to={score} className="text-ink-muted" />
          <span>/ {maxScore}</span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-5 text-[15px] sm:text-base leading-relaxed text-ink-soft text-pretty"
        >
          {range.description}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-7 rounded-2xl bg-cream/70 border border-line px-5 py-4"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-sage-deep mb-2">
            Что с этим делать
          </p>
          <p className="text-[15px] leading-relaxed text-ink text-pretty">
            {range.recommendation}
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            variant={range.cta === "contact" ? "primary" : "sage"}
            size="lg"
          >
            <a href={contactHref} target="_blank" rel="noopener noreferrer">
              {range.cta === "contact" ? "Записаться к специалисту" : "Узнать больше"}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </Button>
          {pdfButton}
        </motion.div>

        <motion.div variants={item} className="mt-6">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
            Пройти ещё раз
          </button>
        </motion.div>

        <motion.div variants={item} className="my-8 divider-soft" />

        <motion.div variants={item} className="space-y-3 text-[13px] leading-relaxed text-ink-muted">
          <p>
            Результаты видны только вам и не сохраняются на сервере.
            Все данные удаляются из памяти браузера сразу после показа результата.
          </p>
          <p>
            Результат носит информационный характер и не является медицинским
            диагнозом. Для профессиональной консультации обратитесь к специалисту.{" "}
            <Link
              href="/privacy"
              className="text-ink underline-offset-4 hover:underline"
            >
              Политика конфиденциальности →
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
