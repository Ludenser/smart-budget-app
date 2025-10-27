<template>
  <div :class="['flex w-full gap-3', isUser ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-lg rounded-2xl px-4 py-3 text-sm shadow-sm',
        isUser
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isUser?: boolean }>();
</script>
