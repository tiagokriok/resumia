<script setup lang="ts">
  import { useChat } from 'ai/vue'
  import { errorHandler } from '~/lib/Error'
  import { useAuthStore } from '~/stores/auth'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
    hideNavigation: true,
    hideHeader: true,
  })

  const { user } = useAuthStore()
  const { $client } = useNuxtApp()
  const route = useRoute()

  const bottomChat = ref<HTMLDivElement | null>(null)

  const { chatId } = route.params

  const { messages, handleSubmit, input, isLoading } = useChat({
    id: chatId as string,
    body: {
      chatId,
    },
    headers: { 'Content-Type': 'application/json' },
  })

  watch([messages, isLoading], () => {
    setTimeout(() => {
      bottomChat.value?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
  })

  const { data: eventData, close: closeSSE } = useEventSource(`/api/${chatId}`)

  // const { data: chat } = useQuery({
  //   queryKey: ['chat', chatId],
  //   queryFn: () => $client.chats.findOne.query(chatId as string),
  // })

  const { textarea } = useTextareaAutosize()

  onMounted(async () => {
    const { query } = route

    if (query.embed) {
      $client.files.embed.mutate(query.embed as string).catch((err) => {
        errorHandler(err)
      })
    } else {
      closeSSE()
    }

    const chatWindow = document.getElementById('chat-window')
    if (chatWindow) {
      const xH = chatWindow.scrollHeight
      chatWindow.scrollTo(0, xH)
    }
  })

  const embeddingIsSuccess = computed(() => {
    return eventData.value ? !!JSON.parse(eventData.value).finished : false
  })

  watch(eventData, () => {
    closeSSE()
  })
</script>
<template>
  <div>
    <PageNavigation title="Chat" />

    <ChatMessages
      v-if="(embeddingIsSuccess && route.query.embed) || !route.query.embed"
    />
    <div
      id="chat-window"
      v-if="(embeddingIsSuccess && route.query.embed) || !route.query.embed"
    >
      <div
        class="chat"
        v-for="message in messages"
        :key="message.id"
        :class="{
          'chat-end': message.role === 'user',
          'chat-start': message.role !== 'user',
        }"
      >
        <div class="chat-header">
          {{ message.role === 'user' ? 'You' : 'Resumia' }}
        </div>
        <div
          :ref="message.id"
          class="chat-bubble rounded-xl"
        >
          {{ message.content }}
        </div>
      </div>
    </div>
    <div
      v-if="(embeddingIsSuccess && route.query.embed) || !route.query.embed"
      ref="bottomChat"
    />

    <LoadingChat v-else />

    <div class="pb-20">
      <div
        class="fixed bottom-0 inset-x-0 px-4 bg-primary-content p-2"
        @submit="handleSubmit"
      >
        <form
          class="form-control flex items-center justify-between flex-row space-x-2"
        >
          <textarea
            ref="textarea"
            v-model="input"
            class="resize-none textarea textarea-primary rounded-xl flex-1"
            placeholder="What's on your mind?"
          />
          <button
            type="submit"
            class="bg-primary text-primary-content h-12 w-12 rounded-full flex items-center justify-center"
            :defaul="!embeddingIsSuccess"
          >
            <Icon
              name="ph:paper-plane-right-fill"
              class="h-6 w-6"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>