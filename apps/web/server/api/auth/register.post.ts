import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { hashPassword } from '~/server/utils/password';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Валидация входных данных
    const validatedData = registerSchema.parse(body);

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Пользователь с таким email уже существует',
      });
    }

    // Хеширование пароля
    const passwordHash = await hashPassword(validatedData.password);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'issues' in error) {
      // Ошибка валидации Zod
      throw createError({
        statusCode: 400,
        message: (error.issues as Array<{ message: string }>)[0]?.message || 'Ошибка валидации',
      });
    }

    throw error;
  }
});
