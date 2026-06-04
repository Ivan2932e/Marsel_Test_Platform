"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScoreRange, Test } from "@/lib/tests/schema";

type Props = {
  test: Test;
  score: number;
  maxScore: number;
  range: ScoreRange;
};

type Status = "idle" | "busy" | "error";

/**
 * Генерация PDF полностью на клиенте.
 * Библиотека @react-pdf/renderer импортируется лениво —
 * ни байта не уходит на сервер ни при импорте, ни при сборке PDF.
 */
export function PDFDownloadButton({ test, score, maxScore, range }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  const handleDownload = async () => {
    if (status === "busy") return;
    setStatus("busy");
    try {
      const [{ pdf }, { ResultPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ResultPdfDocument"),
      ]);

      const formattedDate = new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date());

      const blob = await pdf(
        <ResultPdfDocument
          test={test}
          score={score}
          maxScore={maxScore}
          range={range}
          formattedDate={formattedDate}
        />,
      ).toBlob();

      const safeDate = formattedDate.replace(/\s/g, "-");
      const filename = `result-${test.id}-${safeDate}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatus("idle");
    } catch (e) {
      console.error("PDF generation failed", e);
      setStatus("error");
      // через 4 секунды возвращаем кнопку в обычное состояние
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="ghost"
        size="lg"
        onClick={handleDownload}
        disabled={status === "busy"}
      >
        {status === "busy" ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4 text-danger" strokeWidth={1.8} />
        ) : (
          <Download className="h-4 w-4" strokeWidth={1.8} />
        )}
        {status === "busy"
          ? "Готовлю PDF…"
          : status === "error"
            ? "Не удалось — попробуйте ещё раз"
            : "Скачать результат (PDF)"}
      </Button>

      <AnimatePresence>
        {status === "error" ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-danger pl-1"
          >
            Проверьте подключение к интернету для загрузки шрифтов.
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
