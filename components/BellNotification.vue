<script setup lang="ts">
  const hasNotifications = ref(false)
</script>
<template>
  <div
    class="bg-secondary rounded-full h-10 w-10 flex items-center justify-center"
  >
    <div class="indicator">
      <span
        v-if="hasNotifications"
        class="indicator-item indicator-bottom rounded-full w-3 h-3 bg-warning"
      ></span>
      <Icon
        name="ph:bell-simple"
        class="w-6 h-6 text-slate-50"
      />
    </div>
  </div>
</template>
