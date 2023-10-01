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

    <div v-if="chats?.length">
      <table class="table">
        <tbody>
          <tr
            v-for="chat in chats"
            :key="chat.id"
          >
            <td>
              <div class="flex items-center space-x-3">
                <div>
                  <div>
                    <Icon
                      name="ph:chats-circle"
                      class="h-8 w-8 text-secondary"
                    />
                  </div>
                </div>
                <NuxtLink :to="`/app/workspaces/chats/${chat.id}`">
                  <div class="font-bold">
                    {{ chat.label ?? chat.fileLabel }}
                  </div>
                  <div class="text-sm opacity-50 line-clamp-2">
                    {{ chat.lastMessage }}
                  </div>
                </NuxtLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
            to="/app/workspaces/documents/create"
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
