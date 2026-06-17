import { ImageResponse } from "next/og";
import { getAllTestIds, getTestById } from "@/lib/tests/registry";

export const alt = "Психологический тест";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// edge runtime несовместим с динамическим импортом zod-схем,
// поэтому используем дефолтный node-runtime и пререндерим заранее.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTestIds().map((testId) => ({ testId }));
}

const ACCENT_GRADIENTS = {
  sage: "linear-gradient(135deg, #FAF8F4 0%, #DDE3D5 100%)",
  clay: "linear-gradient(135deg, #FAF8F4 0%, #E8D8C8 100%)",
  sand: "linear-gradient(135deg, #FAF8F4 0%, #F2EBDB 100%)",
} as const;

export default async function OgImage({
  params,
}: {
  params: { testId: string };
}) {
  const test = getTestById(params.testId);
  const title = test?.title ?? "Психологический тест";
  const subtitle = test?.subtitle ?? "";
  const accent = test?.accent ?? "sage";
  const numQuestions = test?.questions.length ?? 0;
  const duration = test?.duration ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px 88px",
          background: ACCENT_GRADIENTS[accent],
          fontFamily: "serif",
          color: "#2A2724",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5F6F58",
          }}
        >
          <span>Психологический тест</span>
          <span>tests.marsel.ru</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1.05,
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 28,
                lineHeight: 1.4,
                color: "#4A4540",
                maxWidth: 920,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#75706A",
          }}
        >
          <span>
            {numQuestions ? `${numQuestions} вопросов · ` : ""}
            {duration}
          </span>
          <span style={{ color: "#5F6F58" }}>
            Без регистрации · Бесплатно
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
