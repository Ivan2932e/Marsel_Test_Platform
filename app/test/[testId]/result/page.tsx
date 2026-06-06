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
  if (!test) return { title: "Результат теста" };
  return {
    title: `Результат · ${test.title}`,
  };
}

export default function ResultPage() {
  return <ResultView />;
}
