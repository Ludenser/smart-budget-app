import { defineEventHandler, readBody } from 'h3';

import { createMockClient, createOpenAIClient, redact } from '@budget-habits/llm';
import { insightAutotagRequestSchema, insightAutotagResponseSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const client = process.env.OPENAI_API_KEY ? createOpenAIClient() : createMockClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const payload = assertSchema(insightAutotagRequestSchema, body);

  const redacted = payload.transactions.map((tx) => ({
    ...tx,
    description: tx.description ? redact(tx.description) : null,
  }));

  const response = await client.generate({
    system: 'Suggest categories for transactions.',
    messages: [{ role: 'user', content: JSON.stringify(redacted) }],
  });

  const raw = typeof response === 'string' ? response : '[]';
  try {
    const json = JSON.parse(raw);
    return assertSchema(insightAutotagResponseSchema, json);
  } catch (error) {
    return [];
  }
});
