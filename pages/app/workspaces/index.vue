<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { useAuthStore } from '../../../stores/auth'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const auth = useAuthStore()

  const file = ref<File>()
  const question = ref('')
  const questionEnabled = ref(false)
  const eventSource = ref()

  const embeddingIsDone = computed(() =>
    eventSource.value?.data
      ? !!JSON.parse(eventSource.value.data).finished
      : false,
  )

  const { $client } = useNuxtApp()

  const { mutateAsync: createPresignedUrl, data } = useMutation({
    mutationFn: $client.files.createPresignedUrl.mutate,
    onSuccess: async ({ file: doc, presignedUrl: url }) => {
      if (file.value) {
        const formData = new FormData()
        formData.append('file', file.value)
        formData.append('Content-Type', doc.mimeType)

        await useFetch(url, {
          method: 'PUT',
          body: formData,
        })
          .then(async (res) => {
            if (res.status.value === 'success') {
              console.info('File uploaded')
              eventSource.value = useEventSource(`/api/${doc.id}`)
              $client.files.embedFile.mutate(doc.id).catch((err) => {
                errorHandler(err)
              })
            }
          })
          .catch((err) => {
            errorHandler(err)
          })
      } else {
        console.info('No file selected')
      }
      return doc
    },
    onError: (error) => errorHandler(error),
  })

  const uploadFile = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length) {
      file.value = target.files[0]

      await createPresignedUrl({
        label: file.value.name,
        name: file.value.name,
        size: file.value.size,
        mimeType: file.value.type,
        type: 'document',
      })
    }
  }

  const send = async () => {
    console.log('send', auth.access_token)
    await useFetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        question: question.value,
        fileId: data.value?.file.id,
      }),
      headers: {
        Authorization: auth.access_token,
      },
    })
  }
</script>
<template>
  <div class="flex flex-col h-screen">
    <div class="form-control self-start">
      <input
        @change="uploadFile"
        type="file"
        class="file-input file-input-bordered file-input-accent w-full max-w-xs rounded-full"
        accept="application/pdf"
      />
    </div>
    <p v-if="embeddingIsDone">{{ eventSource.data }}</p>
    <div
      v-if="embeddingIsDone"
      class="form-control flex-1 place-content-end my-8 w-full max-w-xs"
    >
      <div class="join">
        <input
          v-model="question"
          class="input input-bordered input-accent join-item max-w-xs w-full rounded-l-full"
          placeholder="Question"
        />
        <button
          class="btn btn-outline join-item rounded-r-full btn-accent"
          @click="send"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
