<script lang="ts" setup>
  const languages = usePreferredLanguages()

  const { setLocale } = useI18n()

  const locale = useCookie('i18n_redirected')

  onMounted(() => {
    if (locale.value) {
      setLocale(locale.value)
    } else {
      setLocale(languages.value[0] || 'en-US')
    }
  })

  window.addEventListener('resize', () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  })
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
  .vh {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }
</style>
