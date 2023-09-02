<script lang="ts" setup>
  defineProps({
    notification: {
      type: Object,
      required: true,
    },
  })
</script>
<template>
  <div class="alert alert-info flex justify-between">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>

    <div>
      <h3 class="font-bold">
        {{ notification.title }}
      </h3>
      <div
        v-if="notification.text"
        class="text-xs"
      >
        {{ notification.text }}
      </div>
    </div>
    <slot name="close" />
  </div>
</template>
