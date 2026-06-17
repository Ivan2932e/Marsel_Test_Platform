"use client";

import { motion } from "framer-motion";
import { easeOutSoft } from "@/lib/motion";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const progress = Math.min(1, Math.max(0, current / total));
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Прогресс
        </span>
        <span className="font-mono-tabular text-sm text-ink-soft">
          <motion.span
            key={current}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: easeOutSoft }}
            className="inline-block"
          >
            {current}
          </motion.span>
          <span className="mx-1 text-ink-faint">/</span>
          <span className="text-ink-muted">{total}</span>
        </span>
      </div>
      <div className="relative h-[2px] w-full bg-line/80 overflow-hidden rounded-full">
        <motion.div
          className="absolute left-0 top-0 h-full bg-sage rounded-full"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 26, mass: 0.6 }}
        />
      </div>
    </div>
  );
}
