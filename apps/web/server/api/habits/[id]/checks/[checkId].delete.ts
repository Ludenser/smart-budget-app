import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const habitId = getRouterParam(event, 'id');
  const checkId = getRouterParam(event, 'checkId');
  if (!habitId || !checkId)
    throw createError({ statusCode: 400, statusMessage: 'IDs are required' });

  await prisma.habitCheck.delete({
    where: { id: checkId, habitId },
  });

  return { success: true };
});
