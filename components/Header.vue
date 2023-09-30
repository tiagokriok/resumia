<script setup lang="ts">
  const { isDesktopOrTablet } = useDevice()
</script>
<template>
  <template v-if="isDesktopOrTablet">
    <div
      class="navbar z-50 glass bg-secondary dark:bg-primary-content text-slate-50 fixed inset-x-0 top-0"
    >
      <div class="flex-1">
        <NuxtLink
          class="normal-case font-bold text-3xl cursor-pointer hover:scale-105 duration-300"
          to="/app/workspaces"
          >Resumia</NuxtLink
        >
      </div>
      <div class="flex-none gap-2">
        <ul class="menu menu-horizontal">
          <li>
            <NuxtLink
              class="text-md font-semibold hover:text-slate-50 hover:underline underline-offset-2 active:text-slate-50"
              to="/app/workspaces/documents"
              >{{ $t('app.workspaces.documents') }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              class="text-md font-semibold hover:text-slate-50 hover:underline underline-offset-2 active:text-slate-50"
              to="/app/workspaces/chats"
              >{{ $t('app.workspaces.chats') }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              class="text-md font-semibold hover:text-slate-50 hover:underline underline-offset-2"
              >{{ $t('app.workspaces.planUpgrade') }}</NuxtLink
            >
          </li>
        </ul>
        <Avatar />
      </div>
    </div>
    <div class="mb-24" />
  </template>
  <div
    class="flex items-center justify-between sticky left-0 right-0 w-full flex-row h-20 md:hidden"
  >
    <h1 class="font-bold text-3xl">Resumia</h1>
    <div class="flex items-center space-x-4">
      <Avatar />
      <!-- <BellNotification /> -->
    </div>
  </div>
</template>
