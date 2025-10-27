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
                class="pointer-events-auto flex h-full w-screen max-w-2xl flex-col border-l border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-700 dark:bg-slate-950"
              >
                <div
                  class="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div>
                    <DialogTitle class="text-xl font-bold text-slate-900 dark:text-white">
                      {{ title }}
                    </DialogTitle>
                    <p v-if="description" class="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {{ description }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    @click="emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <div class="flex-1 overflow-y-auto p-6">
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
