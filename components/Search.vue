import { inferAsyncReturnType } from '@trpc/server';
<script lang="ts" setup>
  withDefaults(
    defineProps<{
      modelValue: string
      label: string
      placeholder: string
    }>(),
    {
      label: 'components.search.label',
      placeholder: 'components.search.placeholder',
    },
  )

  const $emit = defineEmits(['update:modelValue', 'search'])

  const input = (event: Event) => {
    const target = event.target as HTMLInputElement
    $emit('update:modelValue', target.value)
  }
</script>
<template>
  <div>
    <div class="flex flex-col space-y-2 w-full">
      <p class="text-xl font-bold">{{ $t(label) }}</p>
      <div class="join">
        <input
          class="input input-bordered join-item rounded-l-xl flex-1"
          type="text"
          :placeholder="$t(placeholder)"
          @input="input"
        />
        <button
          class="btn btn-ghost join-item rounded-xl px-2 border border-base-content/20 border-l-0"
          @click="$emit('search')"
        >
          <div
            class="rounded-full bg-primary-content text-secondary dark:bg-slate-50 dark:text-secondary h-10 w-10 flex items-center justify-center"
          >
            <Icon name="ph:magnifying-glass" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
