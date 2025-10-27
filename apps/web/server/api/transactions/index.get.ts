import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  const skip = (page - 1) * limit;

  const filters: any = {
    userId: userId,
  };

  if (query.from || query.to) {
    filters.date = {};
    if (query.from) filters.date.gte = new Date(String(query.from));
    if (query.to) filters.date.lte = new Date(String(query.to));
  }

  if (query.categoryId) filters.categoryId = String(query.categoryId);

  // Добавляем поиск по описанию в фильтры
  if (query.q && String(query.q).trim()) {
    filters.description = {
      contains: String(query.q).trim(),
    };
  }

  const where = {
    AND: [filters],
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total, page, limit };
});
