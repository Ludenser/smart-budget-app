# Budget & Habits Monorepo

Моно-репозиторий на базе pnpm/turbo с двумя Nuxt 3 приложениями: `apps/web` (финансовый дашборд с контролем привычек) и `apps/assistant` (LLM-клиент для инсайтов и автотегов). Общие пакеты (`packages/*`) содержат zod-схемы, UI-компоненты и абстракции работы с LLM.

## Основные возможности

- SSR Nuxt 3, i18n (ru/en), авторизация через GitHub OAuth (Auth.js).
- Финансовые CRUD-операции, импорт CSV, типобезопасные формы на Vee-Validate + Zod.
- Pinia со state persistence, realtime через Nitro WebSocket `/api/rt`, оффлайн PWA с фоновой синхронизацией.
- Публичные отчёты с ISR и SEO-метаданными.
- LLM-интеграция (OpenAI), стриминг ответов через SSE.
- Тесты: Vitest (юнит) + Playwright (e2e); CI на GitHub Actions.

## Структура

```
apps/
  web/            # Budget & Habits Dashboard (Nuxt 3)
  assistant/      # LLM Insight Assistant (Nuxt 3)
packages/
  schemas/        # Общие Zod DTO/валидаторы и типы
  ui/             # Vue UI-компоненты (Tailwind, HeadlessUI)
  llm/            # Абстракция LLM, провайдеры OpenAI и Mock
  sse/            # Серверная утилита для SSE стриминга
  composables/    # Vue композаблы (useDebounce, useSSE)
  server-utils/   # Серверные утилиты (rate-limit, insight-audit)
  validation/     # Zod валидация с форматированием ошибок
.github/workflows # CI конфигурации
```

## Требования

- Node.js 20+
- pnpm 8+

## Переменные окружения

Создайте `.env` в корне или соответствующих приложениях и задайте значения:

```
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_SECRET=случайная_строка
OPENAI_API_KEY=опционально_для_production
NUXT_I18N_DEFAULT_LOCALE=ru
DATABASE_URL="file:./dev.db"
```

## Установка и запуск

```bash
pnpm install
pnpm -r prisma:migrate
pnpm -r dev
```

### Полезные команды

- `pnpm dev` – параллельный запуск всех приложений.
- `pnpm build` – production-сборка.
- `pnpm lint` / `pnpm typecheck` – статический анализ.
- `pnpm test` / `pnpm test:e2e` – Vitest и Playwright.
- `pnpm -r prisma:generate` – генерирует Prisma client.
- 
## CI/CD

`.github/workflows/ci.yml` запускает lint → typecheck → test → build на GitHub Actions с кэшированием pnpm.
