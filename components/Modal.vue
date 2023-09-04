<script lang="ts" setup>
  import { onClickOutside } from '@vueuse/core'
  import { cn } from '~/lib/utils'

  defineProps({
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
    },
    titleClass: {
      type: String,
    },
    marginTop: {
      type: String,
      default: 'mt-12',
    },
    rounded: {
      type: Boolean,
      default: true,
    },
  })

  const $emit = defineEmits(['close'])

  const dialog = ref(null)

  onClickOutside(dialog, () => {
    $emit('close')
  })

  const onAfterEnter = () => {
    console.log('after enter')
  }

  const onAfterLeave = () => {
    console.log('after leave')
  }

  const onBeforeEnter = () => {
    console.log('before enter')
  }

  const onBeforeLeave = () => {
    console.log('before leave')
  }
</script>
<template>
  <Teleport to="body">
    <HeadlessTransitionRoot
      appear
      :show="open"
      as="template"
    >
      <HeadlessDialog
        as="div"
        class="fixed inset-0 z-10"
        @close="$emit('close')"
      >
        <div class="flex h-full flex-col justify-center sm:block sm:p-0">
          <HeadlessTransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/40" />
          </HeadlessTransitionChild>

          <HeadlessTransitionChild
            as="template"
            enter="duration-500 ease-out transform translate-y-0"
            enter-from="translate-y-full"
            enter-to="translate-y-0"
            leave="duration-200 ease-in transform translate-y-full"
            leave-from="translate-y-0"
            leave-to="translate-y-full"
            @after-enter="onAfterEnter"
            @after-leave="onAfterLeave"
            @before-enter="onBeforeEnter"
            @before-leave="onBeforeLeave"
          >
            <div
              :class="
                cn(
                  'relative z-0 flex h-full w-full flex-col bg-neutral shadow-xl',
                  marginTop,
                  {
                    'rounded-t-lg': rounded,
                  },
                )
              "
            >
              <div
                v-if="title"
                class="relative z-10 flex w-full items-center justify-center rounded-t-lg bg-neutral py-6"
              >
                <div class="fixed">
                  <HeadlessDialogTitle
                    as="h3"
                    :class="cn('text-lg font-medium leading-6', titleClass)"
                  >
                    {{ $t(title) }}
                  </HeadlessDialogTitle>
                </div>
              </div>
              <HeadlessDialogPanel
                :class="
                  cn(
                    'pointer-events-auto absolute inset-x-0 bottom-0 top-0 mt-10 space-y-4 overflow-y-auto py-4 shadow-xl',
                    {
                      'mt-4': !title,
                    },
                  )
                "
              >
                <slot name="content" />
              </HeadlessDialogPanel>
            </div>
          </HeadlessTransitionChild>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </Teleport>
</template>
