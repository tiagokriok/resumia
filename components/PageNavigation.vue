<script setup lang="ts">
  withDefaults(
    defineProps<{ title: string; options: boolean; backTo?: string }>(),
    {
      title: '',
      options: false,
    },
  )

  const router = useRouter()
</script>
<template>
  <div class="pb-16">
    <div
      class="flex items-center justify-between glass bg-secondary dark:bg-primary-content h-16 inset-x-0 fixed top-0 px-4 z-50 shadow-md"
    >
      <NuxtLink
        v-if="backTo"
        :to="backTo"
        class="bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
      >
        <Icon
          name="ph:arrow-left-bold"
          class="text-secondary"
        />
      </NuxtLink>
      <button
        v-else
        class="bg-slate-50 h-10 w-10 rounded-full flex items-center justify-center"
        @click="router.back()"
      >
        <Icon
          name="ph:arrow-left-bold"
          class="text-secondary"
        />
      </button>
      <div>
        <h1 class="font-semibold text-xl text-slate-50">
          {{ $t(title) }}
        </h1>
      </div>
      <button
        class="dropdown dropdown-bottom dropdown-end bg-primary-content h-10 w-10 rounded-full flex items-center justify-center"
        :class="{ invisible: !options }"
      >
        <Icon
          name="ph:dots-three-bold"
          class="text-primary"
        />
        <ul
          class="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-xl w-40 text-primary"
        >
          <slot name="options" />
        </ul>
      </button>
    </div>
  </div>
</template>
