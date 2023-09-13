<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '~/lib/Error'
  import { useAuthStore } from '~/stores/auth'

  useHead({
    title: 'Login',
  })

  definePageMeta({
    layout: 'auth',
    protected: false,
  })

  const { $client } = useNuxtApp()

  const form = reactive<{ email: string; password: string }>({
    email: '',
    password: '',
  })

  const inputType = ref('password')

  const authStore = useAuthStore()

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: $client.auth.login.mutate,
    onSuccess: (result) => {
      authStore.login(result)
      return navigateTo('/app/workspaces')
    },
    onError: (error) => errorHandler(error),
  })

  const submit = async () => {
    await mutateAsync(form)
  }
</script>
<template>
  <div>
    <div
      class="card rounded-xl border border-slate-700 bg-base-100 p-4 shadow-xl shadow-slate-700 md:w-96"
    >
      <div class="card-title">
        <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
          {{ $t('auth.login.title') }}
        </h1>
      </div>

      <div class="card-body space-y-4 md:space-y-6">
        <div class="form-control">
          <label
            for="email"
            class="text-md label mb-2 block font-medium"
          >
            <span class="label-text"> {{ $t('auth.login.email') }}</span>
          </label>
          <input
            v-model="form.email"
            name="email"
            type="email"
            class="input input-bordered rounded-xl"
          />
        </div>
        <div class="form-control">
          <label
            for="password"
            class="text-md label mb-2 block font-medium"
          >
            <span class="label-text">
              {{ $t('auth.login.password') }}
            </span>
          </label>
          <div class="join">
            <input
              v-model="form.password"
              name="password"
              :type="inputType"
              class="input join-item input-bordered w-full rounded-xl"
            />
            <button
              class="btn btn-outline join-item rounded-xl"
              @click="
                inputType = inputType === 'password' ? 'text' : 'password'
              "
            >
              <Icon
                :name="inputType === 'password' ? 'ph:eye' : 'ph:eye-slash'"
              />
            </button>
          </div>
        </div>
        <div class="card-actions flex flex-col items-center">
          <div class="flex w-full flex-col space-y-4 md:space-y-6">
            <div>
              <button
                class="btn btn-primary btn-block rounded-xl"
                block
                @click="submit"
              >
                <span
                  v-if="isLoading"
                  class="loading loading-dots"
                ></span>
                <span v-else>{{ $t('auth.login.btnSignIn') }}</span>
              </button>
            </div>
            <NuxtLink
              to="/app/forgot-password"
              class="link-hover link text-center text-sm font-medium hover:underline"
              >{{ $t('auth.login.forgotPassword') }}</NuxtLink
            >
            <p class="flex flex-col text-center text-sm font-light">
              {{ $t('auth.login.register') }}
              <NuxtLink
                to="/app/register"
                class="link-hover link font-medium hover:underline"
              >
                {{ $t('auth.login.linkSignUp') }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
