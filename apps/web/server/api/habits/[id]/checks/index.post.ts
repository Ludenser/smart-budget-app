import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { habitCheckSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const habitId = getRouterParam(event, 'id');
  if (!habitId) throw createError({ statusCode: 400, statusMessage: 'Habit ID is required' });

  const body = await readBody(event);
  const payload = assertSchema(habitCheckSchema, { ...body, habitId });

  return prisma.habitCheck.create({
    data: {
      habitId,
      date: payload.date,
      value: payload.value,
    },
  });
});
