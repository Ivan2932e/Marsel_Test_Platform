"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Question } from "@/lib/tests/schema";
import { AnswerOption } from "./AnswerOption";
import { cn } from "@/lib/utils";
import { easeOutSoft } from "@/lib/motion";

type Props = {
  question: Question;
  selected: string[];
  onChange: (answerIds: string[]) => void;
  index: number;
};

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutSoft },
  },
};

export function QuestionCard({ question, selected, onChange, index }: Props) {
  const isMulti = question.type === "multi";

  const handleSelect = (id: string) => {
    if (isMulti) {
      onChange(
        selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id],
      );
    } else {
      onChange([id]);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerStagger}
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div variants={itemFade} className="mb-8 sm:mb-12">
        <span className="text-[11px] uppercase tracking-[0.18em] text-sage-deep">
          Вопрос {index + 1}
        </span>
        <h2 className="mt-3 font-display text-[28px] leading-[1.15] sm:text-[34px] text-balance">
          {question.text}
        </h2>
        {isMulti ? (
          <p className="mt-3 text-sm text-ink-muted">
            Можно выбрать несколько вариантов
          </p>
        ) : null}
      </motion.div>

      {question.type === "scale" ? (
        <ScaleRow
          options={question.options}
          selected={selected}
          onSelect={handleSelect}
          labels={question.scaleLabels}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => (
            <motion.div key={opt.id} variants={itemFade}>
              <AnswerOption
                text={opt.text}
                selected={selected.includes(opt.id)}
                onSelect={() => handleSelect(opt.id)}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ScaleRow({
  options,
  selected,
  onSelect,
  labels,
}: {
  options: Question["options"];
  selected: string[];
  onSelect: (id: string) => void;
  labels?: { min: string; max: string };
}) {
  return (
    <motion.div variants={itemFade} className="w-full">
      {labels ? (
        <div className="mb-4 flex justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-2 sm:gap-3",
          options.length <= 5
            ? "grid-cols-5"
            : options.length === 7
              ? "grid-cols-7"
              : "grid-cols-4",
        )}
      >
        {options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + i * 0.04,
                ease: easeOutSoft,
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
             
              className={cn(
                "relative aspect-square rounded-2xl border bg-warm-white",
                "flex items-center justify-center font-mono-tabular text-xl sm:text-2xl",
                "transition-[border-color,background-color,box-shadow,color] duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                isSelected
                  ? "border-sage bg-sage text-cream ring-sage-active"
                  : "border-line text-ink-muted hover:border-ink/30 hover:text-ink ring-soft",
              )}
              aria-pressed={isSelected}
              aria-label={`Оценка ${opt.text}`}
            >
              {opt.text}
              {isSelected ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream"
                  aria-hidden
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </motion.span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

      {labels ? (
        <div className="mt-3 flex sm:hidden justify-between gap-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      ) : null}
    </motion.div>
  );
}
