import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Оболочка для marketing-маршрутов (главная / каталог / privacy).
 * НЕ используется на роутах прохождения теста — там нужен максимально
 * чистый фокус-режим без отвлекающих элементов.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}
