import { PrismaClient } from '@prisma/client';

export interface LogInsightParams {
  userId: string;
  type: 'explain-trend' | 'autotag' | 'report';
  payload: unknown;
  tokensIn?: number;
  tokensOut?: number;
}

/**
 * Логирует использование insights API для аудита и аналитики
 * @param prisma - инстанс Prisma клиента
 * @param params - параметры для логирования
 */
export const logInsight = async (
  prisma: PrismaClient,
  { userId, type, payload, tokensIn, tokensOut }: LogInsightParams
) => {
  await prisma.insightAudit.create({
    data: {
      userId,
      type,
      payload: JSON.stringify(payload),
      tokensIn,
      tokensOut,
    },
  });
};

/**
 * Получает статистику использования insights для пользователя
 * @param prisma - инстанс Prisma клиента
 * @param userId - ID пользователя
 * @param options - опции для фильтрации
 */
export const getInsightStats = async (
  prisma: PrismaClient,
  userId: string,
  options?: {
    type?: 'explain-trend' | 'autotag' | 'report';
    from?: Date;
    to?: Date;
  }
) => {
  const where: any = { userId };

  if (options?.type) {
    where.type = options.type;
  }

  if (options?.from || options?.to) {
    where.createdAt = {};
    if (options.from) where.createdAt.gte = options.from;
    if (options.to) where.createdAt.lte = options.to;
  }

  const [count, totalTokens] = await Promise.all([
    prisma.insightAudit.count({ where }),
    prisma.insightAudit.aggregate({
      where,
      _sum: {
        tokensIn: true,
        tokensOut: true,
      },
    }),
  ]);

  return {
    count,
    totalTokensIn: totalTokens._sum.tokensIn ?? 0,
    totalTokensOut: totalTokens._sum.tokensOut ?? 0,
    totalTokens: (totalTokens._sum.tokensIn ?? 0) + (totalTokens._sum.tokensOut ?? 0),
  };
};
