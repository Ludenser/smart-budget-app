import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return prisma.rule.findMany({
    where: { userId: session.user.id },
    include: { category: true },
  });
});
