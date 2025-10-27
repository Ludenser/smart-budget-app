import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi } from 'vitest';

import { useTransactionsStore } from '~/stores/transactions';

describe('useTransactionsStore', () => {
  setActivePinia(createPinia());

  it('инициализируется с пустым списком', () => {
    const store = useTransactionsStore();
    expect(store.items).toEqual([]);
    expect(store.loading).toBe(false);
  });
});
