import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL } from "@/lib/env";
import { getAllTestIds, getTestById } from "@/lib/tests/registry";
import {
  buildQuizJsonLd,
  buildTestBreadcrumb,
  testDescriptionFor,
} from "@/lib/seo";
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
  if (!test) {
    return {
      title: "Тест не найден",
      robots: { index: false, follow: false },
    };
  }

  const description = testDescriptionFor(test);
  const url = `${SITE_URL}/test/${test.id}`;

  return {
    title: test.title,
    description,
    alternates: { canonical: `/test/${test.id}` },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url,
      title: test.title,
      description,
      images: [
        {
          url: `/test/${test.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: test.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: test.title,
      description,
      images: [`/test/${test.id}/opengraph-image`],
    },
  };
}

export default async function TestRunnerPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = getTestById(testId);
  if (!test) return <TestRunner />;

  return (
    <>
      <JsonLd data={buildQuizJsonLd(test)} />
      <JsonLd data={buildTestBreadcrumb(test)} />
      <TestRunner />
    </>
  );
}
