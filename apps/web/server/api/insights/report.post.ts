// server/api/insight-report.post.ts
import { defineEventHandler, readBody, createError } from 'h3';

import { getServerSession } from '#auth';
import { createOpenAIClient } from '@budget-habits/llm';
import { insightReportRequestSchema } from '@budget-habits/schemas';
import { assertRateLimit } from '@budget-habits/server-utils';
import { withSSE } from '@budget-habits/sse';
import { assertSchema } from '@budget-habits/validation';

const client = createOpenAIClient();

export default defineEventHandler(
  withSSE(
    async (event) => {
      const session = await getServerSession(event);
      const userId = (session?.user as any)?.id;
      if (!userId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });

      const body = await readBody(event);
      const payload = assertSchema(insightReportRequestSchema, body);
      assertRateLimit(userId);

      const stream = await client.generate({
        system: `Generate a structured financial report in markdown for the period ${payload.period}.
Use ${payload.tone} tone and respond in ${payload.locale === 'ru' ? 'Russian' : 'English'}.
Analyze the provided transactions and create insights about spending patterns, income, and financial trends.`,
        messages: [
          {
            role: 'user',
            content: `Please analyze these financial transactions and generate a comprehensive report:

Period: ${payload.period}
Total transactions: ${payload.transactions.length}

Transactions data:
${JSON.stringify(payload.transactions, null, 2)}`,
          },
        ],
        stream: true,
      });

      // просто вернём AsyncIterable<string> — withSSE всё доделает
      // плюс завяжем пост-логирование на onEnd через опции (см. ниже)
      return stream as AsyncIterable<string>;
    },
    {
      eventName: 'token', // пользовательское имя события (необязательно)
      heartbeatMs: 15000,
      onEnd: async () => {
        // ⚠ сюда не протащили payload/userId; если нужно — замкни их во внешнем scope
        // пример: перенеси withSSE внутрь defineEventHandler, чтобы иметь доступ
      },
    }
  )
);
