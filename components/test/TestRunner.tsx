"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTest } from "@/lib/test-context";
import { TestIntroCard } from "./TestIntroCard";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { easeOutSoft } from "@/lib/motion";

const SWIPE_THRESHOLD = 80;
const AUTO_ADVANCE_MS = 400;

export function TestRunner() {
  const router = useRouter();
  const { test, state, start, setAnswer, next, prev, finish } = useTest();
  const { status, currentQuestionIndex, answers, direction } = state;

  const question =
    status === "running" ? test.questions[currentQuestionIndex] : null;

  const selected = question ? answers[question.id] ?? [] : [];
  const isLast = currentQuestionIndex === test.questions.length - 1;
  const canProceed = selected.length > 0;
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }, []);

  // Сбрасываем pending-таймер при размонтировании.
  useEffect(() => () => cancelAutoAdvance(), [cancelAutoAdvance]);

  const goNext = useCallback(() => {
    if (!canProceed) return;
    cancelAutoAdvance();
    if (isLast) {
      finish();
      router.replace(`/test/${test.id}/result`);
    } else {
      next();
    }
  }, [canProceed, cancelAutoAdvance, isLast, finish, next, router, test.id]);

  const goPrev = useCallback(() => {
    cancelAutoAdvance();
    prev();
  }, [cancelAutoAdvance, prev]);

  const handleAnswer = (questionId: string, answerIds: string[]) => {
    setAnswer(questionId, answerIds);
    if (question?.type !== "multi" && answerIds.length > 0) {
      cancelAutoAdvance();
      autoAdvanceRef.current = setTimeout(() => {
        if (isLast) {
          finish();
          router.replace(`/test/${test.id}/result`);
        } else {
          next();
        }
      }, AUTO_ADVANCE_MS);
    }
  };

  // Keyboard навигация: ArrowLeft / ArrowRight / Enter
  useEffect(() => {
    if (status !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentQuestionIndex > 0) goPrev();
      else if (e.key === "ArrowRight" || e.key === "Enter") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, currentQuestionIndex, goPrev, goNext]);

  if (status === "idle" || status === "finished") {
    // status==="finished" возможен, если пользователь вернулся назад из результата
    // или открыл URL вручную после сданного теста: показываем intro, чтобы пройти заново.
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16 sm:py-20">
        <TestIntroCard test={test} onStart={start} />
      </main>
    );
  }

  if (!question) {
    // защитный fallback — на пустой индекс
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-4 sm:px-8 pt-6 sm:pt-10">
        <div className="mx-auto w-full max-w-2xl">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={test.questions.length}
          />
        </div>
      </header>

      <section className="flex-1 flex items-center px-4 sm:px-8 py-8 sm:py-12 overflow-hidden">
        <SwipeableArea
          onPrev={() => currentQuestionIndex > 0 && goPrev()}
          onNext={() => canProceed && goNext()}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: easeOutSoft }}
              className="w-full"
            >
              <QuestionCard
                question={question}
                selected={selected}
                onChange={(ids) => handleAnswer(question.id, ids)}
                index={currentQuestionIndex}
              />
            </motion.div>
          </AnimatePresence>
        </SwipeableArea>
      </section>

      <footer className="px-4 sm:px-8 pb-8 sm:pb-12 pt-4 border-t border-line/60 bg-cream/60 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-2xl flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="default"
            onClick={goPrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            Назад
          </Button>

          {question.type === "multi" ? (
            <Button
              variant="primary"
              size="default"
              onClick={goNext}
              disabled={!canProceed}
            >
              {isLast ? "Показать результат" : "Дальше"}
              {isLast ? (
                <Check className="h-4 w-4" strokeWidth={2} />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              )}
            </Button>
          ) : (
            <span className="text-xs text-ink-faint hidden sm:block">
              Выберите вариант — переход будет автоматически
            </span>
          )}
        </div>
      </footer>
    </main>
  );
}

const slideVariants = {
  enter: (dir: 1 | -1) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir * -60, opacity: 0 }),
};

function SwipeableArea({
  children,
  onPrev,
  onNext,
}: {
  children: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
}) {
  const controls = useDragControls();

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) onNext();
  };

  return (
    <motion.div
      drag="x"
      dragControls={controls}
      dragListener
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      onDragEnd={handleDragEnd}
      className="w-full touch-pan-y"
    >
      {children}
    </motion.div>
  );
}
