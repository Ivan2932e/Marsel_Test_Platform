import type { Metadata } from "next";
import { getAllTestIds, getTestById } from "@/lib/tests/registry";
import { ResultView } from "@/components/test/ResultView";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTestIds().map((testId) => ({ testId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}): Promise<Metadata> {
  const { testId } = await params;
  const test = getTestById(testId);
  if (!test) {
    return {
      title: "Результат теста",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `Результат · ${test.title}`,
    description:
      "Результат самопроверки. Документ собирается у вас в браузере и нигде не сохраняется.",
    alternates: { canonical: `/test/${test.id}/result` },
    // Страница результата зависит от sessionStorage — без прохождения теста
    // она перенаправляет, индексировать смысла нет.
    robots: { index: false, follow: true },
  };
}

export default function ResultPage() {
  return <ResultView />;
}
