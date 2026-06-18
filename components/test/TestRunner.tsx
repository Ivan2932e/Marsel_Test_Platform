"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTest } from "@/lib/test-context";
import { TestIntroCard } from "./TestIntroCard";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { easeOutSoft } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SWIPE_THRESHOLD = 80;
const AUTO_ADVANCE_MS = 400;

export function TestRunner() {
  const router = useRouter();
  const { test, state, start, setAnswer, next, prev, finish } = useTest();
  const { status, currentQuestionIndex, answers, direction } = state;
  const reduced = usePrefersReducedMotion();

  const question =
    status === "running" ? test.questions[currentQuestionIndex] : null;

  const selected = question ? answers[question.id] ?? [] : [];
  const isLast = currentQuestionIndex === test.questions.length - 1;
  const canProceed = selected.length > 0;
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Запоминаем, был ли ответ на вопрос УЖЕ на момент входа в него.
  // Render-time-флаг сюда не годится: после первого клика state обновляется,
  // и повторный клик (быстрая последовательность, double-tap) попадает в
  // re-render, где "ответ уже есть" → auto-advance не перепланируется, а
  // старый таймер мы отменили — пользователь застревает на вопросе.
  const answeredOnEntryRef = useRef<Record<string, boolean>>({});
  useEffect(() => {
    if (!question) return;
    if (!(question.id in answeredOnEntryRef.current)) {
      answeredOnEntryRef.current[question.id] =
        (answers[question.id]?.length ?? 0) > 0;
    }
  }, [question, answers]);

  const slideVariants = useMemo(
    () =>
      reduced
        ? {
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0 },
          }
        : {
            enter: (dir: 1 | -1) => ({ x: dir * 60, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: 1 | -1) => ({ x: dir * -60, opacity: 0 }),
          },
    [reduced],
  );

  // Между dispatch FINISH и завершением router.replace состояние уже
  // `finished`, но мы ещё не на /result. Чтобы не показывать intro в этом
  // окне (он мигает как «главная теста»), держим явный флаг и рендерим лоадер.
  const navigatingToResultRef = useRef(false);

  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }, []);

  // Сбрасываем pending-таймер при размонтировании.
  useEffect(() => () => cancelAutoAdvance(), [cancelAutoAdvance]);

  const goToResult = useCallback(() => {
    navigatingToResultRef.current = true;
    finish();
    router.replace(`/test/${test.id}/result`);
  }, [finish, router, test.id]);

  const goNext = useCallback(() => {
    if (!canProceed) return;
    cancelAutoAdvance();
    if (isLast) {
      goToResult();
    } else {
      next();
    }
  }, [canProceed, cancelAutoAdvance, isLast, goToResult, next]);

  const goPrev = useCallback(() => {
    cancelAutoAdvance();
    prev();
  }, [cancelAutoAdvance, prev]);

  const handleAnswer = (questionId: string, answerIds: string[]) => {
    // Любой клик по варианту отменяет ранее запланированный авто-переход —
    // иначе старый таймер уведёт пользователя на следующий вопрос раньше,
    // чем мы успеем переоценить новый выбор.
    cancelAutoAdvance();
    setAnswer(questionId, answerIds);
    // Берём состояние «был ли ответ ДО входа на вопрос», а не текущее.
    // Это позволяет повторным быстрым кликам перепланировать таймер, но не
    // включает auto-advance, если пользователь вернулся редактировать ответ.
    const wasAnsweredOnEntry =
      answeredOnEntryRef.current[questionId] ?? false;
    if (
      question?.type !== "multi" &&
      answerIds.length > 0 &&
      !wasAnsweredOnEntry &&
      !reduced
    ) {
      autoAdvanceRef.current = setTimeout(() => {
        if (isLast) {
          goToResult();
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
      // Enter на фокусированной интерактивной кнопке (Назад/Дальше) уже сработает
      // как клик. Глобальный listener не должен дублировать действие.
      const target = e.target as HTMLElement | null;
      const isInteractive =
        target?.tagName === "BUTTON" ||
        target?.tagName === "A" ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";

      if (e.key === "ArrowLeft" && currentQuestionIndex > 0) goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Enter" && !isInteractive) goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, currentQuestionIndex, goPrev, goNext]);

  // Окно «только что нажали finish, ждём пока router.replace доедет до /result».
  // В этот момент status уже "finished", но нам нельзя показывать intro —
  // иначе он мигнёт как «главная теста».
  if (status === "finished" && navigatingToResultRef.current) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutSoft }}
          className="flex items-center gap-3 text-sm text-ink-faint"
        >
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
          <span>Открываю результат…</span>
        </motion.div>
      </main>
    );
  }

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
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      className="w-full touch-pan-y will-change-transform"
    >
      {children}
    </motion.div>
  );
}
