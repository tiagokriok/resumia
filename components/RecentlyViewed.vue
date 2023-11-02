<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { File as IFile } from '~/server/modules/files/files.schema'

  interface SelectedFile {
    label: 'string'
    name: 'string'
    id: 'string'
    size: 'string'
    mimeType: 'string'
    type: 'image' | 'video' | 'audio' | 'document'
    description: 'string'
    sha256: 'string'
    url: 'string'
    createdAt: Date
    isDeleted: boolean
    sharable: boolean
    owner: {
      id: 'string'
      name: 'string'
    }
  }

  const { $client } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const createModal = ref<HTMLDialogElement | null>(null)
  const file = ref<SelectedFile>()
  const form = reactive<{
    label: string
    file: File | undefined
  }>({
    label: '',
    file: undefined,
  })
  const isUploading = ref(false)

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
      createModal.value?.close()
      return file
    },
    onError: (error) => errorHandler(error),
  })

  const changeFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length) {
      form.file = target.files[0]
    }
  }

  const createDocument = async () => {
    if (form.file) {
      await createFile({
        label: form.label,
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

  const { data: chats, isLoading } = useQuery({
    queryKey: ['recentlyViewed'],
    queryFn: async () => {
      return await $client.chats.getRecentlyChats.query()
    },
  })

  const openCreateModal = () => {
    createModal.value?.showModal()
  }
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
          <button
            class="btn btn-secondary text-slate-50"
            @click="openCreateModal"
          >
            {{ $t('common.buttons.create') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <span
    v-if="isLoading"
    class="loading loading-dots loading-md"
  ></span>
  <ClientOnly>
    <Teleport to="body">
      <dialog
        ref="createModal"
        class="modal modal-bottom sm:modal-middle"
        aria-modal="true"
      >
        <div class="modal-box space-y-4">
          <h3 class="font-bold text-lg">
            {{ $t('files.create.title') }}
          </h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">{{
                $t('files.create.label')
              }}</span>
            </label>
            <input
              v-model="form.label"
              type="text"
              class="input input-bordered input-secondary w-full rounded-xl"
            />
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
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-secondary/70 border-dashed rounded-xl cursor-pointer bg-base-100"
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
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-outline rounded-xl">
                {{ $t('common.buttons.cancel') }}
              </button>
            </form>
            <button
              class="btn btn-secondary rounded-xl"
              @click="createDocument()"
            >
              {{ $t('common.buttons.save') }}
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>
