import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { getServerSession } from '#auth';
import { redact } from '@budget-habits/llm';
import { insightExplainTrendRequestSchema } from '@budget-habits/schemas';
import { assertRateLimit } from '@budget-habits/server-utils';
import { assertSchema } from '@budget-habits/validation';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body = await readBody(event);
  const payload = assertSchema(insightExplainTrendRequestSchema, body);
  assertRateLimit(userId);

  const redacted = redact(payload);

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Вы финансовый аналитик. Анализируйте финансовые данные и предоставляйте структурированные отчёты на русском языке.

ВАЖНО: Используйте правильное markdown форматирование:
- Заголовки: ## для основных разделов, ### для подразделов
- Списки: используйте - для маркированных списков, ОБЯЗАТЕЛЬНО с пустой строкой перед списком
- Выделение: **жирный** для важных цифр и показателей
- Параграфы: ОБЯЗАТЕЛЬНО разделяйте блоки текста пустыми строками
- Таблицы: используйте правильный markdown синтаксис с | и разделителями

Пример правильного форматирования:

## Заголовок

Текст параграфа.

- Элемент списка 1
- Элемент списка 2

Следующий параграф.`,
    messages: [
      {
        role: 'user',
        content: `Проанализируйте финансовые тренды за **${payload.period}** на основе следующих транзакций:

${JSON.stringify(redacted, null, 2)}

Создайте структурированный отчёт в формате markdown со следующими разделами:

## 📊 Ключевые показатели

- Всего транзакций
- Доходы
- Расходы
- Чистый денежный поток

## 📈 Анализ трендов

Опишите основные тренды в доходах и расходах.

## 💰 Структура расходов

Разбейте расходы по категориям с процентами.

## 🎯 Рекомендации

Дайте 3-5 конкретных рекомендаций по оптимизации бюджета.

ВАЖНО: Используйте пустые строки между разделами, списками и параграфами!`,
      },
    ],
  });

  return result.toTextStreamResponse();
});
