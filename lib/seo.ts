import { LANDING_URL, SITE_URL, SPECIALIST_NAME } from "./env";
import type { Test } from "./tests/schema";
import { maxPossibleScore } from "./tests/schema";

export const PLATFORM_NAME = `Тесты · ${SPECIALIST_NAME}`;

/**
 * JSON-LD `Quiz` для конкретного теста.
 * Гугл умеет вытаскивать quiz-карточку в выдачу — особенно для
 * клинических скринингов это даёт rich result.
 */
export function buildQuizJsonLd(test: Test) {
  const url = `${SITE_URL}/test/${test.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "@id": url,
    name: test.title,
    description: test.subtitle,
    url,
    inLanguage: "ru-RU",
    educationalUse: "self-assessment",
    learningResourceType: "Assessment",
    timeRequired: "PT5M",
    isAccessibleForFree: true,
    creator: {
      "@type": "Person",
      name: "Мухаметшин Марсель Алмазович",
      url: LANDING_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: PLATFORM_NAME,
    },
    hasPart: {
      "@type": "Question",
      eduQuestionType: "Flashcard",
      numberOfItems: test.questions.length,
    },
  };
}

/**
 * Site-wide WebSite + ProfessionalService (slim) — линкуем со специалистом.
 */
export function buildPlatformJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: PLATFORM_NAME,
        description:
          "Бесплатные психологические самопроверки: HADS и шкалы Бека. Ответы остаются на устройстве — ничего не передаётся.",
        inLanguage: "ru-RU",
        publisher: {
          "@type": "Person",
          name: "Мухаметшин Марсель Алмазович",
          url: LANDING_URL,
        },
      },
    ],
  };
}

/**
 * Хлебные крошки для страниц теста и результата.
 */
export function buildTestBreadcrumb(test: Test, isResult = false) {
  const items: { name: string; url: string }[] = [
    { name: "Главная", url: `${SITE_URL}/` },
    { name: "Каталог тестов", url: `${SITE_URL}/test` },
    { name: test.title, url: `${SITE_URL}/test/${test.id}` },
  ];
  if (isResult) {
    items.push({
      name: "Результат",
      url: `${SITE_URL}/test/${test.id}/result`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function testDescriptionFor(test: Test): string {
  const maxScore = maxPossibleScore(test);
  return `${test.subtitle} ${test.questions.length} вопросов · до ${maxScore} баллов · без регистрации, ответы остаются в вашем браузере.`;
}
