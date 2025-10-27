import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { transactionSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

import { sendRealtimeEvent } from '../rt';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const payload = assertSchema(transactionSchema, { ...body, userId: userId });

  const transaction = await prisma.transaction.create({
    data: {
      userId: userId,
      amount: payload.amount,
      currency: payload.currency,
      categoryId: payload.categoryId ?? undefined,
      description: payload.description ?? undefined,
      date: payload.date,
      source: payload.source ?? 'manual',
    },
  });

  sendRealtimeEvent(userId, 'transaction.created', transaction);

  return transaction;
});
