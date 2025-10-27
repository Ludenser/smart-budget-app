<template>
  <button
    class="rounded-md border border-slate-200 px-3 py-1 text-sm transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200"
    @click="handleAuth"
  >
    {{ session?.user ? 'Выйти' : 'Войти' }}
  </button>
</template>

<script setup lang="ts">
const { status, data, signOut, signIn } = useAuth();

const session = computed(() => data.value);

const handleAuth = () => {
  if (status.value === 'authenticated') {
    return signOut();
  }
  return navigateTo('/login');
};
</script>
