const FALLBACK_LANDING_URL = "https://marsel.ru";

/**
 * LANDING_URL попадает в href ссылок. Если оператор по ошибке выставит
 * `javascript:...` или `data:...`, при клике выполнится произвольный код.
 * Принимаем только http/https; на всё остальное — fallback.
 */
function safeLandingUrl(raw: string | undefined): string {
  if (!raw) return FALLBACK_LANDING_URL;
  try {
    const u = new URL(raw);
    if (u.protocol === "http:" || u.protocol === "https:") return raw;
  } catch {
    // невалидный URL — падаем на fallback
  }
  return FALLBACK_LANDING_URL;
}

export const LANDING_URL = safeLandingUrl(process.env.NEXT_PUBLIC_LANDING_URL);

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
