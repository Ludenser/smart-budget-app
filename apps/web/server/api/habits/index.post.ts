import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { habitSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const payload = assertSchema(habitSchema, { ...body, userId: userId });

  return prisma.habit.create({
    data: {
      userId: userId,
      title: payload.title,
    },
  });
});
