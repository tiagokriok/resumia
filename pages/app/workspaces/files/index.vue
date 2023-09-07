<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { File as IFile } from '~/server/modules/files/files.schema'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const { $client } = useNuxtApp()
  const toast = useToast()
  const router = useRouter()

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
          title: 'Error',
          type: 'error',
          text: 'Please select a file',
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
          title: 'Error',
          type: 'error',
          text: 'Please select a file',
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
            title: 'Error',
            type: 'error',
            text: 'Please select a file',
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
            title: 'Error',
            type: 'error',
            text: 'Please select a file',
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
      placeholder="Search Files"
    />
    <div>
      <h2 class="text-xl font-bold">Your files</h2>
    </div>

    <div class="grid grid-cols-3 gap-2 select-none">
      <button
        v-for="file in files.items"
        class="bg-primary text-primary-content rounded-xl cursor-pointer py-4 px-2 shadow-md hover:scale-105 duration-300 h-24 flex flex-col items-center justify-center space-y-2"
        :key="file.id"
        @click="openModal('view', file)"
      >
        <Icon
          name="ph:file-pdf"
          class="h-12 w-12"
        />
        <p>{{ file.label }}</p>
      </button>
    </div>
    <div
      v-if="files.items.length === 0"
      class="text-center text-md"
    >
      <p class="text-center">Looks like you don't have any files</p>
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
                <span class="font-semibold text-md">Description:</span>
                {{ file.description }}
              </p>
            </div>
            <div class="col-span-2">
              <p>
                <span class="font-semibold text-md">Filename:</span>
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
              class="btn btn-primary btn-circle"
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
          <h3 class="font-bold text-lg">Update File</h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Label</span>
            </label>
            <input
              v-model="form.label"
              type="text"
              class="input input-bordered input-primary w-full rounded-xl"
            />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Description</span>
            </label>
            <textarea
              v-model="form.description"
              class="textarea textarea-primary rounded-xl"
            ></textarea>
          </div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-outline rounded-xl">Close</button>
            </form>
            <button
              class="btn btn-primary rounded-xl"
              @click="updateFile()"
            >
              Save
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
          <h3 class="font-bold text-lg">Confirm deletion</h3>
          <p class="py-4">Are you sure you want to delete this file?</p>
          <div class="modal-action">
            <button
              class="btn btn-primary rounded-xl"
              @click="deleteFile"
            >
              Delete
            </button>
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-outline rounded-xl">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </Teleport>
    <Teleport to="body">
      <div class="pb-12" />
      <NuxtLink
        to="/app/workspaces/files/create"
        class="btn btn-circle btn-primary hover:scale-105 duration-300 fixed bottom-14 right-0 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary/40"
      >
        <Icon
          name="ph:upload-simple-bold"
          class="h-6 w-6"
        />
      </NuxtLink>
    </Teleport>
  </ClientOnly>
</template>
