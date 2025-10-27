import { createMockClient, createOpenAIClient, redact } from '@budget-habits/llm';
import { insightReportRequestSchema } from '@budget-habits/schemas';
import { withSSE } from '@budget-habits/sse';
import { assertSchema } from '@budget-habits/validation';

const client = process.env.OPENAI_API_KEY ? createOpenAIClient() : createMockClient();

export default defineEventHandler(
  withSSE(
    async (event) => {
      const body = await readBody(event);
      const payload = assertSchema(insightReportRequestSchema, body);

      const stream = await client.generate({
        system: 'Generate a financial summary with a friendly tone in markdown.',
        messages: [{ role: 'user', content: redact(payload) }],
        stream: true,
      });

      return stream as AsyncIterable<string>;
    },
    {
      eventName: 'token',
      heartbeatMs: 15000,
    }
  )
);
