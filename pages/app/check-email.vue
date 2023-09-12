<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    protected: false,
  })
</script>
<template>
  <div class="flex flex-col items-center justify-center space-y-4 my-auto">
    <div
      class="bg-secondary-content h-32 w-32 rounded-xl flex items-center justify-center"
    >
      <Icon
        name="ph:envelope-bold"
        class="h-16 w-16"
      />
    </div>
    <h1 class="text-3xl font-extrabold">{{ $t('auth.checkEmail.title') }}</h1>
    <p class="text-center">
      {{ $t('auth.checkEmail.description') }}
    </p>
    <NuxtLink
      class="btn btn-secondary text-center"
      href="mailto:"
      >{{ $t('auth.checkEmail.btnOpen') }}</NuxtLink
    >
    <NuxtLink
      to="/app/login"
      class="link no-underline"
      >{{ $t('auth.checkEmail.later') }}</NuxtLink
    >

    <p class="text-center flex-1">
      {{ $t('auth.checkEmail.notReceived') }}
      <NuxtLink
        to="/app/forgot-password"
        class="text-secondary font-semibold text-center"
      >
        {{ $t('auth.checkEmail.notReceivedLink') }}
      </NuxtLink>
    </p>
  </div>
</template>
