<template>
  <select
    v-model="locale"
    class="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
    @change="handleLocaleChange"
  >
    <option value="ru">🇷🇺 RU</option>
    <option value="en">🇺🇸 EN</option>
  </select>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();

const handleLocaleChange = async () => {
  await setLocale(locale.value);
};
</script>
