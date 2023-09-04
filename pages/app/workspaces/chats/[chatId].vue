<script setup lang="ts">
  const route = useRoute()
</script>
<template>
  <div>{{ route.params.chatId }} && {{ route.query.embed }}</div>
</template>
