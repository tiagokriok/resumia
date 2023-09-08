<script setup lang="ts">
  import { useMutation, useQuery } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const { $client } = useNuxtApp()
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const deleteModal = ref<HTMLDialogElement | null>(null)
  const createModal = ref<HTMLDialogElement | null>(null)
  const updateModal = ref<HTMLDialogElement | null>(null)
  const chatIdDelete = ref<string>('')
  const chatIdUpdate = ref<string>('')
  const fileSelected = ref<{ id: string; label: string }>()
  const chatLabel = ref<string>('')
  const search = ref<string>('')

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
        ...(search.value && { searchText: search.value }),
        columns: ['id', 'label', 'file', 'updatedAt', 'messages'],
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

  const { mutateAsync: createChat } = useMutation({
    mutationFn: async () => {
      if (fileSelected.value) {
        return await $client.chats.create.mutate({
          id: fileSelected.value.id,
          label: fileSelected.value.label,
        })
      } else {
        toast.add({
          group: 'top-right',
          title: t('errors.files.noFileSelectedTitle'),
          type: 'error',
          text: t('errors.files.noFileSelectedDescription'),
        })
      }
    },
    onSuccess: async (chat) => {
      if (chat) {
        createModal.value?.close()
        // TODO: router push to chat
        router.push({
          path: `/app/workspaces/chats/${chat.id}`,
        })
      } else {
        toast.add({
          group: 'top-right',
          title: 'Error',
          type: 'error',
          text: t('errors.commons.unknownError'),
        })
      }
    },
    onError: (err) => errorHandler(err),
  })

  const { mutateAsync: updateChat } = useMutation({
    mutationFn: async () => {
      await $client.chats.update.mutate({
        chatId: chatIdUpdate.value,
        label: chatLabel.value,
      })
    },
    onSuccess: async () => {
      updateModal.value?.close()
      await refetch()
    },
    onError: (err) => errorHandler(err),
  })

  onMounted(async () => {
    await refetch()
  })

  const openCreateModal = async () => {
    await refetchFiles()
    createModal.value?.showModal()
  }

  const openUpdateModal = async (id: string, label: string) => {
    chatIdUpdate.value = id
    chatLabel.value = label
    updateModal.value?.showModal()
  }

  const deleteChat = async () => {
    deleteModal.value?.close()
    await $client.chats.delete.mutate(chatIdDelete.value)
    await refetch()
  }

  const openDeleteModal = (id: string) => {
    console.log('delete', id)
    chatIdDelete.value = id
    deleteModal.value?.showModal()
  }
</script>
<template>
  <div class="space-y-4 font-lato">
    <Search
      v-model="search"
      label="chats.index.searchLabel"
      placeholder="chats.index.searchPlaceholder"
      @search="refetch()"
    />
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">{{ $t('chats.index.title') }}</h2>
    </div>

    <div
      v-if="!isFetching"
      class="space-y-4"
    >
      <div
        v-for="chat in chats.items"
        :key="chat.id"
        :to="`/app/workspaces/chats/${chat.id}`"
        class="flex items-center space-x-2 bg-secondary text-secondary-content rounded-xl py-4 justify-evenly px-2 cursor-pointer max-h-24 shadow-md hover:scale-105 duration-300 h-24"
      >
        <NuxtLink
          :to="`/app/workspaces/chats/${chat.id}`"
          class="flex items-center space-x-2 flex-1"
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
            <h3 class="capitalize text-md font-semibold">
              {{ chat.label ?? chat.file.label }}
            </h3>
            <p class="text-sm line-clamp-2">
              {{ chat.messages.length ? chat.messages.at(-1)?.content : '' }}
            </p>
          </div>
        </NuxtLink>
        <button
          class="dropdown dropdown-bottom dropdown-end flex items-center justify-center text-secondary-content"
        >
          <Icon
            name="ph:dots-three-vertical"
            class="h-8 w-8"
          />
          <ul
            class="dropdown-content z-50 menu p-1 shadow bg-base-100 rounded-xl w-40 text-primary"
          >
            <li>
              <button
                class="flex items-center justify-between rounded-xl"
                @click="openUpdateModal(chat.id, chat.label ?? '')"
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
                @click="openDeleteModal(chat.id)"
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
      </div>
      <div
        v-if="chats.items.length === 0"
        class="text-center text-md"
      >
        <p class="text-center">{{ $t('chats.index.noChats') }}</p>
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
          ref="deleteModal"
          class="modal modal-bottom sm:modal-middle"
          aria-modal="true"
        >
          <div class="modal-box">
            <h3 class="font-bold text-lg">
              {{ $t('chats.index.dialog.delete.title') }}
            </h3>
            <p class="py-4">
              {{ $t('chats.index.dialog.delete.description') }}
            </p>
            <div class="modal-action">
              <button
                class="btn btn-primary rounded-xl"
                @click="deleteChat"
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
          <div class="modal-box">
            <h3 class="font-bold text-lg">
              {{ $t('chats.index.dialog.create.title') }}
            </h3>
            <div class="form-control w-full my-2">
              <label class="label">
                <span class="label-text">{{
                  $t('chats.index.dialog.create.label')
                }}</span>
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
              >{{ $t('chats.index.dialog.create.upload') }}</NuxtLink
            >
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-outline rounded-xl">
                  {{ $t('common.buttons.cancel') }}
                </button>
              </form>
              <button
                class="btn btn-primary rounded-xl"
                @click="createChat()"
              >
                {{ $t('common.buttons.create') }}
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
          <div class="modal-box">
            <h3 class="font-bold text-lg">
              {{ $t('chats.index.dialog.update.title') }}
            </h3>
            <div class="form-control w-full my-2">
              <label class="label">
                <span class="label-text font-semibold">{{
                  $t('chats.index.dialog.update.label')
                }}</span>
              </label>
              <input
                v-model="chatLabel"
                type="text"
                class="input input-bordered input-primary w-full max-w-xs rounded-xl"
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
                class="btn btn-primary rounded-xl"
                @click="updateChat()"
              >
                {{ $t('common.buttons.save') }}
              </button>
            </div>
          </div>
        </dialog>
      </Teleport>
      <Teleport to="body">
        <div class="pb-12" />
        <button
          @click="openCreateModal"
          class="btn btn-circle btn-primary hover:scale-105 duration-300 fixed bottom-14 right-0 z-50 -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary/40"
        >
          <Icon
            name="ph:plus-bold"
            class="h-6 w-6"
          />
        </button>
      </Teleport>
    </ClientOnly>
  </div>
</template>
