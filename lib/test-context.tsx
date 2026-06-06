"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AnswersMap, Test } from "@/lib/tests/schema";

/**
 * Состояние прохождения теста.
 * Хранится только в памяти + sessionStorage НА ВРЕМЯ прохождения.
 * Сразу после рендера результата вызывается clearSession() —
 * данные не покидают вкладку и удаляются из sessionStorage.
 */
export type TestStatus = "idle" | "running" | "finished";

export type TestState = {
  testId: string;
  status: TestStatus;
  currentQuestionIndex: number;
  /** Направление последней навигации — нужно для AnimatePresence */
  direction: 1 | -1;
  answers: AnswersMap;
};

type Action =
  | { type: "START" }
  | { type: "ANSWER"; questionId: string; answerIds: string[] }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "FINISH" }
  | { type: "RESET" }
  | { type: "HYDRATE"; payload: TestState };

function reducer(state: TestState, action: Action): TestState {
  switch (action.type) {
    case "START":
      // Старт всегда с чистого листа — даже если предыдущий запуск завершился
      // или был восстановлен из sessionStorage, ответы сбрасываются.
      return {
        ...state,
        status: "running",
        currentQuestionIndex: 0,
        direction: 1,
        answers: {},
      };
    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answerIds },
      };
    case "NEXT":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        direction: 1,
      };
    case "PREV":
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        direction: -1,
      };
    case "FINISH":
      return { ...state, status: "finished" };
    case "RESET":
      return {
        testId: state.testId,
        status: "idle",
        currentQuestionIndex: 0,
        direction: 1,
        answers: {},
      };
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_PREFIX = "test-platform:progress:";

function storageKey(testId: string) {
  return `${STORAGE_PREFIX}${testId}`;
}

type TestContextValue = {
  test: Test;
  state: TestState;
  /**
   * true после того, как мы попытались восстановить состояние из sessionStorage
   * (вне зависимости от того, было ли что восстанавливать). Нужно потребителям
   * (ResultView), чтобы не принимать решений по пустому state до гидратации.
   */
  hydrated: boolean;
  start: () => void;
  setAnswer: (questionId: string, answerIds: string[]) => void;
  next: () => void;
  prev: () => void;
  finish: () => void;
  reset: () => void;
  /** Полностью стирает все следы прохождения из sessionStorage. */
  clearSession: () => void;
};

const TestContext = createContext<TestContextValue | null>(null);

function createInitialState(testId: string): TestState {
  return {
    testId,
    status: "idle",
    currentQuestionIndex: 0,
    direction: 1,
    answers: {},
  };
}

export function TestProvider({
  test,
  children,
}: {
  test: Test;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, test.id, createInitialState);
  const hydratedRef = useRef(false);
  const [hydrated, setHydrated] = useState(false);

  // Восстановление прогресса из sessionStorage при монтировании.
  useEffect(() => {
    if (typeof window === "undefined") {
      hydratedRef.current = true;
      setHydrated(true);
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(storageKey(test.id));
      if (raw) {
        const parsed = JSON.parse(raw) as TestState;
        if (parsed.testId === test.id && parsed.status !== "finished") {
          dispatch({ type: "HYDRATE", payload: parsed });
        }
      }
    } catch {
      // sessionStorage может быть недоступен (приватный режим и т.п.) — игнорируем.
    } finally {
      hydratedRef.current = true;
      setHydrated(true);
    }
  }, [test.id]);

  // Запись прогресса при изменении (только пока идёт тест).
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === "undefined") return;
    if (state.status === "finished") return;
    try {
      window.sessionStorage.setItem(storageKey(test.id), JSON.stringify(state));
    } catch {
      // молча — не критично, только UX-комфорт
    }
  }, [state, test.id]);

  const clearSession = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      // Сносим конкретный ключ И все ключи нашего префикса,
      // чтобы не оставлять следов других начатых тестов.
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
      }
      for (const k of keysToRemove) window.sessionStorage.removeItem(k);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<TestContextValue>(
    () => ({
      test,
      state,
      hydrated,
      start: () => dispatch({ type: "START" }),
      setAnswer: (questionId, answerIds) =>
        dispatch({ type: "ANSWER", questionId, answerIds }),
      next: () => dispatch({ type: "NEXT" }),
      prev: () => dispatch({ type: "PREV" }),
      finish: () => dispatch({ type: "FINISH" }),
      reset: () => {
        clearSession();
        dispatch({ type: "RESET" });
      },
      clearSession,
    }),
    [test, state, hydrated, clearSession],
  );

  return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

export function useTest(): TestContextValue {
  const ctx = useContext(TestContext);
  if (!ctx) {
    throw new Error("useTest must be used within <TestProvider>");
  }
  return ctx;
}
