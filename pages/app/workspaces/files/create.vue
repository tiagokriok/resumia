<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
    hideNavigation: true,
    hideHeader: true,
  })
</script>
<template>
  <div>
    <PageNavigation title="files.create.title" />
    <FormCreateFile />
  </div>
</template>
