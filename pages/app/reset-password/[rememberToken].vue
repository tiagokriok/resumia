<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { useAuthStore } from '~/stores/auth'

  definePageMeta({
    layout: 'auth',
    protected: false,
  })

  const { $client } = useNuxtApp()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const { logout } = useAuthStore()
  const { rememberToken } = route.params
  const form = reactive({
    password: '',
    confirmPassword: '',
  })

  const { mutateAsync: resetPassword } = useMutation({
    mutationFn: $client.auth.resetPassword.mutate,
    onSuccess: async () => {
      toast.add({
        group: 'top-right',
        title: t('auth.resetPassword.success.title'),
        type: 'success',
        text: t('auth.resetPassword.success.description'),
      })
      logout()
      await router.push({
        path: '/app/login',
      })
    },
    onError: (error) => errorHandler(error),
  })
</script>
<template>
  <div class="">
    <div class="grid grid-cols-1 w-full h-16 fixed inset-x-0 top-0 px-4 z-50">
      <button
        class="flex items-center space-x-2"
        @click="
          router.push({
            path: '/app/login',
          })
        "
      >
        <Icon name="ph:arrow-left-bold" />
        <span>{{ $t('common.back') }}</span>
      </button>
    </div>
    <div class="space-y-6 pt-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-extrabold">
          {{ $t('auth.resetPassword.title') }}
        </h1>
        <p class="font-medium text-md">
          {{ $t('auth.resetPassword.description') }}
        </p>
      </div>
      <div>
        <form
          class="space-y-2"
          @submit.prevent="
            resetPassword({
              rememberToken: rememberToken as string,
              password: form.password,
              confirmPassword: form.confirmPassword,
            })
          "
        >
          <div class="form-control w-full">
            <label
              for="password"
              class="label"
            >
              <span class="label-text">{{
                $t('auth.resetPassword.password')
              }}</span>
            </label>
            <input
              v-model="form.password"
              name="password"
              type="password"
              class="input input-bordered input-secondary w-full"
            />
            <label class="label">
              <span class="label-text-alt">{{
                $t('auth.resetPassword.passwordHint')
              }}</span>
            </label>
          </div>
          <div class="form-control w-full">
            <label
              for="confirmPassword"
              class="label"
            >
              <span class="label-text">{{
                $t('auth.resetPassword.confirmPassword')
              }}</span>
            </label>
            <input
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              class="input input-bordered input-secondary w-full"
            />
            <label class="label">
              <span class="label-text-alt">{{
                $t('auth.resetPassword.confirmPasswordHint')
              }}</span>
            </label>
          </div>
          <div class="form-control w-full">
            <button
              class="btn btn-secondary btn-block"
              type="submit"
            >
              {{ $t('auth.resetPassword.btnReset') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
