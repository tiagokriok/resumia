<script lang="ts" setup>
  const { x, y } = useMouse()
</script>
<template>
  <div class="m-4 font-lato">
    <div>pos: {{ x }}, {{ y }}</div>
  </div>
</template>
