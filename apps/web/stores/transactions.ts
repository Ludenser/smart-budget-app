import { transactionSchema, type TransactionDto } from '@budget-habits/schemas';

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    items: [] as TransactionDto[],
    loading: false,
    filters: {
      from: null as string | null,
      to: null as string | null,
      categoryId: null as string | null,
      q: '',
    },
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    } as Pagination,
  }),
  actions: {
    async fetch() {
      this.loading = true;
      try {
        const query = new URLSearchParams(
          Object.entries({
            ...this.filters,
            page: this.pagination.page,
            limit: this.pagination.limit,
          })
            .filter(([, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        );
        const data = await $fetch(`/api/transactions?${query.toString()}`);
        if (data) {
          this.items = data.transactions.map((item: unknown) => transactionSchema.parse(item));
          this.pagination.total = data.total ?? data.transactions.length;
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
