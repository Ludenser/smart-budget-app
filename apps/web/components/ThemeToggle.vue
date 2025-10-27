<template>
  <button
    class="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-300"
    @click="toggle"
  >
    <span v-if="isDark">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { isDark, toggle } = useTheme();
</script>
