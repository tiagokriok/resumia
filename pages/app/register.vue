<script setup lang="ts">
  import { useMutation } from '@tanstack/vue-query'
  import { errorHandler } from '../../lib/Error'
  import { RegisterInput } from '../../server/modules/auth/dto/register.dto'
  import { useAuthStore } from '../../stores/auth'

  useHead({
    title: 'Register',
  })

  definePageMeta({
    layout: 'auth',
    protected: false,
  })

  const { $client } = useNuxtApp()

  const form = reactive<RegisterInput>({
    email: '',
    password: '',
    name: '',
  })

  const inputType = ref('password')

  const authStore = useAuthStore()

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: $client.auth.register.mutate,
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
      class="card border border-slate-700 bg-base-100 p-4 shadow-xl shadow-slate-700 md:w-96"
    >
      <div class="card-title">
        <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl">
          {{ $t('auth.register.title') }}
        </h1>
      </div>

      <div class="card-body md:space-y-4">
        <div class="form-control">
          <label
            for="name"
            class="text-md label block font-medium"
          >
            <span class="label-text"> {{ $t('auth.register.name') }}</span>
          </label>
          <input
            v-model="form.name"
            name="name"
            type="text"
            class="input input-bordered"
          />
        </div>
        <div class="form-control">
          <label
            for="email"
            class="text-md label block font-medium"
          >
            <span class="label-text"> {{ $t('auth.login.email') }}</span>
          </label>
          <input
            v-model="form.email"
            name="email"
            type="email"
            class="input input-bordered"
          />
        </div>
        <div class="form-control">
          <label
            for="password"
            class="text-md label block font-medium"
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
              class="input join-item input-bordered w-full"
            />
            <button
              class="btn btn-outline join-item"
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
        <div class="card-actions mt-4 flex flex-col items-center">
          <div class="flex w-full flex-col space-y-4 md:space-y-6">
            <div>
              <button
                class="btn btn-primary btn-block"
                block
                @click="submit"
              >
                <span
                  v-if="isLoading"
                  class="loading loading-dots"
                ></span>
                <span v-else>{{ $t('auth.register.btnSignUp') }}</span>
              </button>
            </div>
            <NuxtLink
              to="/app/login"
              class="link-hover link text-center text-sm font-medium hover:underline"
              >{{ $t('auth.login.title') }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
