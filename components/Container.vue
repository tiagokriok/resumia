<script lang="ts" setup>
  defineProps({
    as: {
      type: String,
      default: 'div',
    },
    ui: {
      type: Object,
      default: () => ({
        base: 'mx-auto',
        padding: 'px-4 sm:px-6 lg:px-8',
        constrained: 'max-w-7xl md:max-w-4xl',
      }),
    },
  })
</script>
<template>
  <component
    :is="as"
    :class="[ui.base, ui.padding, ui.constrained]"
  >
    <slot />
  </component>
</template>
