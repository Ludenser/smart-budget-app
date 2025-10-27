import { createPersistedState } from 'pinia-plugin-persistedstate';

import type { Pinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia | undefined;
  if (pinia) {
    pinia.use(
      createPersistedState({
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        key: (id) => `bh-${id}`,
      })
    );
  }
});
