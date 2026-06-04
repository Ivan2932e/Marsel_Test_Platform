import { notFound } from "next/navigation";
import { getTestById } from "@/lib/tests/registry";
import { TestProvider } from "@/lib/test-context";

/**
 * Общий layout для прохождения и результата.
 * TestProvider живёт на этом уровне, чтобы при переходе на /result
 * ответы и testId не сбрасывались (App Router сохраняет инстанс layout-а).
 */
export default async function TestLayout({
  params,
  children,
}: {
  params: Promise<{ testId: string }>;
  children: React.ReactNode;
}) {
  const { testId } = await params;
  const test = getTestById(testId);
  if (!test) notFound();
  return <TestProvider test={test}>{children}</TestProvider>;
}
