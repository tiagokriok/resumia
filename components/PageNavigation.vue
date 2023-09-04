<script setup lang="ts">
  withDefaults(defineProps<{ title: string; options: boolean }>(), {
    title: '',
    options: false,
  })

  const router = useRouter()
</script>
<template>
  <div class="pb-16">
    <div
      class="flex items-center justify-between bg-base-300 h-16 inset-x-0 fixed top-0 px-4 z-50 shadow-md"
    >
      <button
        class="bg-primary-content h-10 w-10 rounded-full flex items-center justify-center"
        @click="router.back()"
      >
        <Icon
          name="ph:arrow-left-bold"
          class="text-primary"
        />
      </button>
      <div>
        <h1 class="font-semibold text-xl">{{ $t(title) }}</h1>
      </div>
      <button
        class="bg-primary h-10 w-10 rounded-full flex items-center justify-center"
        :class="{ invisible: !options }"
      >
        <Icon
          name="ph:dots-three-bold"
          class="text-primary"
        />
      </button>
    </div>
  </div>
</template>
