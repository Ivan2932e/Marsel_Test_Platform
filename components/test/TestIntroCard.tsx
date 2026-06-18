"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ListChecks, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { easeOutSoft } from "@/lib/motion";
import type { Test } from "@/lib/tests/schema";

type Props = {
  test: Test;
  onStart: () => void;
};

export function TestIntroCard({ test, onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOutSoft }}
      className="relative mx-auto w-full max-w-xl rounded-[2rem] bg-warm-white border border-line ring-soft p-7 sm:p-10 grain"
    >
      <div className="relative z-10">
        <Link
          href="/test"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted hover:text-ink transition-colors -ml-1 mb-5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-warm-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          К каталогу тестов
        </Link>

        <span className="text-[11px] uppercase tracking-[0.2em] text-sage-deep">
          Самопроверка
        </span>

        <h1 className="mt-4 font-display text-[34px] leading-[1.1] sm:text-[44px] text-balance">
          {test.title}
        </h1>

        <p className="mt-3 text-ink-muted text-[15px] sm:text-base text-pretty">
          {test.subtitle}
        </p>

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <ListChecks className="h-4 w-4 text-sage-deep" strokeWidth={1.6} />
            <span className="font-mono-tabular">{test.questions.length}</span>
            <span className="text-ink-faint">{getQuestionWord(test.questions.length)}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft">
            <Clock className="h-4 w-4 text-sage-deep" strokeWidth={1.6} />
            <span>{test.duration}</span>
          </div>
        </div>

        {test.intro ? (
          <p className="mt-7 text-[15px] leading-relaxed text-ink-soft text-pretty">
            {test.intro}
          </p>
        ) : null}

        <div className="my-8 divider-soft" />

        <div className="flex items-start gap-3 rounded-2xl bg-cream/60 border border-line px-4 py-3">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" strokeWidth={1.6} />
          <p className="text-[13px] leading-relaxed text-ink-soft">
            Ваши ответы нигде не сохраняются и не передаются третьим лицам.
            Тест работает полностью в вашем браузере.
          </p>
        </div>

        <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <a
            href="/privacy"
            className="text-sm text-ink-muted hover:text-ink underline-offset-4 hover:underline transition-colors"
          >
            Политика конфиденциальности
          </a>
          <Button size="lg" onClick={onStart}>
            Начать
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function getQuestionWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "вопрос";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "вопроса";
  return "вопросов";
}
