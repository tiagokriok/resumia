<template>
  <div class="pb-16" />
  <div class="btm-nav glass bg-primary/70">
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces">
        <Icon
          name="ph:house-line-bold"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces/files">
        <Icon
          name="ph:files-bold"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces/chats">
        <Icon
          name="ph:chat-circle-text-bold"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
    <div class="flex justify-center h-14 w-14 items-center">
      <NuxtLink to="/app/workspaces/profile">
        <Icon
          name="ph:gear-six-bold"
          class="w-6 h-6"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
  .router-link-active {
    @apply bg-primary-content font-bold text-primary rounded-full h-14 w-14 flex justify-center items-center;
  }
  .router-link-active:hover {
    @apply bg-base-300 text-base-content;
  }
</style>
