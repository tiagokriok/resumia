<script setup lang="ts">
  import { useAuthStore } from '../stores/auth'
  const { user } = useAuthStore()

  const avatar = computed(() => {
    const name = user.name
    const names = name.split(' ')
    if (names.length > 1) {
      const firstName = names.at(0)
      const lastName = names.at(-1)

      if (firstName && lastName) {
        return firstName.charAt(0) + lastName.charAt(0)
      }
    }
    return name.charAt(0)
  })
</script>
<template>
  <div
    v-if="user.avatar"
    class="avatar"
  >
    <div
      class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
    >
      <img
        :src="user.avatar"
        alt="avatar"
      />
    </div>
  </div>
  <div
    v-else
    class="avatar placeholder"
  >
    <div
      class="bg-neutral-focus text-neutral-content rounded-full w-10 ring ring-primary ring-offset-base-100 ring-offset-2"
    >
      <span class="text-2xl">{{ avatar }}</span>
    </div>
  </div>
</template>
