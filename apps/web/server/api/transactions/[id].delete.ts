import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';

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

  await prisma.transaction.delete({ where: { id, userId: userId } });

  sendRealtimeEvent(userId, 'transaction.deleted', { id });

  return { success: true };
});
