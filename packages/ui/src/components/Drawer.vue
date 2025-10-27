<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel
                class="pointer-events-auto w-screen max-w-lg border-l border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div class="flex items-start justify-between p-6">
                  <div>
                    <DialogTitle class="text-lg font-semibold text-slate-900 dark:text-white">
                      {{ title }}
                    </DialogTitle>
                    <p v-if="description" class="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {{ description }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-md p-2 text-slate-400 hover:text-slate-500"
                    @click="emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
                <div class="h-full overflow-y-auto p-6">
                  <slot />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = withDefaults(defineProps<{ open: boolean; title: string; description?: string }>(), {
  description: '',
});

const emit = defineEmits<{ (e: 'close'): void }>();
</script>
