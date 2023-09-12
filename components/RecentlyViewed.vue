<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'

  const { $client } = useNuxtApp()

  const { data: chats, isLoading } = useQuery({
    queryKey: ['recentlyViewed'],
    queryFn: async () => {
      return await $client.chats.getRecentlyChats.query()
    },
  })
</script>
<template>
  <div
    v-if="!isLoading"
    class="flex flex-col space-y-2"
  >
    <div class="flex items-center justify-between">
      <p class="text-xl font-bold">
        {{ $t('components.recentlyViewed.title') }}
      </p>
      <NuxtLink
        to="/app/workspaces/chats"
        class="text-gray-400 font-semibold text-lg hover:text-gray-600"
        >{{ $t('components.recentlyViewed.seeAll') }}</NuxtLink
      >
    </div>

    <div
      v-if="chats?.length"
      class="flex flex-col space-y-2"
    >
      <NuxtLink
        v-for="chat in chats"
        class="flex items-center space-x-2 bg-primary-content dark:bg-neutral rounded-xl py-4 justify-evenly px-2 cursor-pointer hover:scale-105 duration-300 h-24"
        :key="chat.id"
        :to="`/app/workspaces/chats/${chat.id}`"
      >
        <div
          class="bg-secondary text-primary-content dark:bg-slate-50 dark:text-secondary rounded-full h-12 w-12 flex items-center justify-center"
        >
          <Icon
            name="ph:chats-circle"
            class="h-8 w-8"
          />
        </div>
        <div class="flex-1 w-20 text-base-content dark:text-neutral-content">
          <h2 class="capitalize text-md font-semibold">
            {{ chat.label ?? chat.fileLabel }}
          </h2>
          <p class="truncate">{{ chat.lastMessage }}</p>
        </div>
      </NuxtLink>
    </div>

    <div
      v-else
      class="card bg-base-100 card-compact w-full shadow-xl"
    >
      <figure>
        <img
          src="/searching.svg"
          class="w-2/3"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
          {{ $t('components.recentlyViewed.noChatsTitle') }}
        </h2>
        <p>{{ $t('components.recentlyViewed.noChatsDescription') }}</p>
        <div class="card-actions justify-end">
          <NuxtLink
            to="/app/workspaces/files/create"
            class="btn btn-secondary text-slate-50"
          >
            {{ $t('common.buttons.create') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <span
    v-if="isLoading"
    class="loading loading-dots loading-md"
  ></span>
</template>
