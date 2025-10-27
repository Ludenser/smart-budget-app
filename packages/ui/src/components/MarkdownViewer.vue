<template>
  <div class="markdown-viewer">
    <div
      class="markdown-content prose prose-slate max-w-none dark:prose-invert"
      v-html="rendered"
    />
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { computed } from 'vue';

const props = defineProps<{ content: string }>();

// Настройка marked
marked.setOptions({
  breaks: true, // Переносы строк как <br>
  gfm: true, // GitHub Flavored Markdown
});

const rendered = computed(() => {
  if (!props.content) return '';
  try {
    // Парсим markdown напрямую - AI SDK уже форматирует правильно
    const rawHtml = marked.parse(props.content) as string;

    // Очищаем через DOMPurify для безопасности
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'code',
        'pre',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'hr',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'align'],
    });

    return cleanHtml;
  } catch (e) {
    console.error('Markdown render error:', e);
    return `<pre style="white-space: pre-wrap; word-wrap: break-word;">${props.content}</pre>`;
  }
});
</script>

<style scoped>
.markdown-viewer {
  width: 100%;
  max-width: 100%;
  overflow: visible;
}

.markdown-content {
  /* Переносы и прокрутка */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;

  /* Базовые стили текста */
  font-size: 0.875rem;
  line-height: 1.7;
  color: #334155; /* slate-700 */
}

.dark .markdown-content {
  color: #cbd5e1; /* slate-300 - СВЕТЛЫЙ текст для темного фона */
}

/* Убедимся что все элементы наследуют правильный цвет */
.markdown-content :deep(*) {
  color: inherit;
}

.markdown-content :deep(p) {
  color: #334155; /* slate-700 */
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.7;
}

.dark .markdown-content :deep(p) {
  color: #cbd5e1; /* slate-300 */
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  font-weight: 600;
  line-height: 1.3;
  color: #0f172a; /* slate-900 */
}

.dark .markdown-content :deep(h1),
.dark .markdown-content :deep(h2),
.dark .markdown-content :deep(h3),
.dark .markdown-content :deep(h4) {
  color: #f1f5f9; /* slate-100 - СВЕТЛЫЙ для темного фона */
}

.markdown-content :deep(h1) {
  font-size: 1.5em;
  border-bottom: 2px solid #e2e8f0; /* slate-200 */
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.dark .markdown-content :deep(h1) {
  border-bottom-color: #334155; /* slate-700 */
}

.markdown-content :deep(h2) {
  font-size: 1.25em;
  border-bottom: 1px solid #e2e8f0; /* slate-200 */
  padding-bottom: 0.25em;
  margin-top: 1.25em;
  margin-bottom: 0.6em;
}

.dark .markdown-content :deep(h2) {
  border-bottom-color: #334155; /* slate-700 */
}

.markdown-content :deep(h3) {
  font-size: 1.1em;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-content :deep(h4) {
  font-size: 1em;
  margin-top: 0.75em;
  margin-bottom: 0.4em;
}

/* Параграфы - уже определены выше */

/* Списки */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
  color: #334155; /* slate-700 */
}

.dark .markdown-content :deep(ul),
.dark .markdown-content :deep(ol) {
  color: #cbd5e1; /* slate-300 */
}

.markdown-content :deep(li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  line-height: 1.6;
  color: inherit;
}

.markdown-content :deep(li > p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/* Код */
.markdown-content :deep(code) {
  background-color: #f1f5f9; /* slate-100 */
  color: #1e293b; /* slate-800 */
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-weight: 500;
}

.dark .markdown-content :deep(code) {
  background-color: #1e293b; /* slate-800 */
  color: #e2e8f0; /* slate-200 */
}

.markdown-content :deep(pre) {
  background-color: #0f172a; /* slate-900 */
  color: #f1f5f9; /* slate-100 */
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  border: 1px solid #334155; /* slate-700 */
}

.dark .markdown-content :deep(pre) {
  background-color: #0f172a; /* slate-900 */
  color: #f1f5f9; /* slate-100 */
  border-color: #334155; /* slate-700 */
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.875em;
  font-weight: 400;
}

/* Цитаты */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #6366f1; /* indigo-500 */
  padding-left: 1em;
  margin-left: 0;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  font-style: italic;
  color: #475569; /* slate-600 */
}

.dark .markdown-content :deep(blockquote) {
  border-left-color: #818cf8; /* indigo-400 */
  color: #94a3b8; /* slate-400 */
}

/* Ссылки */
.markdown-content :deep(a) {
  color: #4f46e5; /* indigo-600 */
  text-decoration: underline;
  font-weight: 500;
}

.dark .markdown-content :deep(a) {
  color: #818cf8; /* indigo-400 */
}

.markdown-content :deep(a:hover) {
  color: #4338ca; /* indigo-700 */
}

.dark .markdown-content :deep(a:hover) {
  color: #a5b4fc; /* indigo-300 */
}

/* Горизонтальная линия */
.markdown-content :deep(hr) {
  border: 0;
  border-top: 1px solid #cbd5e1; /* slate-300 */
  margin-top: 2em;
  margin-bottom: 2em;
}

.dark .markdown-content :deep(hr) {
  border-top-color: #334155; /* slate-700 */
}

/* Таблицы */
.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  font-size: 0.875em;
  color: #334155; /* slate-700 */
}

.dark .markdown-content :deep(table) {
  color: #cbd5e1; /* slate-300 */
}

.markdown-content :deep(th) {
  background-color: #f1f5f9; /* slate-100 */
  font-weight: 600;
  padding: 0.75em;
  text-align: left;
  border: 1px solid #cbd5e1; /* slate-300 */
  color: #0f172a; /* slate-900 */
}

.dark .markdown-content :deep(th) {
  background-color: #1e293b; /* slate-800 */
  border-color: #334155; /* slate-700 */
  color: #f1f5f9; /* slate-100 */
}

.markdown-content :deep(td) {
  padding: 0.75em;
  border: 1px solid #cbd5e1; /* slate-300 */
  color: #334155; /* slate-700 */
}

.dark .markdown-content :deep(td) {
  border-color: #334155; /* slate-700 */
  color: #cbd5e1; /* slate-300 */
}

/* Жирный текст */
.markdown-content :deep(strong) {
  font-weight: 600;
  color: #0f172a; /* slate-900 */
}

.dark .markdown-content :deep(strong) {
  color: #f1f5f9; /* slate-100 */
}

/* Курсив */
.markdown-content :deep(em) {
  font-style: italic;
}

/* Первый элемент */
.markdown-content :deep(> *:first-child) {
  margin-top: 0;
}

/* Последний элемент */
.markdown-content :deep(> *:last-child) {
  margin-bottom: 0;
}
</style>
