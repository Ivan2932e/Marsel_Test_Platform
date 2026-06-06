"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTest } from "@/lib/test-context";
import {
  calculateScore,
  maxPossibleScore,
  resolveScoreRange,
} from "@/lib/tests/schema";
import { ResultCard } from "./ResultCard";
import { PDFDownloadButton } from "./PDFDownloadButton";

/**
 * Результирующий экран.
 *
 * Жизненный цикл:
 *   1. Читаем ответы из контекста (восстановлены из sessionStorage).
 *   2. Считаем score локально, разрешаем диапазон.
 *   3. Сразу после первого рендера — clearSession():
 *      sessionStorage чистится, любые следы прохождения удаляются.
 *   4. Если ответов в контексте нет (например, открыта страница напрямую),
 *      перенаправляем на старт теста.
 */
export function ResultView() {
  const router = useRouter();
  const { test, state, hydrated, reset, clearSession } = useTest();
  const [ready, setReady] = useState(false);
  const clearedRef = useRef(false);

  // На монтировании ждём гидратацию из sessionStorage, потом фиксируем
  // «снимок» ответов и тут же зачищаем sessionStorage.
  useEffect(() => {
    // Пока не завершилась гидратация — не принимаем решений.
    if (!hydrated) return;
    // Если ответов нет — пользователь зашёл напрямую, отправляем на старт.
    if (Object.keys(state.answers).length === 0) {
      router.replace(`/test/${test.id}`);
      return;
    }
    setReady(true);
    if (!clearedRef.current) {
      clearedRef.current = true;
      // микро-задержка чтобы реакция на финальный setAnswer успела отрисоваться
      requestAnimationFrame(() => clearSession());
    }
  }, [hydrated, state.answers, test.id, router, clearSession]);

  const { score, maxScore, range } = useMemo(() => {
    const s = calculateScore(test, state.answers);
    const max = maxPossibleScore(test);
    const r = resolveScoreRange(test, s);
    return { score: s, maxScore: max, range: r };
  }, [test, state.answers]);

  const handleRestart = () => {
    reset();
    router.push(`/test/${test.id}`);
  };

  if (!ready || !range) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="text-sm text-ink-faint">Считаю результат…</span>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20"
    >
      <ResultCard
        test={test}
        score={score}
        maxScore={maxScore}
        range={range}
        onRestart={handleRestart}
        pdfButton={
          <PDFDownloadButton
            test={test}
            score={score}
            maxScore={maxScore}
            range={range}
          />
        }
      />
    </motion.main>
  );
}
