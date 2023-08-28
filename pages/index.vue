<script lang="ts" setup>
  import { computed } from 'vue'
  import { useCounterStore } from '../stores/counter'

  const { x, y } = useMouse()

  const store = useCounterStore()

  const getCounter = computed(() => store.getCount)

  const { increment } = store
</script>
<template>
  <div class="m-4 font-lato">
    <div class="text-base font-semibold leading-7">
      <p>Counter: {{ getCounter }}</p>
      <UButton
        type="button"
        @click="increment"
        color="black"
        variant="solid"
      >
        Increment
      </UButton>
    </div>
    <div>pos: {{ x }}, {{ y }}</div>
  </div>
</template>
