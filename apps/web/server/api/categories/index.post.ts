import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { categorySchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const payload = assertSchema(categorySchema, { ...body, userId: userId });

  return prisma.category.create({
    data: {
      userId: userId,
      name: payload.name,
      kind: payload.kind,
      color: payload.color ?? undefined,
    },
  });
});
