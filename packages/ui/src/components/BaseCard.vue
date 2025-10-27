<template>
  <div
    :class="[
      'rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-700 dark:bg-slate-800',
      hoverable && 'hover:shadow-md',
    ]"
  >
    <slot name="header" />
    <div class="mt-2"><slot /></div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ hoverable?: boolean }>();
</script>
