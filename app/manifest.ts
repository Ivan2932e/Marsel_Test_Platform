import type { MetadataRoute } from "next";
import { PLATFORM_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PLATFORM_NAME,
    short_name: "Тесты",
    description:
      "Психологические самопроверки. Ответы остаются на вашем устройстве — ничего не передаётся.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#FAF8F4",
    theme_color: "#FAF8F4",
    lang: "ru-RU",
    orientation: "portrait",
    icons: [
      { src: "/icon", type: "image/png", sizes: "32x32" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
