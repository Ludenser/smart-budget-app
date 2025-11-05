export default defineNuxtRouteMiddleware(async (to) => {
  const { status, getSession } = useAuth();

  // Проверяем авторизацию для защищенных маршрутов
  await getSession();

  if (status.value !== 'authenticated') {
    return navigateTo('/login');
  }
});
