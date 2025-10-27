<template>
  <div class="mx-auto max-w-3xl space-y-8 py-12">
    <header class="space-y-2 text-center">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Публичный отчёт</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Отчётно-аналитический срез периода {{ report?.period }}.
      </p>
    </header>
    <section
      class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Обзор</h2>
      <dl class="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <dt class="text-xs uppercase text-slate-500">Доходы</dt>
          <dd class="text-2xl font-semibold text-emerald-500">{{ report?.incomeFormatted }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-slate-500">Расходы</dt>
          <dd class="text-2xl font-semibold text-rose-500">{{ report?.expenseFormatted }}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase text-slate-500">Сальдо</dt>
          <dd class="text-2xl font-semibold text-indigo-500">{{ report?.balanceFormatted }}</dd>
        </div>
      </dl>
    </section>

    <section
      class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Инсайты</h2>
      <MarkdownViewer :content="report?.insights ?? ''" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { MarkdownViewer } from '@budget-habits/ui';

interface ReportData {
  period: string;
  incomeFormatted: string;
  expenseFormatted: string;
  balanceFormatted: string;
  insights: string;
}

const { params } = useRoute();
const { data: report } = await useAsyncData(`report-${params.id}`, () =>
  $fetch<ReportData>(`/api/reports/${params.id}`, {
    headers: { 'x-public-token': params.id as string },
  })
);

const headTitle = computed(() => `Budget & Habits · Публичный отчет ${report.value?.period ?? ''}`);
const headDescription = computed(
  () => `Ключевые показатели за период ${report.value?.period ?? ''}`
);
const ogImage = computed(() => `/api/og/report/${params.id}`);

useHead({
  title: headTitle,
  meta: [
    { name: 'description', content: headDescription },
    { property: 'og:title', content: headTitle },
    { property: 'og:description', content: headDescription },
    { property: 'og:image', content: ogImage },
  ],
  link: [
    { rel: 'alternate', hreflang: 'ru', href: `/ru/report/${params.id}` },
    { rel: 'alternate', hreflang: 'en', href: `/en/report/${params.id}` },
  ],
});
</script>
