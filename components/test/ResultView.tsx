"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTest } from "@/lib/test-context";
import {
  calculateScore,
  maxPossibleScore,
  resolveScoreRange,
  type ScoreRange,
} from "@/lib/tests/schema";
import { ResultCard } from "./ResultCard";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { easeOutSoft } from "@/lib/motion";

/**
 * Результирующий экран.
 *
 * Жизненный цикл:
 *   1. Ждём гидратацию TestProvider из sessionStorage.
 *   2. Один раз снимаем snapshot ответов → считаем score/maxScore/range.
 *      Дальше ничего из контекста не читаем для отображения — snapshot фиксирует
 *      результат до того, как мы зачистим sessionStorage и до того, как
 *      пользователь нажмёт «пройти ещё раз» (последнее сбрасывает state.answers).
 *   3. Сразу после захвата — clearSession(): sessionStorage чистится,
 *      следы прохождения удаляются.
 *   4. Если ответов не оказалось (зашли по URL без прохождения), редиректим
 *      на intro.
 */
type Snapshot = {
  score: number;
  maxScore: number;
  range: ScoreRange;
};

export function ResultView() {
  const router = useRouter();
  const { test, state, hydrated, clearSession } = useTest();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    // Уже захватили snapshot — нечего пересчитывать и не на что реагировать.
    // Это защищает результат от затирания после clearSession / restart.
    if (snapshot) return;

    const answeredCount = Object.keys(state.answers).length;
    // Если ответов нет вообще, или тест не пройден до конца, или статус
    // ещё не "finished" — отправляем на intro. Это закрывает попытку
    // открыть /result напрямую после неполного прохождения (например,
    // вернулся через Back и ушёл по URL).
    if (
      answeredCount === 0 ||
      answeredCount < test.questions.length ||
      state.status !== "finished"
    ) {
      router.replace(`/test/${test.id}`);
      return;
    }

    const score = calculateScore(test, state.answers);
    const maxScore = maxPossibleScore(test);
    const range = resolveScoreRange(test, score);

    // Невалидное состояние: ответы есть, но в шкалу не попадаем.
    // Не должно случаться — но если случилось, отправим на intro,
    // вместо того чтобы виснуть на «считаю результат…».
    if (!range) {
      router.replace(`/test/${test.id}`);
      return;
    }

    setSnapshot({ score, maxScore, range });
    // Зачищаем sessionStorage на следующем кадре — snapshot уже у нас.
    requestAnimationFrame(() => clearSession());
  }, [
    hydrated,
    snapshot,
    state.answers,
    state.status,
    test,
    router,
    clearSession,
  ]);

  /**
   * Перезапуск теста: достаточно навигировать на /test/<id>.
   * Не дёргаем reset() из контекста — иначе React успеет ре-рендерить
   * ResultView с пустыми ответами до того, как навигация завершится,
   * и из-за этого могут потеряться визуальные кадры. Сброс ответов
   * произойдёт автоматически при дисптаче START на intro-экране.
   */
  const handleRestart = () => {
    router.push(`/test/${test.id}`);
  };

  if (!snapshot) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutSoft }}
          className="flex items-center gap-3 text-sm text-ink-faint"
        >
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
          <span>Считаю результат…</span>
        </motion.div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOutSoft }}
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-20"
    >
      <ResultCard
        test={test}
        score={snapshot.score}
        maxScore={snapshot.maxScore}
        range={snapshot.range}
        onRestart={handleRestart}
        pdfButton={
          <PDFDownloadButton
            test={test}
            score={snapshot.score}
            maxScore={snapshot.maxScore}
            range={snapshot.range}
          />
        }
      />
    </motion.main>
  );
}
