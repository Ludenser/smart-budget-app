export default defineNuxtRouteMiddleware(async () => {
  const { status, getSession } = useAuth();

  // Проверяем авторизацию для защищенных маршрутов
  try {
    await getSession();
    if (status.value !== 'authenticated') {
      return navigateTo('/login');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return navigateTo('/login');
  }
});
