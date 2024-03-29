<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { User } from '~/server/modules/users/users.schema'
  import { useAuthStore } from '~/stores/auth'

  type Language = 'pt-BR' | 'en-US' | 'es-ES'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
    hideNavigation: true,
    hideHeader: true,
  })

  const { locale, setLocaleCookie } = useI18n()
  const { $client } = useNuxtApp()
  const colorMode = useColorMode()
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const darkMode = ref(false)
  const updateModal = ref<HTMLDialogElement | null>(null)
  const profileForm = reactive({
    name: user.name,
    email: user.email,
  })

  const { mutateAsync: setLanguage } = useMutation({
    mutationFn: $client.users.updateLanguage.mutate,
    onMutate: () => {
      setLocaleCookie(locale.value)
    },
  })

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async () => $client.users.updateProfile.mutate(profileForm),
    onSuccess: (result) => {
      console.log(result)
      setUser(result as unknown as User)
      updateModal.value?.close()
    },
  })

  onMounted(() => {
    darkMode.value = colorMode.preference === 'night'
  })

  watch(darkMode, () => {
    colorMode.preference = darkMode.value ? 'night' : 'winter'
  })

  const openModal = (modalName: string) => {
    switch (modalName) {
      case 'update':
        updateModal.value?.showModal()
        break
    }
  }
</script>
<template>
  <PageNavigation
    title="Profile"
    backTo="/app/workspaces"
  />
  <div class="flex flex-col space-y-4 pt-4">
    <div>
      <h2 class="text-xl font-bold">{{ $t('profile.account') }}</h2>
    </div>
    <div class="flex items-center justify-between space-x-4">
      <Avatar />
      <div class="flex flex-col flex-1">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
      </div>
      <button @click="openModal('update')">
        <Icon name="ph:pencil" />
      </button>
    </div>
    <div>
      <h2 class="text-xl font-bold">{{ $t('profile.preferences.title') }}</h2>
    </div>
    <div class="grid grid-cols-1 gap-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="bg-secondary dark:bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Icon
              name="ph:sun-bold"
              class="text-secondary-content dark:text-secondary"
            />
          </div>
          <p>{{ $t('profile.preferences.darkMode') }}</p>
        </div>
        <input
          v-model="darkMode"
          type="checkbox"
          class="toggle rounded-xl toggle-secondary"
        />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="bg-secondary dark:bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Icon
              name="ph:translate-bold"
              class="text-secondary-content dark:text-secondary"
            />
          </div>
          <p>{{ $t('profile.preferences.language') }}</p>
        </div>
        <select
          v-model="locale"
          @change="setLanguage(locale as Language)"
          class="select select-secondary select-sm rounded-xl"
        >
          <option value="en-US">{{ $t('common.languages.en') }}</option>
          <option value="es-ES">{{ $t('common.languages.es') }}</option>
          <option value="pt-BR">{{ $t('common.languages.br') }}</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="bg-secondary dark:bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Icon
              name="ph:password-bold"
              class="text-secondary-content dark:text-secondary"
            />
          </div>
          <p>{{ $t('profile.preferences.changePassword') }}</p>
        </div>
        <button
          class="btn btn-circle btn-ghost"
          @click="router.push('/app/forgot-password')"
        >
          <Icon name="ph:caret-right" />
        </button>
      </div>
    </div>
  </div>
  <ClientOnly>
    <Teleport to="body">
      <dialog
        ref="updateModal"
        class="modal modal-bottom sm:modal-middle"
        aria-modal="true"
      >
        <div class="modal-box space-y-2">
          <h3 class="font-bold text-lg">
            {{ $t('profile.dialog.update.title') }}
          </h3>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">{{
                $t('profile.dialog.update.name')
              }}</span>
            </label>
            <input
              v-model="profileForm.name"
              type="text"
              class="input input-bordered input-secondary w-full rounded-xl"
            />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">{{
                $t('profile.dialog.update.email')
              }}</span>
            </label>
            <input
              v-model="profileForm.email"
              type="email"
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
              @click="updateProfile()"
            >
              {{ $t('common.buttons.save') }}
            </button>
          </div>
        </div>
      </dialog>
    </Teleport>
  </ClientOnly>
</template>
