import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { ruleSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const payload = assertSchema(ruleSchema, { ...body, userId: session.user.id });

  return prisma.rule.create({
    data: {
      userId: session.user.id,
      pattern: payload.pattern,
      categoryId: payload.categoryId,
      enabled: payload.enabled,
    },
  });
});
