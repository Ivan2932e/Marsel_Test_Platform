import Link from "next/link";
import { MarketingShell } from "@/components/shared/MarketingShell";
import { LANDING_URL, SPECIALIST_NAME_DATIVE } from "@/lib/env";

export const metadata = {
  title: "Политика конфиденциальности · Тесты",
  description:
    "Как устроена работа с данными в тест-платформе: ничего не покидает ваше устройство.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main className="px-6 lg:px-10 pt-28 md:pt-36 pb-20 md:pb-24">
        <article className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            ← На главную
          </Link>

          <span className="mt-10 block text-[12.5px] uppercase tracking-[0.2em] text-sage-deep">
            Конфиденциальность
          </span>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.08] text-balance">
            Ничего не сохраняется.{" "}
            <span className="italic text-ink-soft">Ничего не передаётся.</span>
          </h1>

          <p className="mt-7 text-[16px] sm:text-[17px] leading-relaxed text-ink-soft text-pretty">
            Тест-платформа создана с одним архитектурным принципом: ответы
            пользователя не должны покидать его устройство. Это не маркетинговое
            обещание, а свойство кода — иначе оно бы здесь и не появилось.
          </p>

          <Section title="Какие данные мы собираем">
            <p>
              <strong>Никакие персональные данные не собираются.</strong>{" "}
              При прохождении теста не требуется имя, email, телефон, IP-адрес
              или какой-либо идентификатор. Регистрации и входа нет.
            </p>
          </Section>

          <Section title="Где хранятся ваши ответы">
            <p>
              Только в памяти вашего браузера и в{" "}
              <code className="font-mono-tabular text-[13px] text-ink">sessionStorage</code>{" "}
              — это локальное хранилище, привязанное к конкретной вкладке.
              Оно автоматически очищается, когда вы закрываете вкладку.
            </p>
            <p className="mt-3">
              Дополнительно мы вручную очищаем{" "}
              <code className="font-mono-tabular text-[13px] text-ink">sessionStorage</code>{" "}
              сразу после того, как вы видите экран результата — никаких
              следов прохождения не остаётся.
            </p>
          </Section>

          <Section title="Передаются ли ответы на сервер">
            <p>
              Нет. В платформе нет ни одного серверного эндпоинта для приёма
              ответов — соответствующих API-маршрутов просто не существует.
              Подсчёт результата происходит локально в вашем браузере.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Платформа не устанавливает cookies для отслеживания, аналитики
              или сохранения данных теста.
            </p>
          </Section>

          <Section title="PDF с результатом">
            <p>
              PDF формируется библиотекой, работающей целиком в вашем браузере.
              Файл сохраняется на ваше устройство напрямую — он не загружается
              ни на наш сервер, ни на сторонние сервисы.
            </p>
          </Section>

          <Section title="Что показано в результате">
            <p>
              Текстовая интерпретация и рекомендации, основанные на вашем
              суммарном балле. Этот текст — общий для всех людей с похожим
              результатом, в нём нет ничего привязанного именно к вам.
            </p>
            <p className="mt-3">
              Результат носит информационный характер и не является
              медицинским диагнозом. Он не заменяет консультацию специалиста.
            </p>
          </Section>

          <Section title="Третьи лица">
            <p>
              Ваши ответы не передаются третьим лицам — потому что они и нам
              не передаются. Передавать нечего.
            </p>
          </Section>

          <Section title="Шрифты">
            <p>
              Шрифты скачиваются на этапе сборки и хостятся на том же домене,
              что и сама платформа. Браузер не обращается к Google Fonts или
              другим внешним CDN — никаких дополнительных запросов на сторонние
              сервисы при открытии страниц не происходит.
            </p>
          </Section>

          <Section title="Связаться со специалистом">
            <p>
              По любым вопросам — лично к {SPECIALIST_NAME_DATIVE} через
              основной сайт:
            </p>
            <p className="mt-3">
              <a
                href={LANDING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline-offset-4 hover:underline"
              >
                {LANDING_URL.replace(/^https?:\/\//, "")}
              </a>
            </p>
          </Section>

          <Section title="Если вы перейдёте к специалисту">
            <p>
              Тест-платформа — отдельный сервис. На основном сайте действует
              своя политика обработки персональных данных: она применяется,
              когда вы оставляете контактные данные для записи или подписания
              договора оказания психологических услуг.
            </p>
            <p className="mt-3">
              Ознакомиться:{" "}
              <a
                href={`${LANDING_URL}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline-offset-4 hover:underline"
              >
                политика обработки ПДн на основном сайте
              </a>
              .
            </p>
          </Section>

          <div className="my-12 divider-soft" />

          <p className="text-[13px] text-ink-faint">
            Если архитектура платформы изменится — этот документ обновится
            раньше, чем какие-либо данные начнут собираться.
          </p>

          <p className="mt-6 text-[12.5px] text-ink-faint">
            Платформа разработана для практики ИП Мухаметшин Марсель
            Алмазович, ИНН 631625125106.
          </p>
        </article>
      </main>
    </MarketingShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl leading-tight text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft text-pretty">
        {children}
      </div>
    </section>
  );
}
