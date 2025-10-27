export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    locale: 'ru' as 'ru' | 'en',
    theme: 'light' as 'light' | 'dark',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
  actions: {
    setLocale(locale: 'ru' | 'en') {
      this.locale = locale;
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
    },
    setTimezone(tz: string) {
      this.timezone = tz;
    },
  },
  persist: {
    paths: ['locale', 'theme', 'timezone'],
  },
});
