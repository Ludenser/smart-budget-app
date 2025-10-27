import { randomUUID } from 'node:crypto';

import { PrismaClient } from '@prisma/client';

import { getServerSession } from '#auth';
import { reportShareSchema } from '@budget-habits/schemas';
import { assertSchema } from '@budget-habits/validation';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const period = String(body.period ?? 'current');
  const token = randomUUID();

  const share = await prisma.reportShare.create({
    data: {
      userId: userId,
      token,
      period,
    },
  });

  return assertSchema(reportShareSchema, share);
});
