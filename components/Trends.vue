<script setup lang="ts">
  const trends = ref([])
</script>
<template>
  <div
    v-if="trends.length"
    class="flex flex-col space-y-2"
  >
    <div class="flex items-center justify-between">
      <p class="text-xl font-bold">Treding chats</p>
      <a
        href="#"
        class="text-gray-400 font-semibold text-lg"
        >See all</a
      >
    </div>
    <div class="flex items-center space-x-1 overflow-x-auto snap-x">
      <button
        class="flex snap-start flex-shrink-0 items-center space-x-2 bg-secondary rounded-full h-5 py-5 pl-1 pr-4 justify-between"
      >
        <div
          class="bg-secondary-content rounded-full h-8 w-8 flex items-center justify-center"
        >
          <p class="text-base font-semibold">#1</p>
        </div>
        <div>
          <p class="text-base font-semibold text-secondary-content">
            Case study
          </p>
        </div>
      </button>
      <div
        class="flex snap-start flex-shrink-0 items-center space-x-2 bg-secondary rounded-full h-5 py-5 pl-1 pr-4 justify-between"
      >
        <div
          class="bg-secondary-content rounded-full h-8 w-8 flex items-center justify-center"
        >
          <p class="text-base font-semibold">#2</p>
        </div>
        <div>
          <p class="text-base font-semibold text-secondary-content">
            Email Marketing
          </p>
        </div>
      </div>
      <div
        class="flex snap-start flex-shrink-0 items-center space-x-2 bg-secondary rounded-full h-5 py-5 pl-1 pr-4 justify-between"
      >
        <div
          class="bg-secondary-content rounded-full h-8 w-8 flex items-center justify-center"
        >
          <p class="text-base font-semibold">#3</p>
        </div>
        <div>
          <p class="text-base font-semibold text-secondary-content">
            Legal Document
          </p>
        </div>
      </div>
      <div
        class="flex snap-start flex-shrink-0 items-center space-x-2 bg-secondary rounded-full h-5 py-5 pl-1 pr-4 justify-between"
      >
        <div
          class="bg-secondary-content rounded-full h-8 w-8 flex items-center justify-center"
        >
          <p class="text-base font-semibold">#4</p>
        </div>
        <div>
          <p class="text-base font-semibold text-secondary-content">
            Media Planning
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
