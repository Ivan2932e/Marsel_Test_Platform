import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_URL, SPECIALIST_NAME } from "@/lib/env";
import { buildPlatformJsonLd, PLATFORM_NAME } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

const TITLE = `${PLATFORM_NAME} — психологические самопроверки`;
const DESCRIPTION = `Бесплатные психологические тесты от ${SPECIALIST_NAME}а: HADS, шкалы Бека. Ответы не покидают ваше устройство — ничего не сохраняется и не передаётся на сервер.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${PLATFORM_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: PLATFORM_NAME,
  keywords: [
    "психологические тесты",
    "тест на тревогу",
    "тест на депрессию",
    "шкала Бека",
    "HADS",
    "BDI",
    "BAI",
    "анонимный тест",
    "тест без регистрации",
    "Мухаметшин Марсель",
  ],
  authors: [{ name: "Мухаметшин Марсель Алмазович" }],
  creator: "Мухаметшин Марсель Алмазович",
  category: "health",
  alternates: {
    canonical: "/",
    languages: { "ru-RU": "/" },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: PLATFORM_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: PLATFORM_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF8F4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <JsonLd data={buildPlatformJsonLd()} />
      </head>
      <body className="antialiased bg-cream text-ink min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
