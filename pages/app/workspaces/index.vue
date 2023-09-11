<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['common'],
  })

  const search = ref('')

  const submit = async () => {
    console.log(search.value)
  }
</script>
<template>
  <div class="flex flex-col space-y-4">
    <Search
      label="common.search.label"
      placeholder="common.search.placeholder"
      v-model="search"
      @search="submit"
    />
    <Trends />
    <RecentlyViewed />
  </div>
</template>
