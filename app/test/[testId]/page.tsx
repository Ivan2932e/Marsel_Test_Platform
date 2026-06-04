import { getAllTestIds } from "@/lib/tests/registry";
import { TestRunner } from "@/components/test/TestRunner";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTestIds().map((testId) => ({ testId }));
}

export default function TestRunnerPage() {
  return <TestRunner />;
}
