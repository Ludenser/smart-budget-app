import { createMockClient, createOpenAIClient, redact } from '@budget-habits/llm';
import { insightExplainTrendRequestSchema } from '@budget-habits/schemas';
import { withSSE } from '@budget-habits/sse';
import { assertSchema } from '@budget-habits/validation';

const client = process.env.OPENAI_API_KEY ? createOpenAIClient() : createMockClient();

export default defineEventHandler(
  withSSE(
    async (event) => {
      const body = await readBody(event);
      const payload = assertSchema(insightExplainTrendRequestSchema, body);

      const stream = await client.generate({
        system: 'Explain spending trends for the user in markdown with actions.',
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
