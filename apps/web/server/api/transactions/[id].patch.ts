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

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  const body = await readBody(event);
  const payload = assertSchema(transactionSchema.partial(), body);

  const transaction = await prisma.transaction.update({
    where: { id, userId: userId },
    data: payload,
  });

  sendRealtimeEvent(userId, 'transaction.updated', transaction);

  return transaction;
});
