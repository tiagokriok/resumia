<script setup lang="ts">
  import { useChat } from 'ai/vue'
  import { errorHandler } from '~/lib/Error'
  import { useAuthStore } from '~/stores/auth'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
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

    setTimeout(() => {
      bottomChat.value?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 100)
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
    <PageNavigation
      title="Chat"
      backTo="/app/workspaces/chats"
    />

    <ChatMessages
      v-if="(embeddingIsSuccess && route.query.embed) || !route.query.embed"
    />
    <div v-if="(embeddingIsSuccess && route.query.embed) || !route.query.embed">
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
          {{
            message.role === 'user' ? $t('components.messages.you') : 'Resumia'
          }}
        </div>
        <div
          class="chat-bubble"
          :class="{
            'chat-bubble-primary': message.role === 'user',
            'chat-bubble-success': message.role !== 'user',
          }"
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
        class="fixed bottom-0 inset-x-0 px-4 p-2 glass bg-secondary dark:bg-neutral border-none"
      >
        <form
          class="form-control flex items-center justify-between flex-row space-x-2"
          @submit="handleSubmit"
        >
          <textarea
            ref="textarea"
            v-model="input"
            placeholder="Type a message"
            class="resize-none textarea textarea-bordered rounded-xl flex-1"
            @keydown.enter="handleSubmit"
          />
          <button
            type="submit"
            class="bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
            :defaul="!embeddingIsSuccess"
          >
            <Icon
              name="ph:paper-plane-right-fill"
              class="text-secondary"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
