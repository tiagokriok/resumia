<script lang="ts" setup>
  const route = useRoute()
</script>
<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4 bg-black/80 w-screen h-screen text-primary-content"
      >
        <span class="loading loading-spinner loading-lg"> </span>
        <p
          v-if="route.query.embed"
          class="text-center text-lg font-semibold"
        >
          {{ $t('components.loading.chat.embedFile') }}
        </p>
        <p
          v-else
          class="text-center text-lg font-semibold"
        >
          {{ $t('components.loading.chat.messages') }}
        </p>
      </div>
    </Teleport>
  </ClientOnly>
</template>
