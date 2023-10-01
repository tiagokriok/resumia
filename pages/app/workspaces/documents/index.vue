<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { formatBytes } from '~/lib/utils/index'
  import { File as IFile } from '~/server/modules/files/files.schema'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
  })

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
  const { isMobile } = useDevice()
  const router = useRouter()

  const deleteModal = ref<HTMLDialogElement | null>(null)
  const updateModal = ref<HTMLDialogElement | null>(null)
  const viewModal = ref<HTMLDialogElement | null>(null)
  const createModal = ref<HTMLDialogElement | null>(null)
  const file = ref<SelectedFile>()
  const search = ref<string>('')
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

  const {
    data: files,
    refetch: refetchFiles,
    isFetching,
  } = useQuery({
    queryKey: ['files'],
    queryFn: async () =>
      await $client.files.find.query({
        limit: 999,
        order: 'desc',
        orderBy: 'createdAt',
        ...(search.value && { searchText: search.value }),
      }),
    initialData: { items: [], total: 0 },
  })

  const { mutateAsync: updateFile } = useMutation({
    mutationFn: async () => {
      if (!file.value) {
        return toast.add({
          group: 'top-right',
          title: t('errors.files.noFileSelectedTitle'),
          type: 'error',
          text: t('errors.files.noFileSelectedDescription'),
        })
      }
      await $client.files.update.mutate({
        id: file.value.id,
        label: form.label,
      })
      updateModal.value?.close()
    },
    onSuccess: async () => {
      await refetchFiles()
    },
    onError: (error) => errorHandler(error),
  })

  const { mutateAsync: deleteFile } = useMutation({
    mutationFn: async () => {
      if (!file.value) {
        return toast.add({
          group: 'top-right',
          title: t('errors.files.noFileSelectedTitle'),
          type: 'error',
          text: t('errors.files.noFileSelectedDescription'),
        })
      }
      await $client.files.delete.mutate(file.value.id)
      deleteModal.value?.close()
    },
    onSuccess: async () => {
      await refetchFiles()
    },
    onError: (error) => errorHandler(error),
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

  onMounted(async () => {
    await refetchFiles()
  })

  const openModal = (
    modalName: 'create' | 'update' | 'delete' | 'view',
    selectedFile?: SelectedFile,
  ) => {
    switch (modalName) {
      case 'update':
        viewModal.value?.close()
        deleteModal.value?.close()
        createModal.value?.close()
        if (!file) {
          return toast.add({
            group: 'top-right',
            title: t('errors.files.noFileSelectedTitle'),
            type: 'error',
            text: t('errors.files.noFileSelectedDescription'),
          })
        }
        form.label = selectedFile ? selectedFile.label : ''
        updateModal.value?.showModal()
        break
      case 'delete':
        viewModal.value?.close()
        updateModal.value?.close()
        createModal.value?.close()
        deleteModal.value?.showModal()
        break
      case 'view':
        deleteModal.value?.close()
        updateModal.value?.close()
        createModal.value?.close()
        if (!selectedFile) {
          return toast.add({
            group: 'top-right',
            title: t('errors.files.noFileSelectedTitle'),
            type: 'error',
            text: t('errors.files.noFileSelectedDescription'),
          })
        }
        file.value = selectedFile
        viewModal.value?.showModal()
        break
      case 'create':
        viewModal.value?.close()
        updateModal.value?.close()
        deleteModal.value?.close()
        createModal.value?.showModal()
        break
      default:
        break
    }
  }

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

  const filesParsed = computed(() => {
    return files.value.items.map((file) => {
      return {
        ...file,
        size: formatBytes(file.size),
      }
    })
  })
</script>
<template>
  <div class="space-y-4 font-lato">
    <Search
      v-model="search"
      label="files.index.searchLabel"
      placeholder="files.index.searchPlaceholder"
      @search="refetchFiles()"
    />
    <div>
      <h2 class="text-xl font-bold">{{ $t('files.index.title') }}</h2>
    </div>
    <div>
      <table class="table">
        <tbody>
          <tr
            v-for="file in filesParsed"
            :key="file.id"
            class="flex items-center justify-between"
          >
            <td>
              <div class="flex items-center space-x-3">
                <div>
                  <div>
                    <Icon
                      name="ph:file-pdf"
                      class="h-8 w-8 text-secondary"
                    />
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ file.label }}</div>
                  <div class="text-sm opacity-50">{{ file.name }}</div>
                </div>
              </div>
            </td>
            <td
              class="hidden md:flex flex-col items-center justify-center space-y-1"
            >
              <span class="badge badge-secondary badge-sm capitalize">{{
                file.type
              }}</span>
              <span>{{ file.size }}</span>
            </td>
            <td class="flex items-center justify-end">
              <button
                class="dropdown dropdown-bottom dropdown-end flex items-center justify-center"
              >
                <Icon
                  name="ph:dots-three-vertical"
                  class="h-8 w-8"
                />
                <ul
                  class="dropdown-content z-50 menu p-1 shadow bg-base-100 rounded-xl w-40"
                >
                  <li>
                    <button
                      class="flex items-center justify-between rounded-xl"
                      @click="openModal('update', file)"
                    >
                      <Icon
                        name="ph:pencil"
                        class="h-6 w-6"
                      />
                      <span>{{ $t('common.buttons.edit') }}</span>
                    </button>
                  </li>
                  <li>
                    <button
                      class="flex items-center justify-between rounded-xl"
                      @click="openModal('delete', file)"
                    >
                      <Icon
                        name="ph:trash"
                        class="h-6 w-6"
                      />
                      <span>{{ $t('common.buttons.delete') }}</span>
                    </button>
                  </li>
                </ul>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filesParsed.length === 0">
      <p class="text-center text-md font-semibold">
        {{ $t('files.index.noFiles') }}
      </p>
    </div>
  </div>
  <ClientOnly>
    <Teleport
      to="body"
      v-if="isFetching"
    >
      <Loading />
    </Teleport>
    <Teleport to="body">
      <dialog
        ref="viewModal"
        class="modal modal-bottom sm:modal-middle"
        aria-modal="true"
      >
        <div class="modal-box space-y-4">
          <h3 class="font-bold text-lg">{{ file?.label }}</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <p>
                <span class="font-semibold text-md"
                  >{{ $t('files.index.dialog.view.filename') }}:</span
                >
                {{ file?.name }}
              </p>
            </div>
          </div>
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div class="modal-action">
            <button
              @click="openModal('delete')"
              class="btn btn-ghost btn-circle"
            >
              <Icon
                name="ph:trash"
                class="h-6 w-6"
              />
            </button>
            <button
              @click="openModal('update')"
              class="btn btn-secondary btn-circle"
            >
              <Icon
                name="ph:pencil"
                class="h-6 w-6"
              />
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
    <Teleport to="body">
      <dialog
        ref="updateModal"
        class="modal modal-bottom sm:modal-middle"
        aria-modal="true"
      >
        <div class="modal-box space-y-4">
          <h3 class="font-bold text-lg">
            {{ $t('files.index.dialog.update.title') }}
          </h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">{{
                $t('files.index.dialog.update.label')
              }}</span>
            </label>
            <input
              v-model="form.label"
              type="text"
              class="input input-bordered input-secondary w-full rounded-xl"
            />
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
              @click="updateFile()"
            >
              {{ $t('common.buttons.save') }}
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
    <Teleport to="body">
      <dialog
        ref="deleteModal"
        class="modal modal-bottom sm:modal-middle"
        aria-modal="true"
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">
            {{ $t('files.index.dialog.delete.title') }}
          </h3>
          <p class="py-4">{{ $t('files.index.dialog.delete.description') }}</p>
          <div class="modal-action">
            <button
              class="btn btn-secondary rounded-xl"
              @click="deleteFile()"
            >
              {{ $t('common.buttons.delete') }}
            </button>
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-outline rounded-xl">
                {{ $t('common.buttons.cancel') }}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </Teleport>
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
    <Teleport
      to="body"
      v-if="!isFetching"
    >
      <div class="pb-12 md:pb-0" />
      <div
        class="tooltip tooltip-secondary absolute bottom-14 md:bottom-2 right-0 z-50 -translate-x-1/2 -translate-y-1/2"
        data-tip="Upload"
      >
        <button
          class="btn btn-circle btn-secondary hover:scale-105 duration-300 shadow-lg shadow-secondary/40"
          @click="openModal('create')"
        >
          <Icon
            name="ph:upload-simple-bold"
            class="h-6 w-6 text-slate-50"
          />
        </button>
      </div>
    </Teleport>
    <Teleport
      to="body"
      v-if="isCreatingFile || isCreatingChat || isUploading"
    >
      <Loading :message="loadingMessage" />
    </Teleport>
  </ClientOnly>
</template>
