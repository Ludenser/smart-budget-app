import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { categorySchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  const body = await readBody(event);
  const payload = assertSchema(categorySchema.partial(), body);

  return prisma.category.update({
    where: { id, userId: session.user.id },
    data: payload,
  });
});
