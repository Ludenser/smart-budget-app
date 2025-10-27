import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  const protectedRoutes = ['/app', '/api'];
  const path = event.path || '';
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  // Публичные API и auth endpoints не требуют авторизации
  const isPublicApi =
    path.startsWith('/api/auth') ||
    path.startsWith('/api/reports') ||
    path.startsWith('/api/share/public');

  if (!isProtected || isPublicApi) {
    return;
  }

  const session = await getServerSession(event);
  if (!session?.user?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
});
