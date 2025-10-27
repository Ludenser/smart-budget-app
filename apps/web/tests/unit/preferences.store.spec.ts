import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';

import { usePreferencesStore } from '~/stores/preferences';

describe('usePreferencesStore', () => {
  setActivePinia(createPinia());

  it('имеет дефолтные значения', () => {
    const store = usePreferencesStore();
    expect(store.locale).toBe('ru');
    expect(store.theme).toBeDefined();
  });
});
