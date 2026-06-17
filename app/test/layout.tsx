import type { Metadata } from "next";
import { SITE_URL } from "@/lib/env";
import { PLATFORM_NAME } from "@/lib/seo";

const TITLE = "Каталог тестов";
const DESCRIPTION =
  "Бесплатные психологические самопроверки: HADS и шкалы Бека. Без регистрации, без сохранения ответов — всё остаётся в вашем браузере.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/test" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: `${SITE_URL}/test`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: PLATFORM_NAME,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export default function TestCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
