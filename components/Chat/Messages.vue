<script lang="ts" setup>
  import { useQuery } from '@tanstack/vue-query'
  import { Message } from '~/server/modules/messages/messages.schema'

  const { messages } = withDefaults(defineProps<{ messages: Message[] }>(), {
    messages: [],
  })

  const { $client } = useNuxtApp()

  const route = useRoute()

  const { chatId } = route.params

  const { data: messagesChat, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => $client.messages.find.query(chatId as string),
    onSuccess: (result) => {
      if (result.length) {
        const lastMessage = result.at(-1)
        setTimeout(() => {
          document.getElementById(lastMessage.id)?.scrollIntoView({
            behavior: 'smooth',
          })
        }, 100)
      }
      return result
    },
    refetchOnWindowFocus: false,
  })

  const allMessages = computed(() => {
    return messagesChat.value.concat(messages)
  })
</script>
<template>
  <div
    v-if="!isLoading"
    class="chat"
    v-for="message in allMessages"
    :key="message.id"
    :class="{
      'chat-end': message.role === 'user',
      'chat-start': message.role !== 'user',
    }"
  >
    <div class="chat-header">
      {{ message.role === 'user' ? $t('components.messages.you') : 'Resumia' }}
    </div>
    <div
      :id="message.id"
      class="chat-bubble rounded-xl"
    >
      {{ message.content }}
    </div>
  </div>
</template>
