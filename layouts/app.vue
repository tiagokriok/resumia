<script lang="ts" setup>
  const route = useRoute()
  const hideNavigation = computed(() => !!route.meta.hideNavigation)
  const hideHeader = computed(() => !!route.meta.hideHeader)
</script>
<template>
  <Container>
    <div class="m-2 font-lato relative vh">
      <Header v-if="!hideHeader" />
      <slot />
      <Navigation v-if="!hideNavigation" />
    </div>
  </Container>
  <ToastGroup />
</template>
