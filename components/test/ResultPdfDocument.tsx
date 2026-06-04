"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
import type { ScoreRange, Test } from "@/lib/tests/schema";
import { LANDING_URL, SPECIALIST_NAME } from "@/lib/env";

/**
 * Шрифты копируются из @fontsource в /public/fonts/ через scripts/copy-fonts.mjs
 * (хук на pre-dev / pre-build). Грузим их с того же origin — без CORS и без
 * зависимости от внешних CDN, которые могут отдать 404.
 *
 * Регистрация идёт при инициализации модуля, который импортируется только
 * в момент клика по кнопке скачивания (dynamic import + ssr: false) — поэтому
 * никакого SSR-доступа к window.location не требуется.
 */
Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/inter-cyrillic-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/inter-cyrillic-500-normal.woff", fontWeight: 500 },
    { src: "/fonts/inter-cyrillic-600-normal.woff", fontWeight: 600 },
  ],
});

Font.register({
  family: "Cormorant",
  fonts: [
    {
      src: "/fonts/cormorant-garamond-cyrillic-500-normal.woff",
      fontWeight: 500,
    },
    {
      src: "/fonts/cormorant-garamond-cyrillic-500-italic.woff",
      fontWeight: 500,
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FAF8F4",
    padding: 56,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#2A2724",
    lineHeight: 1.55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 18,
    borderBottom: "1pt solid #E8E2D5",
  },
  brand: {
    fontFamily: "Cormorant",
    fontSize: 18,
    fontWeight: 500,
    color: "#2A2724",
  },
  brandSub: {
    marginTop: 2,
    fontSize: 9,
    color: "#75706A",
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  date: {
    fontSize: 10,
    color: "#75706A",
  },
  eyebrow: {
    marginTop: 36,
    fontSize: 9,
    color: "#5F6F58",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  title: {
    marginTop: 8,
    fontFamily: "Cormorant",
    fontSize: 26,
    fontWeight: 500,
    color: "#2A2724",
    lineHeight: 1.15,
  },
  scoreRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  score: {
    fontSize: 44,
    fontWeight: 600,
    color: "#2A2724",
  },
  scoreMax: {
    fontSize: 14,
    color: "#857F77",
    paddingBottom: 6,
  },
  label: {
    marginTop: 22,
    fontFamily: "Cormorant",
    fontSize: 18,
    fontStyle: "italic",
    color: "#4A4540",
  },
  body: {
    marginTop: 10,
    fontSize: 11,
    color: "#4A4540",
    lineHeight: 1.65,
  },
  recommendationBox: {
    marginTop: 22,
    padding: 16,
    backgroundColor: "#FBF9F5",
    border: "1pt solid #E8E2D5",
    borderRadius: 8,
  },
  recommendationLabel: {
    fontSize: 9,
    color: "#5F6F58",
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  divider: {
    marginTop: 26,
    height: 1,
    backgroundColor: "#E8E2D5",
  },
  disclaimer: {
    marginTop: 18,
    fontSize: 9,
    color: "#75706A",
    lineHeight: 1.6,
  },
  contact: {
    marginTop: 14,
    fontSize: 10,
    color: "#2A2724",
  },
  footer: {
    position: "absolute",
    left: 56,
    right: 56,
    bottom: 36,
    fontSize: 8,
    color: "#857F77",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
});

type Props = {
  test: Test;
  score: number;
  maxScore: number;
  range: ScoreRange;
  /** Дата формируется на клиенте при нажатии «Скачать» */
  formattedDate: string;
};

export function ResultPdfDocument({
  test,
  score,
  maxScore,
  range,
  formattedDate,
}: Props) {
  return (
    <Document
      title={`Результат теста · ${test.title}`}
      author={SPECIALIST_NAME}
      producer="test-platform"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.brand}>{SPECIALIST_NAME}</Text>
            <Text style={styles.brandSub}>Психолог</Text>
          </View>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <Text style={styles.eyebrow}>Результат теста</Text>
        <Text style={styles.title}>{test.title}</Text>

        <View style={styles.scoreRow}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.scoreMax}>/ {maxScore} баллов</Text>
        </View>

        <Text style={styles.label}>{range.label}</Text>
        <Text style={styles.body}>{range.description}</Text>

        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationLabel}>Рекомендация</Text>
          <Text style={styles.body}>{range.recommendation}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.disclaimer}>
          Данный результат носит информационный характер и не является
          медицинским диагнозом. Для профессиональной консультации обратитесь
          к специалисту.
        </Text>

        <Text style={styles.contact}>{LANDING_URL}</Text>

        <Text style={styles.footer} fixed>
          Документ сформирован в браузере и не передавался на сервер
        </Text>
      </Page>
    </Document>
  );
}
