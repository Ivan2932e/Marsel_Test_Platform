import { ImageResponse } from "next/og";
import { SPECIALIST_NAME } from "@/lib/env";

export const runtime = "edge";
export const alt = "Психологические тесты — без регистрации, без сохранения";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background:
            "linear-gradient(135deg, #FAF8F4 0%, #F2EBDB 50%, #DDE3D5 100%)",
          fontFamily: "serif",
          color: "#2A2724",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5F6F58",
          }}
        >
          <span>Психологические самопроверки</span>
          <span>{SPECIALIST_NAME}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.02,
            }}
          >
            Небольшая пауза,
          </div>
          <div
            style={{
              fontSize: 96,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.02,
              color: "#5F6F58",
            }}
          >
            чтобы услышать себя
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#4A4540",
              maxWidth: 920,
            }}
          >
            HADS и шкалы Бека · от 5 минут · ответы остаются только в вашем
            браузере и не уходят на сервер.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#75706A",
          }}
        >
          <span>Без регистрации · без аккаунтов · без аналитики</span>
          <span style={{ color: "#5F6F58" }}>4 бесплатных теста</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
