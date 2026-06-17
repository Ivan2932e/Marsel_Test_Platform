# test-platform

Второй модуль монорепо `psych-platform`. Площадка для прохождения психологических тестов от Марселя.

## Главный архитектурный принцип

**Ни один ответ пользователя не покидает его устройство.** Это не маркетинг, это свойство кода.

| Что | Как реализовано |
|---|---|
| Авторизация / регистрация | Отсутствуют |
| Серверные эндпоинты для приёма ответов | Не существуют (`app/api/` не создаётся) |
| Cookies с данными теста | Не устанавливаются |
| Куда сохраняются ответы | Только `sessionStorage` вкладки, на время прохождения |
| Когда удаляются | Сразу после рендера результата (`clearSession()` в `ResultView`) |
| Подсчёт результата | Только в браузере |
| PDF с результатом | Генерируется и скачивается клиентом, не уходит на сервер |
| Третьи лица | Никаких рассылок, никаких трекеров |

Это требование к работе с психологическими данными. Любые изменения, нарушающие этот контракт, должны быть отвергнуты на ревью.

## Стек

Идентичен `landing/`:

- Next.js 15.1.4 · App Router · React 19
- TypeScript strict
- Tailwind v4 (CSS-конфиг в `app/globals.css`)
- Framer Motion v12 — все анимации
- Zod — рантайм-валидация data-схемы
- shadcn-стиль примитивы вручную (`components/ui/`)
- Lucide React — иконки

Дополнительно:

- `@react-pdf/renderer` — генерация PDF в браузере (динамический импорт)
- JetBrains Mono — табличные цифры (прогресс, score)

## Структура

```
app/
  page.tsx                      # Главная: Hero + Принципы + Featured-тест
  layout.tsx                    # Шрифты, root
  globals.css                   # Tailwind v4 @theme + утилиты
  privacy/page.tsx              # Политика конфиденциальности
  not-found.tsx                 # 404
  test/
    page.tsx                    # Каталог тестов (группы по категориям)
    [testId]/
      layout.tsx                # TestProvider (общий для intro/run/result)
      page.tsx                  # Прохождение
      result/page.tsx           # Результат + PDF

components/
  ui/                           # button (cva)
  shared/                       # Navbar, Footer, MarketingShell
  test/                         # TestRunner, QuestionCard, ProgressBar,
                                # AnswerOption, TestIntroCard, ResultCard,
                                # ResultView, AnimatedScore,
                                # PDFDownloadButton, ResultPdfDocument,
                                # TestCard

lib/
  utils.ts                      # cn()
  motion.ts                     # easeOutSoft (типизированный кортеж)
  env.ts                        # LANDING_URL, SPECIALIST_NAME
  test-context.tsx              # TestProvider + useReducer + sessionStorage
  tests/
    schema.ts                   # Zod + helpers (calculateScore, etc.)
    categories.ts                # каталог категорий
    registry.ts                 # центральная точка регистрации тестов
    items/
      beck-anxiety.ts           # Шкала тревоги Бека (BAI)
      beck-depression.ts        # Шкала депрессии Бека (BDI)
      hads-anxiety.ts           # HADS · шкала тревоги
      hads-depression.ts        # HADS · шкала депрессии

hooks/
  usePrefersReducedMotion.ts
```

`MarketingShell` оборачивает «маркетинговые» страницы (главная, каталог, privacy) в Navbar + Footer. Маршруты прохождения теста (`/test/[testId]` и `/result`) — без шапки и подвала: максимальный фокус.

## Запуск

```powershell
npm install
copy .env.example .env.local       # опционально — задать LANDING_URL/SPECIALIST_NAME
npm run dev                        # http://localhost:3000
npm run build                      # прод-сборка
npm run typecheck                  # tsc --noEmit
```

Переменные (все опциональны):

- `NEXT_PUBLIC_LANDING_URL` — куда вести CTA «Записаться к специалисту». По умолчанию `https://marsel.ru`.
- `NEXT_PUBLIC_SPECIALIST_NAME` — имя в PDF, шапке и Privacy. По умолчанию `Марсель`.

## Data-модель теста

Все поля типа `Test` валидируются через Zod (см. `lib/tests/schema.ts`). Часть полей — обязательные, часть — заделы на будущее расширение, опциональные.

