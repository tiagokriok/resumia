<script lang="ts" setup>
  withDefaults(defineProps<{ message?: string }>(), {})
</script>
<template>
  <div
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4 bg-black/80 w-screen h-screen text-slate-50 z-50"
  >
    <span class="loading loading-spinner loading-lg"></span>
    <p
      v-if="message"
      class="text-center text-lg font-semibold"
    >
      {{ $t(message) }}
    </p>
  </div>
</template>
