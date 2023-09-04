<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'

  const { $client } = useNuxtApp()

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['recentlyViewed'],
    queryFn: async () => {
      return await $client.conversations.find.query({
        limit: 10,
        offset: 0,
        order: 'desc',
        orderBy: 'updatedAt',
        columns: ['id', 'messages', 'updatedAt'],
      })
    },
  })
</script>
<template>
  <div
    v-if="!isLoading"
    class="flex flex-col space-y-2"
  >
    <div class="flex items-center justify-between">
      <p class="text-xl font-bold">Recently viewed</p>
      <NuxtLink
        to="/app/workspaces/chats"
        class="text-gray-400 font-semibold text-lg hover:text-gray-600"
        >See all</NuxtLink
      >
    </div>

    <div
      v-if="conversations?.total"
      class="card w-full bg-base-300 shadow-xl rounded-3xl"
    >
      <div class="card-body p-4 flex flex-col space-y-2">
        <button
          v-for="conversation in conversations?.items"
          class="flex items-center space-x-2 bg-secondary-content rounded-full py-4 justify-evenly px-2 cursor-pointer hover:bg-base-200"
          :key="conversation.id"
        >
          <div
            v-if="conversation.messages.length > 0"
            class="bg-base-300 rounded-full h-12 w-12 flex items-center justify-center"
          >
            <Icon
              name="ph:chats-circle"
              class="h-8 w-8"
            />
          </div>
          <div class="flex-1">
            <p>"{{ conversation.messages.at(-1)?.content }}"</p>
          </div>
        </button>
      </div>
    </div>

    <div
      v-else
      class="card card-compact w-full bg-base-100 shadow-xl"
    >
      <figure>
        <img
          src="/searching.svg"
          class="w-72"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Looks like you don't have any chats</h2>
        <p>Lets create a new one</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary rounded-full">Create</button>
        </div>
      </div>
    </div>
  </div>
  <span
    v-if="isLoading"
    class="loading loading-dots loading-md"
  ></span>
</template>
