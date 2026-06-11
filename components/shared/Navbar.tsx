"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LANDING_URL } from "@/lib/env";
import { easeOutSoft } from "@/lib/motion";

const links = [
  { href: "/test", label: "Каталог" },
  { href: "/privacy", label: "Конфиденциальность" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutSoft }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-cream/85 backdrop-blur-xl border-b border-line/60"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl md:text-[22px] tracking-tight text-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Марсель <span className="text-ink-faint">·</span>{" "}
          <span className="italic text-ink-soft">тесты</span>
        </Link>

        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-9"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-ink-muted hover:text-ink transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href={LANDING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center h-10 px-5 rounded-full bg-ink text-cream text-[13.5px] hover:bg-ink-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          К специалисту
        </a>

        <Link
          href="/test"
          className="md:hidden inline-flex items-center h-9 px-4 rounded-full bg-ink text-cream text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          Каталог
        </Link>
      </div>
    </motion.header>
  );
}