| Поле | Тип | Обязательное | Назначение |
|---|---|---|---|
| `id` | string | да | Slug, попадает в URL |
| `title`, `subtitle` | string | да | Заголовки |
| `duration` | string | да | «3–5 минут» |
| `intro` | string | нет | Текст на intro-экране |
| `questions[]` | Question[] | да | `single` / `scale` / `multi` |
| `scoring[]` | ScoreRange[] | да | Диапазоны баллов с label/description/recommendation/cta |
| `category` | string | нет | Slug из `categories.ts` — для группировки в каталоге |
| `tier` | `'free' \| 'paid'` | нет (default `free`) | Для будущих платных тестов |
| `price` | `{ amount, currency: 'RUB' }` | если tier=paid | Цена |
| `featured` | boolean | нет | Поднимает на главную и в начало каталога |
| `accent` | `'sage' \| 'clay' \| 'sand'` | нет | Цветовой акцент карточки |
| `tags` | string[] | нет | Короткие метки |

Все «новые» поля — опциональны, чтобы существующие data-файлы не ломались при расширении схемы.

## Как добавить новый тест

1. Создать `lib/tests/items/<id>.ts`:

   ```ts
   import { parseTest, type Test } from "../schema";

   export const myTest: Test = parseTest({
     id: "burnout-v1",
     title: "...",
     subtitle: "...",
     duration: "5 минут",
     category: "emotions",
     tier: "free",
     featured: false,
     accent: "clay",
     tags: ["короткий"],
     questions: [ /* ... */ ],
     scoring: [ /* ... */ ],
   });
   ```

2. Импортировать его в `lib/tests/registry.ts` и добавить в массив `tests`.
3. Перезапустить dev-сервер — тест появится в нужной категории, маршрут `/test/<id>` сгенерируется автоматически.

Никакие компоненты или маршруты править не нужно. Schema валидируется через Zod при загрузке — ошибки в data всплывут сразу.

## Как добавить новую категорию

1. В `lib/tests/categories.ts` добавить новый объект `{ id, label, description }`.
2. Проставить `category: "<id>"` у нужных тестов.

Категории без зарегистрированных тестов в каталог не попадают.

## Будущее: платные тесты

Архитектура заранее готова к платным тестам (`tier: "paid"`). Сейчас платный тест визуально помечается в каталоге, но flow оплаты ещё не реализован — это отдельный модуль (отдельное допсоглашение). Когда понадобится — добавится:

- страница `/test/[testId]/checkout` или внешний редирект
- проверка доступа в `[testId]/page.tsx` до запуска `TestRunner`
- учёт того, что **оплата** — единственное место, где данные могут уходить наружу; ответы и результаты остаются client-only

Контракт «ответы не покидают устройство» сохраняется и для платных тестов.

## Дизайн-система

Та же, что в `landing/`: Warm Luxury Minimal. Cream-фон, sage-акцент, Cormorant Garamond для заголовков, Inter для текста, JetBrains Mono для цифр.

## Конвенции анимаций

- `[0.22, 1, 0.36, 1]` → `easeOutSoft` из `lib/motion.ts` (типизированный кортеж).
- `spring = { type: "spring", stiffness: 100, damping: 20 }` инлайном в секциях — идентично лендингу.
- `staggerChildren: 0.05` для появления вариантов ответа.
- `layoutId="test-progress-fill"` — общий идентификатор прогресс-бара.
- `AnimatePresence mode="wait"` — переход между вопросами; `custom` direction `1 | -1`.
- Все анимации уважают `prefers-reduced-motion`.

## Безопасность данных — чек-лист на ревью

Перед мерджем любого PR проверьте, что:

- [ ] В `app/api/` ничего не появилось.
- [ ] `fetch` / `XMLHttpRequest` не используются для отправки ответов.
- [ ] `localStorage` не используется — только `sessionStorage`.
- [ ] `clearSession()` по-прежнему вызывается в `ResultView` после первого рендера.
- [ ] Никакой аналитики, GTM, Sentry или другого внешнего SDK не добавлено.

Если что-то из этого нарушено — это блокирующий комментарий на ревью.
