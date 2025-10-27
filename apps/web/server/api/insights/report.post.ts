import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { getServerSession } from '#auth';
import { insightReportRequestSchema } from '@budget-habits/schemas';
import { assertRateLimit } from '@budget-habits/server-utils';
import { assertSchema } from '@budget-habits/validation';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

  const body = await readBody(event);
  const payload = assertSchema(insightReportRequestSchema, body);
  assertRateLimit(userId);

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `Вы опытный финансовый аналитик. Создавайте подробные финансовые отчёты на ${payload.locale === 'ru' ? 'русском' : 'английском'} языке в тоне: ${payload.tone}.

ВАЖНО: Используйте правильное markdown форматирование:
- Заголовки: ## для основных разделов, ### для подзаголовков
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
        content: `Создайте подробный финансовый отчёт за период: **${payload.period}**

Всего транзакций: ${payload.transactions.length}

Данные транзакций:
${JSON.stringify(payload.transactions, null, 2)}

Создайте структурированный отчёт в формате markdown со следующими разделами:

## 📋 Ключевые показатели

- Всего транзакций
- Доходы
- Расходы
- Чистый денежный поток
- Средний доход/расход на транзакцию

## 💰 Структура доходов и расходов

### Доходы по категориям

(перечислить с суммами)

### Расходы по категориям

(перечислить с процентами)

## 📊 Детализация транзакций

Создайте таблицу с основными транзакциями.

## 💡 Рекомендации

Дайте 3-5 конкретных рекомендаций по оптимизации бюджета.

ВАЖНО: Используйте пустые строки между разделами, списками и параграфами!`,
      },
    ],
  });

  return result.toTextStreamResponse();
});
