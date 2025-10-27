import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';

import { useCategoriesStore } from '~/stores/categories';

describe('useCategoriesStore', () => {
  setActivePinia(createPinia());

  it('по умолчанию пуст', () => {
    const store = useCategoriesStore();
    expect(store.items).toEqual([]);
  });
});
