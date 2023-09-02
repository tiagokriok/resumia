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
</script>
<template>
  <!-- <div class="flex flex-col h-screen">
    <div class="form-control self-start">
      <input
        @change="uploadFile"
        type="file"
        class="file-input file-input-bordered file-input-accent w-full max-w-xs rounded-full"
        accept="application/pdf"
      />
    </div>
    <p v-if="embeddingIsDone">{{ eventSource.data }}</p>
  </div> -->
  <div>
    <div>
      <div></div>
      <div></div>
    </div>
    <div></div>

    <div></div>
  </div>
</template>
