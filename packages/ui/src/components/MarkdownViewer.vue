<template>
  <div class="prose prose-slate max-w-none dark:prose-invert" v-html="rendered" />
</template>

<script setup lang="ts">
import markdownit from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji';
import { computed } from 'vue';

const props = defineProps<{ content: string }>();

const md = markdownit({
  linkify: true,
  breaks: true,
  html: true,
  xhtmlOut: true,
  typographer: true,
}).use(emoji);

const rendered = computed(() => {
  if (!props.content) return '';
  return md.render(props.content);
});
</script>
