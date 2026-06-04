import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-sage-deep">
          404
        </p>
        <h1 className="mt-4 font-display text-[36px] sm:text-[44px] leading-[1.08]">
          Этой страницы здесь нет
        </h1>
        <p className="mt-4 text-ink-muted text-[15px]">
          Возможно, тест был переименован или ссылка устарела.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-ink underline-offset-4 hover:underline"
        >
          ← на главную
        </Link>
      </div>
    </main>
  );
}
