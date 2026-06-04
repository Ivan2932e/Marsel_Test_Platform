"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LANDING_URL, SPECIALIST_NAME } from "@/lib/env";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-16 md:pt-24 pb-10 px-6 lg:px-10 bg-cream border-t border-line/60">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 mb-14">
          <div>
            <p className="text-[12.5px] uppercase tracking-[0.18em] text-sage-deep mb-4">
              Когда захочется поговорить
            </p>
            <h3 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] leading-[1.1] text-ink mb-6 text-balance max-w-lg">
              Тест — это первый шаг.
              <span className="italic text-ink-soft">
                {" "}
                Следующий — встреча.
              </span>
            </h3>
            <motion.div whileHover={{ x: 4 }}>
              <a
                href={LANDING_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[15px] text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
              >
                Записаться к {SPECIALIST_NAME}у
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <nav aria-label="Разделы">
              <p className="text-[12.5px] uppercase tracking-[0.18em] text-ink-muted mb-4">
                Разделы
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="inline-block py-1 text-[14.5px] text-ink-soft hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    href="/test"
                    className="inline-block py-1 text-[14.5px] text-ink-soft hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
                  >
                    Каталог тестов
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="inline-block py-1 text-[14.5px] text-ink-soft hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
                  >
                    Конфиденциальность
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Связь">
              <p className="text-[12.5px] uppercase tracking-[0.18em] text-ink-muted mb-4">
                {SPECIALIST_NAME}
              </p>
              <ul className="space-y-3 text-[14.5px] text-ink-soft">
                <li>
                  <a
                    href={LANDING_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 py-1 hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
                  >
                    Основной сайт
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li className="text-ink-muted">
                  Москва · онлайн по всему миру
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="divider-soft" />

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <p className="font-display text-[18px] text-ink">
              {SPECIALIST_NAME} · тесты
            </p>
            <p className="text-[12.5px] text-ink-muted mt-1">
              Самопроверка без сбора данных
            </p>
          </div>
          <p className="text-[12.5px] text-ink-muted">
            © {year} ·{" "}
            <Link href="/privacy" className="hover:text-ink-soft transition-colors">
              Политика конфиденциальности
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
