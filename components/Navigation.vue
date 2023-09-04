<template>
  <div class="pb-20" />
  <div
    class="fixed inset-x-0 bottom-4 z-50 h-16 sm:max-w-sm mx-4 flex items-center justify-between px-1 rounded-full glass shadow-md"
  >
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces">
        <Icon
          name="ph:house-line"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces/files">
        <Icon
          name="ph:file-arrow-up-light"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces/chats">
        <Icon
          name="ph:chat-circle-text-light"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workpaces/settings">
        <Icon
          name="ph:gear-six-light"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  .router-link-active {
    @apply bg-primary font-bold text-primary-content rounded-full h-14 w-14 flex justify-center items-center;
  }
  .router-link-active:hover {
    @apply bg-base-300 text-base-content;
  }
</style>
