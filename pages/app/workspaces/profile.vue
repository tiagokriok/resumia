<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'

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

  const { mutateAsync: setLanguage } = useMutation({
    mutationFn: $client.users.updateLanguage.mutate,
    onMutate: () => {
      setLocaleCookie(locale.value)
    },
  })
</script>
<template>
  <PageNavigation
    title="Profile"
    backTo="/app/workspaces"
  />
  <div class="flex flex-col space-y-4 pt-4">
    <div>
      <h2 class="text-xl font-bold">Account</h2>
    </div>
    <div class="flex items-center justify-between space-x-4">
      <Avatar />
      <div class="flex flex-col flex-1">
        <h3>Tiago</h3>
        <p>tiago@teste.com</p>
      </div>
      <button>
        <Icon name="ph:pencil" />
      </button>
    </div>
    <div>
      <h2 class="text-xl font-bold">Preferences</h2>
    </div>
    <div class="grid grid-cols-1 gap-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:sun-bold" />
          </div>
          <p>Dark mode</p>
        </div>
        <input
          type="checkbox"
          class="toggle rounded-xl"
        />
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div
            class="bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Icon name="ph:translate-bold" />
          </div>
          <p>Language</p>
        </div>
        <select
          v-model="locale"
          @change="setLanguage(locale as Language)"
          class="select select-primary select-sm rounded-xl"
        >
          <option value="en-US">{{ $t('common.languages.en') }}</option>
          <option value="es-ES">{{ $t('common.languages.es') }}</option>
          <option value="pt-BR">{{ $t('common.languages.br') }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
