<script lang="ts" setup>
  import { usePreferredLanguages } from '@vueuse/core'

  const languages = usePreferredLanguages()

  const { setLocale } = useI18n()

  setLocale(languages.value[0] || 'en-US')
</script>

<template>
  <Container>
    <section
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 space-y-4"
    >
      <slot />
    </section>
  </Container>

  <ToastGroup />
</template>

<style scoped></style>
