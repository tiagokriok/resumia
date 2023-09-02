<script setup lang="ts">
  definePageMeta({
    middleware: ['auth'],
    layout: 'app',
    protected: true,
    roles: ['owner', 'common'],
  })

  const search = ref('')

  const submit = async () => {
    console.log(search.value)
  }
</script>
<template>
  <div class="flex flex-col space-y-4 my-2">
    <Search
      label="Search chat"
      placeholder="Search here"
      v-model="search"
      @search="submit"
    />
    <Trends />
    <RecentlyViewed />
  </div>
</template>
