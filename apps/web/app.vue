<template>
  <div :class="[themeClass]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { themeClass } = useTheme();
</script>
