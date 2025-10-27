import { categorySchema, type CategoryDto } from '@budget-habits/schemas';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    items: [] as CategoryDto[],
    loading: false,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const data = await $fetch('/api/categories');
        if (data) {
          this.items = data.map((item: unknown) => categorySchema.parse(item));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
