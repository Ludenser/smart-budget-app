import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { createMockClient, createOpenAIClient, redact } from '@budget-habits/llm';
import {
  insightAutotagRequestSchema,
  insightAutotagResponseSchema,
  type InsightAutotagRequest,
} from '@budget-habits/schemas';
import { assertRateLimit, logInsight } from '@budget-habits/server-utils';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

const client = process.env.OPENAI_API_KEY ? createOpenAIClient() : createMockClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const payload = assertSchema(insightAutotagRequestSchema, body);

  assertRateLimit(session.user.id);

  const redacted = payload.transactions.map(
    (tx: InsightAutotagRequest['transactions'][number]) => ({
      ...tx,
      description: tx.description ? redact(tx.description) : null,
    })
  );

  const response = await client.generate({
    system: 'You are a finance assistant. Suggest categories for transactions.',
    messages: [
      {
        role: 'user',
        content: `Suggest categories for: ${JSON.stringify(redacted)}`,
      },
    ],
  });

  const raw = typeof response === 'string' ? response : '[]';
  try {
    const json = JSON.parse(raw);
    const result = assertSchema(insightAutotagResponseSchema, json);
    await logInsight(prisma, { userId: session.user.id, type: 'autotag', payload });
    return result;
  } catch (error) {
    return [];
  }
});
