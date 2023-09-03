<template>
  <div
    class="btm-nav btm-nav-md fixed z-50 inset-x-0 bottom-2 rounded-full glass p-1 shadow-md max-w-sm mx-auto"
  >
    <div>
      <NuxtLink to="/app/workspaces">
        <Icon
          name="ph:house-line"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <NuxtLink to="/app/workspaces/files">
      <Icon
        name="ph:file-arrow-up-light"
        class="w-6 h-6"
      />
    </NuxtLink>
    <div>
      <NuxtLink to="/app/workspaces/chats">
        <Icon
          name="ph:chat-circle-text-light"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <NuxtLink to="/app/workpaces/settings">
      <Icon
        name="ph:gear-six-light"
        class="w-6 h-6"
      />
    </NuxtLink>
  </div>
</template>

<style scoped>
  .router-link-active {
    @apply bg-primary font-bold text-primary-content rounded-full h-full w-full flex justify-center items-center;
  }
  .router-link-active:hover {
    @apply bg-base-300 text-base-content;
  }
</style>
