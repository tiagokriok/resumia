<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'

  definePageMeta({
    layout: 'auth',
    protected: false,
  })

  const { $client } = useNuxtApp()
  const { t } = useI18n()
  const router = useRouter()
  const toast = useToast()
  const email = ref<string>('')

  const { mutateAsync: handleSubmit } = useMutation({
    mutationFn: async () =>
      await $client.auth.forgotPassword.mutate(email.value),
    onSuccess: () => {
      toast.add({
        group: 'top-right',
        title: t('auth.forgotPassword.success.title'),
        type: 'success',
        text: t('auth.forgotPassword.success.description'),
      })

      router.push({
        path: '/app/check-email',
        query: {
          email: email.value,
        },
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
        @click="router.back()"
      >
        <Icon name="ph:arrow-left-bold" />
        <span>{{ $t('common.back') }}</span>
      </button>
    </div>
    <div class="space-y-6 pt-8">
      <div class="space-y-2">
        <h1 class="text-3xl font-extrabold">
          {{ $t('auth.forgotPassword.title') }}
        </h1>
        <p class="font-medium text-md">
          {{ $t('auth.forgotPassword.description') }}
        </p>
      </div>
      <div>
        <form
          class="space-y-4"
          @submit.prevent="handleSubmit()"
        >
          <div class="form-control w-full">
            <label
              for="email"
              class="label"
            >
              <span class="label-text">{{
                $t('auth.forgotPassword.email')
              }}</span>
            </label>
            <input
              v-model="email"
              type="email"
              class="input input-bordered input-secondary w-full"
            />
          </div>
          <div class="form-control w-full">
            <button
              class="btn btn-secondary btn-block"
              type="submit"
            >
              {{ $t('auth.forgotPassword.btnSend') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
