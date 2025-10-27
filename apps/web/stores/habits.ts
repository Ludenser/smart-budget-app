import { habitSchema, type HabitDto, habitCheckSchema } from '@budget-habits/schemas';

interface HabitWithChecks extends HabitDto {
  checks: ReturnType<typeof habitCheckSchema.parse>[];
}

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    items: [] as HabitWithChecks[],
    loading: false,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const data = await $fetch('/api/habits');
        if (data) {
          this.items = data.map((habit: any) => ({
            ...habitSchema.parse(habit),
            checks: habit.checks?.map((check: unknown) => habitCheckSchema.parse(check)) ?? [],
          }));
        }
      } catch (error) {
        console.error('Failed to fetch habits:', error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
