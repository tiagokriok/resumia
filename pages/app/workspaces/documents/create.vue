<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
    hideNavigation: true,
    hideHeader: true,
  })
</script>
<template>
  <div>
    <PageNavigation
      title="files.create.title"
      backTo="/app/workspaces/documents"
    />
    <FormCreateFile />
  </div>
</template>
