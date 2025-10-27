<template>
  <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
    <p v-if="!content.length" class="text-slate-500">Стриминг ответа...</p>
    <MarkdownViewer v-else :content="content" />
  </div>
</template>

<script setup lang="ts">
import { MarkdownViewer } from '@budget-habits/ui';

defineProps<{ content: string }>();
</script>
