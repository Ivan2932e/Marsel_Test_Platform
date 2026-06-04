import { getAllTestIds } from "@/lib/tests/registry";
import { ResultView } from "@/components/test/ResultView";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTestIds().map((testId) => ({ testId }));
}

export default function ResultPage() {
  return <ResultView />;
}
