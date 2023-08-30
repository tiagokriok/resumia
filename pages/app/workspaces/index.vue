<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const file = ref<File>()
  const question = ref('')
  const questionEnabled = ref(false)

  const { $client } = useNuxtApp()

  const { mutateAsync: createPresignedUrl } = useMutation({
    mutationFn: $client.files.createPresignedUrl.mutate,
    onSuccess: async ({ file: { mimeType, id }, presignedUrl: url }) => {
      if (file.value) {
        const formData = new FormData()
        formData.append('file', file.value)
        formData.append('Content-Type', mimeType)

        await useFetch(url, {
          method: 'PUT',
          body: formData,
        })
          .then((res) => {
            if (res.status.value === 'success') {
              console.info('File uploaded')
            }
          })
          .catch((err) => {
            errorHandler(err)
          })
      } else {
        console.info('No file selected')
      }
      return id
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
    <div
      v-if="questionEnabled"
      class="form-control flex-1 place-content-end my-8 w-full max-w-xs"
    >
      <div class="join">
        <input
          v-model="question"
          class="input input-bordered input-accent join-item max-w-xs w-full rounded-l-full"
          placeholder="Question"
        />
        <button class="btn btn-outline join-item rounded-r-full btn-accent">
          Send
        </button>
      </div>
    </div>
  </div>
</template>
