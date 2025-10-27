export const useTheme = () => {
  const preferences = usePreferencesStore();
  const isDark = computed(() => preferences.theme === 'dark');

  const themeClass = computed(() => (isDark.value ? 'dark' : 'light'));

  const toggle = () => {
    preferences.setTheme(isDark.value ? 'light' : 'dark');
  };

  onMounted(() => {
    document.documentElement.classList.toggle('dark', isDark.value);
  });

  watch(isDark, (value) => {
    document.documentElement.classList.toggle('dark', value);
  });

  return { isDark, toggle, themeClass };
};
