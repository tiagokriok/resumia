<script setup lang="ts">
  import { cn } from '~/lib/utils'
  withDefaults(
    defineProps<{
      buttonClass?: string
      label?: string
      type: 'submit' | 'button' | 'reset'
    }>(),
    {
      type: 'button',
      buttonClass: '',
      label: '',
    },
  )

  const $emit = defineEmits(['click'])
</script>
<template>
  <button
    :type="type"
    :class="cn('btn rounded-xl', buttonClass)"
    @click="$emit('click')"
  >
    {{ $t(label) }}
  </button>
</template>
