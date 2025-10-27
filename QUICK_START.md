# 🚀 Быстрый старт после рефакторинга

## ⚡ Что нужно сделать ПРЯМО СЕЙЧАС

### 1️⃣ Установите зависимости

```bash
pnpm install
```

### 2️⃣ Соберите новые пакеты

```bash
# Вариант 1: По очереди
cd packages/composables && pnpm build && cd ../..
cd packages/server-utils && pnpm build && cd ../..

# Вариант 2: Используя pnpm filter (рекомендуется)
pnpm -F @budget-habits/composables build
pnpm -F @budget-habits/server-utils build

# Вариант 3: Собрать все пакеты разом
pnpm build
```

### 3️⃣ Проверьте, что все работает

```bash
# Проверка типов
pnpm typecheck

# Если ошибок нет - запускайте!
pnpm dev
```

## ✅ Что было сделано

- ✅ Добавлены пути в `tsconfig.base.json`
- ✅ Созданы `.gitignore` для новых пакетов
- ✅ Настроены workspace пакеты

## 🔧 Если что-то не работает

### Проблема: "Cannot find module '@budget-habits/composables'"

**Решение:**

```bash
cd packages/composables
pnpm build
```

### Проблема: "Cannot find module '@budget-habits/server-utils'"

**Решение:**

```bash
cd packages/server-utils
pnpm build
```

### Проблема: TypeScript ошибки с типами

**Решение:**

```bash
# Пересоберите все пакеты
pnpm build

# Если не помогло - очистите кеш
rm -rf packages/*/dist
pnpm build
```

### Проблема: Prisma ошибки в server-utils

**Решение:**

```bash
cd apps/web
pnpm prisma:generate
```

## 📦 Новые пакеты

### `@budget-habits/composables`

- `useDebounce` - дебаунс значений
- `useSSE` - работа с Server-Sent Events

### `@budget-habits/server-utils`

- `RateLimiter` - ограничение частоты запросов
- `logInsight` - аудит использования insights API
- `getInsightStats` - статистика insights

## 🎯 После запуска

Все должно работать как раньше, но теперь с более чистой архитектурой!

Если возникнут вопросы - смотрите полный отчет в `REFACTORING_SUMMARY.md`
