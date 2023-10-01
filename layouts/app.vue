<script lang="ts" setup>
  const route = useRoute()
  const hideNavigation = computed(() => !!route.meta.hideNavigation)
  const hideHeader = computed(() => !!route.meta.hideHeader)

  const { isMobile } = useDevice()
</script>
<template>
  <Container>
    <div
      class="font-lato relative"
      :class="{
        vh: isMobile,
      }"
    >
      <Header v-if="!hideHeader" />
      <slot />
      <Navigation v-if="!hideNavigation" />
    </div>
  </Container>
  <ToastGroup />
</template>
