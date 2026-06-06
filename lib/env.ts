export const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL ?? "https://marsel.ru";

export const SPECIALIST_NAME =
  process.env.NEXT_PUBLIC_SPECIALIST_NAME ?? "Марсель";

/**
 * Дательный падеж имени специалиста — для фраз «Записаться к ___у».
 * Если не задан явно, для дефолтного «Марсель» возвращаем «Марселю»,
 * иначе — наивный fallback с добавлением «у» (работает для большинства
 * русских мужских имён на согласную: Иван → Ивану).
 */
export const SPECIALIST_NAME_DATIVE =
  process.env.NEXT_PUBLIC_SPECIALIST_NAME_DATIVE ??
  (SPECIALIST_NAME === "Марсель" ? "Марселю" : `${SPECIALIST_NAME}у`);
