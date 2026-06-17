"use client";

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
  Link,
} from "@react-pdf/renderer";
import type { ScoreRange, Test } from "@/lib/tests/schema";
import { LANDING_URL, SPECIALIST_NAME } from "@/lib/env";

/**
 * Шрифты копируются из @fontsource в /public/fonts/ через scripts/copy-fonts.mjs
 * (хук на pre-dev / pre-build). Грузим их с того же origin — без CORS и без
 * зависимости от внешних CDN.
 *
 * Регистрация идёт при инициализации модуля, который импортируется только
 * в момент клика по кнопке скачивания (dynamic import + ssr: false).
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

const COLORS = {
  bg: "#FAF8F4",
  paper: "#FBF9F5",
  ink: "#2A2724",
  inkSoft: "#4A4540",
  inkMuted: "#75706A",
  inkFaint: "#A29D95",
  line: "#E8E2D5",
  sageDeep: "#5F6F58",
  sage: "#7E9275",
  sand: "#E0CFA8",
  clay: "#C49671",
  warning: "#B85C3B",
};

/**
 * Палитра сегмента шкалы по типу диапазона.
 * info-диапазоны почти всегда — норма (мягкий sage),
 * contact-диапазоны — повышенное внимание (нарастающий тёплый).
 */
function colorForRange(range: ScoreRange, idx: number, total: number): string {
  if (range.cta === "info") return COLORS.sage;
  // Чем выше диапазон в списке, тем глубже клай — деликатно сигналим вес.
  const ratio = total === 1 ? 1 : idx / (total - 1);
  if (ratio < 0.5) return COLORS.sand;
  if (ratio < 0.85) return COLORS.clay;
  return COLORS.warning;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bg,
    padding: 0,
    fontFamily: "Inter",
    fontSize: 10.5,
    color: COLORS.ink,
    lineHeight: 1.55,
  },
  pageInner: {
    paddingTop: 44,
    paddingHorizontal: 48,
    paddingBottom: 70,
  },
  // ── header ──
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottom: `1pt solid ${COLORS.line}`,
  },
  brand: {
    fontFamily: "Cormorant",
    fontSize: 17,
    fontWeight: 500,
    color: COLORS.ink,
  },
  brandSub: {
    marginTop: 2,
    fontSize: 8.5,
    color: COLORS.sageDeep,
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  date: {
    fontSize: 9,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  // ── hero ──
  eyebrow: {
    marginTop: 22,
    fontSize: 8.5,
    color: COLORS.sageDeep,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  title: {
    marginTop: 6,
    fontFamily: "Cormorant",
    fontSize: 26,
    fontWeight: 500,
    color: COLORS.ink,
    lineHeight: 1.12,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 10.5,
    color: COLORS.inkMuted,
    lineHeight: 1.5,
  },
  // ── score block ──
  scoreBlock: {
    marginTop: 18,
    padding: 18,
    backgroundColor: COLORS.paper,
    border: `1pt solid ${COLORS.line}`,
    borderRadius: 10,
  },
  rangeLabel: {
    fontFamily: "Cormorant",
    fontSize: 24,
    fontWeight: 500,
    color: COLORS.ink,
    lineHeight: 1.15,
  },
  scoreCaption: {
    marginTop: 6,
    fontSize: 8.5,
    color: COLORS.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  // ── bar ──
  barWrap: { marginTop: 22, position: "relative" },
  barTrack: {
    flexDirection: "row",
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.line,
  },
  barSeg: {
    height: "100%",
  },
  markerWrap: {
    position: "absolute",
    top: -8,
    width: 1,
  },
  markerLine: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.ink,
  },
  markerDot: {
    position: "absolute",
    left: -3,
    top: -3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.ink,
  },
  segLabels: {
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
  },
  segLabel: {
    fontSize: 7.5,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  // ── sections ──
  sectionHead: {
    marginTop: 20,
    fontSize: 8.5,
    color: COLORS.sageDeep,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  sectionTitle: {
    marginTop: 6,
    fontFamily: "Cormorant",
    fontSize: 16,
    fontWeight: 500,
    color: COLORS.ink,
  },
  body: {
    marginTop: 8,
    fontSize: 10.5,
    color: COLORS.inkSoft,
    lineHeight: 1.6,
  },
  recommendation: {
    marginTop: 16,
    padding: 14,
    backgroundColor: COLORS.paper,
    border: `1pt solid ${COLORS.line}`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sageDeep,
    borderRadius: 8,
  },
  // ── checklist ──
  steps: {
    marginTop: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  stepNum: {
    fontFamily: "Cormorant",
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.sageDeep,
    width: 22,
  },
  stepText: {
    flex: 1,
    fontSize: 10.5,
    color: COLORS.inkSoft,
    lineHeight: 1.55,
  },
  // ── crisis box (для тяжёлых результатов) ──
  crisis: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#FBF1ED",
    border: `1pt solid ${COLORS.warning}`,
    borderLeftWidth: 3,
    borderRadius: 8,
  },
  crisisLabel: {
    fontSize: 8.5,
    color: COLORS.warning,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: 4,
    fontWeight: 500,
  },
  // ── about / contacts (page 2) ──
  aboutWrap: {
    marginTop: 24,
    padding: 20,
    backgroundColor: COLORS.paper,
    border: `1pt solid ${COLORS.line}`,
    borderRadius: 10,
  },
  aboutName: {
    fontFamily: "Cormorant",
    fontSize: 22,
    fontWeight: 500,
    color: COLORS.ink,
  },
  aboutSub: {
    marginTop: 2,
    fontSize: 9,
    color: COLORS.sageDeep,
    textTransform: "uppercase",
    letterSpacing: 1.6,
  },
  aboutBody: {
    marginTop: 12,
    fontSize: 10.5,
    color: COLORS.inkSoft,
    lineHeight: 1.6,
  },
  credentials: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  credChip: {
    fontSize: 8.5,
    color: COLORS.sageDeep,
    backgroundColor: COLORS.bg,
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  contactBlock: {
    marginTop: 22,
    paddingTop: 18,
    borderTop: `1pt solid ${COLORS.line}`,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    fontSize: 10,
    color: COLORS.inkSoft,
  },
  contactLabel: {
    color: COLORS.inkMuted,
    width: 90,
    textTransform: "uppercase",
    fontSize: 8.5,
    letterSpacing: 1.4,
    paddingTop: 1,
  },
  contactValue: {
    flex: 1,
    color: COLORS.ink,
  },
  link: {
    color: COLORS.sageDeep,
    textDecoration: "none",
  },
  // ── footer ──
  disclaimer: {
    marginTop: 30,
    fontSize: 8.5,
    color: COLORS.inkMuted,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 30,
    fontSize: 7.5,
    color: COLORS.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    textAlign: "center",
    paddingTop: 12,
    borderTop: `0.5pt solid ${COLORS.line}`,
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

const CONTACTS = {
  phone: "+7 917 119-08-67",
  phoneRaw: "+79171190867",
  email: "marsel.terapi@yandex.ru",
  vkLabel: "vk.com/marsterapi",
  vkUrl: "https://vk.com/marsterapi",
  city: "Самара · онлайн по всей России",
} as const;

const BIO = [
  "Психолог. С 2018 года веду частный приём — индивидуальные, семейные и групповые сессии. За плечами 7 500+ часов сессий.",
  "Базовое образование — лечебный факультет Самарского государственного медицинского университета (2007). Профильная переподготовка по когнитивной и клинической психологии. Повышение квалификации по когнитивно-поведенческой, рационально-эмоциональной поведенческой и поведенческой терапии.",
];

const CREDENTIALS = [
  "СамГМУ · 2007",
  "Клинический психолог",
  "КПТ · РЭПТ",
  "Член АРЭПТ · АКПП",
] as const;

/**
 * Подбирает короткие шаги «что делать дальше» под уровень результата.
 * Для contact-диапазона — конкретный путь к специалисту.
 * Для info-диапазона — мягкие практики и приглашение, без давления.
 */
function buildNextSteps(range: ScoreRange): string[] {
  if (range.cta === "contact") {
    return [
      "Сохраните этот документ — на первой встрече с любым специалистом он поможет быстрее сориентироваться.",
      "Напишите в любой удобный канал: VK, email или телефон. Первый ответ обычно в течение дня.",
      "Если состояние тяжёлое или есть мысли о причинении себе вреда — параллельно с психологом обратитесь к врачу-психотерапевту или психиатру для очной оценки.",
    ];
  }
  return [
    "Понаблюдайте за собой 2–3 недели и можно пройти тест ещё раз — увидите динамику.",
    "Заметьте, что именно сейчас даёт вам устойчивость, и сознательно это поддерживайте.",
    "Если захочется поговорить со специалистом — встреча есть всегда, без обязательств продолжать.",
  ];
}

/**
 * Краткая «декодировка» того, что означает шкала.
 * Берём intro теста (если есть) и режем до одного предложения,
 * иначе — общий универсальный текст.
 */
function buildAboutTest(test: Test): string {
  const intro = test.intro?.trim();
  if (intro) {
    const firstSentence = intro.match(/^[^.!?]+[.!?]/)?.[0];
    if (firstSentence && firstSentence.length > 40) return firstSentence;
  }
  return `${test.subtitle} Это скрининговый инструмент — он не ставит диагноз, а помогает сориентироваться в собственном состоянии и решить, нужна ли сейчас профессиональная помощь.`;
}

export function ResultPdfDocument({
  test,
  score,
  maxScore,
  range,
  formattedDate,
}: Props) {
  const ranges = [...test.scoring].sort((a, b) => a.min - b.min);
  const activeIdx = ranges.findIndex((r) => r === range);
  const totalSpan = Math.max(1, maxScore);
  // Маркер ставим в центр «ячейки» текущего балла, используя тот же знаменатель
  // (maxScore + 1), что и сегменты — иначе маркер визуально не попадает на свой
  // диапазон в крайних случаях.
  const markerLeft = `${Math.min(
    100,
    ((score + 0.5) / (totalSpan + 1)) * 100,
  )}%`;
  const isClinical = range.cta === "contact" && activeIdx >= ranges.length - 1;
  const steps = buildNextSteps(range);
  const aboutTest = buildAboutTest(test);

  return (
    <Document
      title={`Результат · ${test.title}`}
      subject="Результат психологической самопроверки"
      author={SPECIALIST_NAME}
      keywords={`психология, тест, ${test.title}`}
      producer="tests.marsel.ru"
    >
      {/* ───────────────────────────  PAGE 1  ─────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageInner}>
          <View style={styles.headerBar}>
            <View>
              <Text style={styles.brand}>Мухаметшин Марсель</Text>
              <Text style={styles.brandSub}>психолог · {CONTACTS.city}</Text>
            </View>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <Text style={styles.eyebrow}>Результат самопроверки</Text>
          <Text style={styles.title}>{test.title}</Text>
          <Text style={styles.subtitle}>{test.subtitle}</Text>

          {/* score block */}
          <View style={styles.scoreBlock}>
            <Text style={styles.rangeLabel}>{range.label}</Text>
            <Text style={styles.scoreCaption}>
              Балл: {score} из {maxScore}
            </Text>

            {/* segmented bar */}
            <View style={styles.barWrap}>
              <View style={styles.barTrack}>
                {ranges.map((r, i) => {
                  const widthPct =
                    ((r.max - r.min + 1) / (totalSpan + 1)) * 100;
                  return (
                    <View
                      key={`seg-${i}`}
                      style={[
                        styles.barSeg,
                        {
                          width: `${widthPct}%`,
                          backgroundColor: colorForRange(r, i, ranges.length),
                          opacity: i === activeIdx ? 1 : 0.35,
                        },
                      ]}
                    />
                  );
                })}
              </View>
              {/* marker over current position */}
              <View
                style={[
                  styles.markerWrap,
                  { left: markerLeft },
                ]}
              >
                <View style={styles.markerDot} />
                <View style={styles.markerLine} />
              </View>
              <View style={styles.segLabels}>
                {ranges.map((r, i) => {
                  const widthPct =
                    ((r.max - r.min + 1) / (totalSpan + 1)) * 100;
                  return (
                    <View
                      key={`lab-${i}`}
                      style={{ width: `${widthPct}%`, paddingRight: 4 }}
                    >
                      <Text style={styles.segLabel}>
                        {r.min}
                        {"–"}
                        {r.max}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* description */}
          <Text style={styles.sectionHead}>Что показывает результат</Text>
          <Text style={styles.body}>{range.description}</Text>

          {/* recommendation */}
          <View style={styles.recommendation}>
            <Text
              style={[
                styles.sectionHead,
                { marginTop: 0, color: COLORS.sageDeep },
              ]}
            >
              Что сейчас уместно сделать
            </Text>
            <Text style={[styles.body, { marginTop: 8 }]}>
              {range.recommendation}
            </Text>
          </View>

          {/* crisis box only for the most severe contact range */}
          {isClinical ? (
            <View style={styles.crisis}>
              <Text style={styles.crisisLabel}>
                Помощь в кризисе — круглосуточно
              </Text>
              <Text style={[styles.body, { marginTop: 0 }]}>
                Если возникают мысли о причинении себе вреда, накатывает паника
                или ощущение тупика — позвоните на бесплатную линию
                психологической помощи 8-800-2000-122 (круглосуточно, анонимно).
                Это нормальный, разумный шаг.
              </Text>
            </View>
          ) : null}

          <Text style={styles.footer} fixed>
            Документ сформирован у вас в браузере · ответы никуда не передавались
          </Text>
        </View>
      </Page>

      {/* ───────────────────────────  PAGE 2  ─────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageInner}>
          <View style={styles.headerBar}>
            <View>
              <Text style={styles.brand}>Мухаметшин Марсель</Text>
              <Text style={styles.brandSub}>психолог · {CONTACTS.city}</Text>
            </View>
            <Text style={styles.date}>Стр. 2</Text>
          </View>

          {/* next steps */}
          <Text style={styles.eyebrow}>Шаги, которые имеют смысл</Text>
          <Text style={styles.sectionTitle}>
            {range.cta === "contact"
              ? "Что можно сделать на этой неделе"
              : "Что хорошо поддержит вас сейчас"}
          </Text>
          <View style={styles.steps}>
            {steps.map((s, i) => (
              <View key={`step-${i}`} style={styles.step}>
                <Text style={styles.stepNum}>{i + 1}</Text>
                <Text style={styles.stepText}>{s}</Text>
              </View>
            ))}
          </View>

          {/* about the test */}
          <Text style={styles.sectionHead}>О тесте</Text>
          <Text style={styles.body}>{aboutTest}</Text>

          {/* about Marsel */}
          <View style={styles.aboutWrap}>
            <Text style={styles.aboutName}>Мухаметшин Марсель Алмазович</Text>
            <Text style={styles.aboutSub}>
              Психолог · КПТ, РЭПТ, поведенческая терапия
            </Text>
            {BIO.map((p, i) => (
              <Text key={`bio-${i}`} style={styles.aboutBody}>
                {p}
              </Text>
            ))}
            <View style={styles.credentials}>
              {CREDENTIALS.map((c, i) => (
                <Text key={`cred-${i}`} style={styles.credChip}>
                  {c}
                </Text>
              ))}
            </View>

            <View style={styles.contactBlock}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Телефон</Text>
                <Link
                  src={`tel:${CONTACTS.phoneRaw}`}
                  style={[styles.contactValue, styles.link]}
                >
                  {CONTACTS.phone}
                </Link>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Email</Text>
                <Link
                  src={`mailto:${CONTACTS.email}`}
                  style={[styles.contactValue, styles.link]}
                >
                  {CONTACTS.email}
                </Link>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>ВКонтакте</Text>
                <Link
                  src={CONTACTS.vkUrl}
                  style={[styles.contactValue, styles.link]}
                >
                  {CONTACTS.vkLabel}
                </Link>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Сайт</Text>
                <Link
                  src={LANDING_URL}
                  style={[styles.contactValue, styles.link]}
                >
                  {LANDING_URL.replace(/^https?:\/\//, "")}
                </Link>
              </View>
            </View>
          </View>

          {/* disclaimer */}
          <Text style={styles.disclaimer}>
            Результат данного теста не является медицинским диагнозом. Шкала —
            скрининговый инструмент, помогающий заметить выраженность симптомов.
            Постановка диагноза, назначение фармакотерапии и определение тактики
            лечения — компетенция врача-психотерапевта или психиатра. Для
            принятия клинических решений требуется очная оценка специалиста.
          </Text>

          <Text style={styles.footer} fixed>
            Документ сформирован у вас в браузере · ответы никуда не передавались
          </Text>
        </View>
      </Page>
    </Document>
  );
}
