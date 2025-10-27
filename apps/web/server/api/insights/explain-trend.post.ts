import { getServerSession } from '#auth';
import { createOpenAIClient, redact } from '@budget-habits/llm';
import { insightExplainTrendRequestSchema } from '@budget-habits/schemas';
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
      const payload = assertSchema(insightExplainTrendRequestSchema, body);
      assertRateLimit(userId);

      const redacted = redact(payload);

      const stream = await client.generate({
        system: `Analyze financial trends for the period: ${payload.period}.
Focus on spending patterns, income trends, and key financial insights.
Provide concise markdown analysis with specific data points and actionable recommendations.
Respond in Russian.`,
        messages: [
          {
            role: 'user',
            content: `Проанализируйте финансовые тренды за ${payload.period} на основе следующих транзакций:

${JSON.stringify(redacted, null, 2)}

Пожалуйста, проанализируйте:
1. Общие тренды доходов и расходов
2. Категории с наибольшими тратами
3. Изменения в финансовом поведении
4. Конкретные рекомендации по оптимизации бюджета

Предоставьте анализ в виде структурированного markdown с конкретными цифрами и выводами.`,
          },
        ],
        stream: true,
      });

      return stream as AsyncIterable<string>;
    },
    {
      eventName: 'token',
      heartbeatMs: 15000,
      onEnd: async () => {
        // ⚠ сюда не протащили payload/userId; если нужно — замкни их во внешнем scope
        // пример: перенеси withSSE внутрь defineEventHandler, чтобы иметь доступ
      },
    }
  )
);
