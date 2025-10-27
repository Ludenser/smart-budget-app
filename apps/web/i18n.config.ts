export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: {
    ru: {
      common: {
        title: 'Budget & Habits',
        dashboard: 'Дашборд',
        transactions: 'Транзакции',
        habits: 'Привычки',
        profile: 'Профиль',
        assistant: 'Ассистент',
        login: 'Войти',
        logout: 'Выйти',
        welcome: 'Добро пожаловать',
      },
    },
    en: {
      common: {
        title: 'Budget & Habits',
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        habits: 'Habits',
        profile: 'Profile',
        assistant: 'Assistant',
        login: 'Sign in',
        logout: 'Sign out',
        welcome: 'Welcome',
      },
    },
  },
}));
