"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutSoft } from "@/lib/motion";

type Props = {
  text: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
};

export function AnswerOption({ text, selected, onSelect, index }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutSoft }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative w-full text-left",
        "rounded-2xl border bg-warm-white",
        "px-5 py-4 sm:px-6 sm:py-5",
        "transition-[border-color,background-color,box-shadow] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        selected
          ? "border-sage bg-sage/[0.06] ring-sage-active"
          : "border-line hover:border-ink/25 hover:bg-warm-white ring-soft",
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "flex-1 text-[15px] sm:text-base leading-relaxed",
            selected ? "text-ink" : "text-ink-soft",
          )}
        >
          {text}
        </span>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-300",
            selected
              ? "bg-sage border-sage text-cream"
              : "border-line text-transparent group-hover:border-ink/30",
          )}
          aria-hidden
        >
          {selected ? (
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          )}
        </span>
      </div>
    </motion.button>
  );
}
