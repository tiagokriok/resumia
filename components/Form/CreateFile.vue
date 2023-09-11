<script lang="ts" setup>
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { File as IFile } from '~/server/modules/files/files.schema'

  const { t } = useI18n()

  const form = reactive<{
    label: string
    description: string
    file: File | undefined
  }>({
    label: '',
    description: '',
    file: undefined,
  })
  const isUploading = ref(false)

  const { $client } = useNuxtApp()
  const toast = useToast()
  const router = useRouter()

  const { mutateAsync: createChat, isLoading: isCreatingChat } = useMutation({
    mutationFn: $client.chats.create.mutate,
    onSuccess: async ({ id, file }) => {
      await router.push({
        path: `/app/workspaces/chats/${id}`,
        query: {
          embed: file.id,
        },
      })
    },
  })

  const uploadFile = async (
    file: IFile,
    url: string,
    fields: Record<string, string>,
  ) => {
    try {
      isUploading.value = true
      const formData = new FormData()
      if (form.file) {
        if (fields) {
          for (const [key, value] of Object.entries(fields)) {
            formData.append(key, value)
          }
        }
        formData.append('file', form.file)

        await useFetch(url, {
          method: 'POST',
          body: formData,
          onResponse: async (ctx) => {
            console.log(ctx)
            if (!ctx.response.ok) {
              await $client.files.delete.mutate(file.id)
              toast.add({
                group: 'top-right',
                title: 'Error',
                type: 'error',
                text: 'Uploading file failed',
              })
            }

            if (ctx.response.ok) {
              await createChat({
                id: file.id,
                label: file.label,
              })
            }
          },
        })
      } else {
        console.error('No file selected')
        toast.add({
          group: 'top-right',
          title: t('files.create.error.noFileSelectedTitle'),
          type: 'error',
          text: t('files.create.error.noFileSelectedDescription'),
        })
      }
    } catch (err) {
      errorHandler(err)
    } finally {
      isUploading.value = false
    }
  }

  const { mutateAsync: createFile, isLoading: isCreatingFile } = useMutation({
    mutationFn: $client.files.create.mutate,
    onSuccess: async ({ file, fields, url }) => {
      await uploadFile(file, url, fields)
      return file
    },
    onError: (error) => errorHandler(error),
  })

  const handleSubmit = async () => {
    if (form.file) {
      await createFile({
        label: form.label,
        description: form.description,
        name: form.file.name,
        size: form.file.size,
        mimeType: form.file.type,
        type: 'document',
      })
    } else {
      toast.add({
        group: 'top-right',
        title: t('files.create.error.noFileSelectedTitle'),
        type: 'error',
        text: t('files.create.error.noFileSelectedDescription'),
      })
    }
  }

  const changeFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length) {
      form.file = target.files[0]
    }
  }

  const loadingMessage = computed((): string => {
    if (isUploading.value) {
      return 'File Uploading'
    }
    if (isCreatingFile.value) {
      return 'Creating File'
    }
    if (isCreatingChat.value) {
      return 'Creating Chat'
    }
    return 'Loading...'
  })
</script>
<template>
  <form
    class="grid space-y-4"
    @submit.prevent="handleSubmit"
  >
    <div class="grid w-full space-y-2">
      <div class="form-control">
        <label class="label">
          <span class="text-md font-semibold">{{
            $t('files.create.label')
          }}</span>
        </label>
        <input
          v-model="form.label"
          type="text"
          class="input input-bordered input-primary rounded-xl"
        />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="text-md font-semibold">{{
            $t('files.create.description')
          }}</span>
        </label>
        <textarea
          v-model="form.description"
          class="textarea textarea-primary rounded-xl"
        ></textarea>
      </div>
      <div class="form-control">
        <label class="label">
          <span class="text-md font-semibold">{{
            $t('files.create.uploadFile')
          }}</span>
        </label>
        <div class="flex items-center justify-center w-full">
          <label
            for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-primary/70 border-dashed rounded-xl cursor-pointer bg-base-100"
          >
            <div
              v-if="!form.file"
              class="flex flex-col items-center justify-center pt-5 pb-6 text-base-content"
            >
              <Icon
                name="ph:cloud-arrow-up"
                class="h-8 w-8"
              />
              <p class="mb-2">
                <span class="font-semibold">{{
                  $t('files.create.clickUpload')
                }}</span>
              </p>
              <p class="text-sm">PDF</p>
            </div>
            <div
              v-else
              class="flex flex-col items-center justify-center pt-5 pb-6 text-base-content"
            >
              <Icon
                name="ph:file-pdf"
                class="h-8 w-8"
              />
              <p class="text-sm">{{ form.file.name }}</p>
            </div>
            <input
              @change="changeFile"
              id="dropzone-file"
              type="file"
              class="hidden"
              accept="application/pdf"
            />
          </label>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <Button
        label="common.buttons.cancel"
        type="button"
        @click="router.back()"
      />
      <Button
        button-class="btn-primary"
        label="common.buttons.create"
        type="submit"
      />
    </div>
  </form>
  <Teleport
    to="body"
    v-if="isCreatingFile || isCreatingChat || isUploading"
  >
    <Loading :message="loadingMessage" />
  </Teleport>
</template>
