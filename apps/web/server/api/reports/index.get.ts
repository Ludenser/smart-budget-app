import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  // Возвращаем список отчетов пользователя (без кэширования)
  const shares = await prisma.reportShare.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return shares;
});
