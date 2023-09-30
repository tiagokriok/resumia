<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { File as IFile } from '~/server/modules/files/files.schema'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
  })

  const { $client } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()

  const deleteModal = ref<HTMLDialogElement | null>(null)
  const updateModal = ref<HTMLDialogElement | null>(null)
  const viewModal = ref<HTMLDialogElement | null>(null)
  const file = ref<IFile>()
  const search = ref<string>('')
  const form = reactive({
    label: '',
    description: '',
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
        description: form.description,
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

  onMounted(async () => {
    await refetchFiles()
  })

  const openModal = (modalName: string, selectedFile?: IFile) => {
    switch (modalName) {
      case 'update':
        viewModal.value?.close()
        deleteModal.value?.close()
        if (!file.value) {
          return toast.add({
            group: 'top-right',
            title: t('errors.files.noFileSelectedTitle'),
            type: 'error',
            text: t('errors.files.noFileSelectedDescription'),
          })
        }
        form.label = file.value.label
        form.description = file.value.description ?? ''
        updateModal.value?.showModal()
        break
      case 'delete':
        viewModal.value?.close()
        updateModal.value?.close()
        deleteModal.value?.showModal()
        break
      case 'view':
        deleteModal.value?.close()
        updateModal.value?.close()
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
      default:
        break
    }
  }
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

    <div class="grid grid-cols-2 gap-2 select-none">
      <button
        v-for="file in files.items"
        class="bg-primary-content dark:bg-neutral rounded-xl cursor-pointer py-4 px-2 shadow-md hover:scale-105 duration-300 h-24 flex flex-col items-center justify-center space-y-2"
        :key="file.id"
        @click="openModal('view', file)"
      >
        <Icon
          name="ph:file-pdf"
          class="h-12 w-12 text-secondary"
        />
        <p>{{ file.label }}</p>
      </button>
    </div>
    <div v-if="files.items.length === 0">
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
            <div
              v-if="file?.description"
              class="col-span-2"
            >
              <p>
                <span class="font-semibold text-md"
                  >{{ $t('files.index.dialog.view.description') }}:</span
                >
                {{ file.description }}
              </p>
            </div>
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
        <div class="modal-box space-y-2">
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
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">{{
                $t('files.index.dialog.update.description')
              }}</span>
            </label>
            <textarea
              v-model="form.description"
              class="textarea textarea-secondary rounded-xl"
            ></textarea>
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
    <Teleport
      to="body"
      v-if="!isFetching"
    >
      <div class="pb-12" />
      <NuxtLink
        to="/app/workspaces/documents/create"
        class="btn btn-circle btn-secondary hover:scale-105 duration-300 fixed bottom-14 right-0 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-secondary/40"
      >
        <Icon
          name="ph:upload-simple-bold"
          class="h-6 w-6 text-slate-50"
        />
      </NuxtLink>
    </Teleport>
  </ClientOnly>
</template>
