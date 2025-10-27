import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';

import { useHabitsStore } from '~/stores/habits';

describe('useHabitsStore', () => {
  setActivePinia(createPinia());

  it('по умолчанию пуст', () => {
    const store = useHabitsStore();
    expect(store.items).toEqual([]);
  });
});
