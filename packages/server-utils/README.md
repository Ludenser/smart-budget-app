# @budget-habits/server-utils

Серверные утилиты для Nuxt/Nitro приложений.

## Установка

```bash
pnpm add @budget-habits/server-utils
```

## Утилиты

### RateLimiter

In-memory rate limiter для API эндпоинтов.

```typescript
import { RateLimiter, insightRateLimiter } from '@budget-habits/server-utils';
import { defineEventHandler } from 'h3';

// Использование глобального инстанса
export default defineEventHandler(async (event) => {
  const userId = getUserId(event);
  insightRateLimiter.check(userId); // выбросит 429 при превышении лимита

  // ваш код...
});

// Создание кастомного лимитера
const customLimiter = new RateLimiter({
  window: 60 * 1000, // 1 минута
  max: 10, // 10 запросов
});
```

### logInsight

Логирование использования insights API для аудита.

```typescript
import { logInsight } from '@budget-habits/server-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await logInsight(prisma, {
  userId: 'user-123',
  type: 'explain-trend',
  payload: { period: 'month' },
  tokensIn: 100,
  tokensOut: 500,
});
```

### getInsightStats

Получение статистики использования insights.

```typescript
import { getInsightStats } from '@budget-habits/server-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stats = await getInsightStats(prisma, 'user-123', {
  type: 'report',
  from: new Date('2024-01-01'),
  to: new Date(),
});
// { count: 15, totalTokensIn: 1500, totalTokensOut: 7500, totalTokens: 9000 }
```

## Сборка

```bash
pnpm build
```
