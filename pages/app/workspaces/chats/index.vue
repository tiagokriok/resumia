<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const { $client } = useNuxtApp()

  const deleteModal = ref<HTMLDialogElement | null>(null)
  const createModal = ref<HTMLDialogElement | null>(null)
  const chatIdDelete = ref<string>('')
  const fileSelected = ref<{ id: string; label: string }>()

  const {
    data: chats,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['chats'],
    queryFn: async () =>
      await $client.chats.find.query({
        limit: 999,
        order: 'desc',
        orderBy: 'updatedAt',
      }),
    initialData: { items: [], total: 0 },
  })

  const { data: files, refetch: refetchFiles } = useQuery({
    queryKey: ['files'],
    queryFn: async () =>
      await $client.files.find.query({
        limit: 999,
        order: 'desc',
        orderBy: 'createdAt',
      }),
    initialData: { items: [], total: 0 },
  })

  onMounted(async () => {
    await refetch()
  })

  const openCreateModal = async () => {
    await refetchFiles()
    createModal.value?.showModal()
  }

  const deleteChat = async () => {
    deleteModal.value?.close()
    await $client.chats.delete.mutate(chatIdDelete.value)
    await refetch()
  }

  const openModal = (id: string) => {
    console.log('delete', id)
    chatIdDelete.value = id
    deleteModal.value?.showModal()
  }
</script>
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-xl font-bold">Chat history</p>
      <button
        @click="openCreateModal"
        class="capitalize bg-primary text-primary-content font-semibold text-lg h-10 w-10 rounded-full flex items-center justify-center hover:scale-95 duration-300"
      >
        <Icon
          name="ph:plus-bold"
          class="h-5 w-5"
        />
      </button>
    </div>

    <div v-if="!isFetching">
      <div
        v-for="chat in chats.items"
        :key="chat.id"
        class="flex items-center space-x-2 bg-secondary text-secondary-content rounded-xl py-4 justify-evenly px-2 cursor-pointer max-h-24 shadow-md content hover:scale-105 duration-300"
      >
        <div
          class="bg-secondary-content rounded-full h-12 w-12 flex items-center justify-center text-secondary"
        >
          <Icon
            name="ph:chats-circle"
            class="h-8 w-8"
          />
        </div>
        <div class="flex-1 w-20 space-y-2 item-body">
          <h2 class="capitalize text-md font-semibold">
            {{ chat.file.label }}
          </h2>
          <p class="text-sm line-clamp-2">
            {{ chat.messages.length ? chat.messages.at(-1)?.content : '' }}
          </p>
        </div>
        <button
          class="dropdown dropdown-bottom dropdown-end flex items-center justify-center text-secondary-content"
        >
          <Icon
            name="ph:dots-three-vertical"
            class="h-8 w-8"
          />
          <ul
            class="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-xl w-40 text-primary"
          >
            <li>
              <button
                class="flex items-center justify-between rounded-xl"
                @click="openModal(chat.id)"
              >
                <Icon
                  name="ph:trash"
                  class="h-6 w-6"
                />
                <span>Delete</span>
              </button>
            </li>
          </ul>
        </button>
      </div>
    </div>
    <Teleport
      to="body"
      v-if="isFetching"
    >
      <Loading />
    </Teleport>
    <Teleport to="body">
      <dialog
        ref="deleteModal"
        class="modal modal-bottom sm:modal-middle z-50"
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">Confirm deletion</h3>
          <p class="py-4">Are you sure you want to delete this chat?</p>
          <div class="modal-action">
            <button
              class="btn btn-primary rounded-xl"
              @click="deleteChat"
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
      <dialog
        ref="createModal"
        class="modal modal-bottom sm:modal-middle z-50"
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">Create chat</h3>
          <div class="form-control w-full my-2">
            <label class="label">
              <span class="label-text">Select a file to chat with</span>
            </label>
            <select
              v-model="fileSelected"
              class="select select-bordered select-primary rounded-xl"
            >
              <option
                disabled
                selected
              >
                Pick one
              </option>
              <option
                v-for="file in files.items"
                :key="file.id"
                :value="{ label: file.label, id: file.id }"
              >
                {{ file.label }}
              </option>
            </select>
          </div>
          <NuxtLink
            to="/app/workspaces/files/create"
            class="link link-primary"
            >Upload file</NuxtLink
          >
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-outline rounded-xl">Close</button>
            </form>
            <button
              class="btn btn-primary rounded-xl"
              @click="deleteChat"
            >
              Create
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>
