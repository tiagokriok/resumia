import { inferAsyncReturnType } from '@trpc/server';
<script lang="ts" setup>
  withDefaults(
    defineProps<{
      modelValue: string
      label: string
      placeholder: string
    }>(),
    {
      label: 'Search',
      placeholder: 'Search here',
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
      <p class="text-xl font-bold">{{ label }}</p>
      <div class="join">
        <input
          class="input input-bordered join-item rounded-l-full flex-1 bg-base-200 font-semibold border-none"
          type="text"
          :placeholder="placeholder"
          @input="input"
        />
        <button
          class="btn join-item rounded-full bg-base-200 px-2 border-none"
          @click="$emit('search')"
        >
          <div
            class="rounded-full bg-primary-content h-10 w-10 flex items-center justify-center"
          >
            <Icon name="ph:magnifying-glass" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
