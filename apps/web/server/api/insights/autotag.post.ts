import { openai } from '@ai-sdk/openai';
import { PrismaClient } from '@prisma/client';
import { generateText } from 'ai';

import { getServerSession } from '#auth';
import { redact } from '@budget-habits/llm';
import {
  insightAutotagRequestSchema,
  insightAutotagResponseSchema,
  type InsightAutotagRequest,
} from '@budget-habits/schemas';
import { assertRateLimit, logInsight } from '@budget-habits/server-utils';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

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

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system:
      'You are a finance assistant. Suggest categories for transactions. Return ONLY valid JSON array.',
    messages: [
      {
        role: 'user',
        content: `Suggest categories for these transactions: ${JSON.stringify(redacted)}`,
      },
    ],
  });

  try {
    const json = JSON.parse(text);
    const result = assertSchema(insightAutotagResponseSchema, json);
    await logInsight(prisma, { userId: session.user.id, type: 'autotag', payload });
    return result;
  } catch (error) {
    console.error('Autotag parse error:', error);
    return [];
  }
});
