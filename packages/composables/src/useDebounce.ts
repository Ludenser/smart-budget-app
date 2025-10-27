import { ref, watch, type Ref } from 'vue';

/**
 * Композабл для дебаунса значений
 * @param value - реактивное значение для дебаунса
 * @param delay - задержка в миллисекундах (по умолчанию 300ms)
 * @returns дебаунсированное значение
 */
export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref(value.value) as Ref<T>;
  let timeoutId: NodeJS.Timeout | null = null;

  watch(
    value,
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue;
      }, delay);
    },
    { immediate: true }
  );

  return debouncedValue;
}
