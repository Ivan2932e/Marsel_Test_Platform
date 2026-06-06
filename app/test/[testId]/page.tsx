import type { Metadata } from "next";
import { getAllTestIds, getTestById } from "@/lib/tests/registry";
import { TestRunner } from "@/components/test/TestRunner";

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
  if (!test) return { title: "Тест" };
  return {
    title: `${test.title} · Тесты`,
    description: test.subtitle,
  };
}

export default function TestRunnerPage() {
  return <TestRunner />;
}
