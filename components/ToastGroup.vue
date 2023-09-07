<template>
  <Teleport to="body">
    <NotificationGroup
      group="top-right"
      position="top"
    >
      <div
        class="fixed z-[999] inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none"
      >
        <div class="w-full max-w-sm">
          <Notification
            v-slot="{ notifications, close, hovering }"
            enter="ease-out duration-300 transition"
            enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
            enter-to="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
            move="transition duration-500"
            move-delay="delay-300"
          >
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="toast toast-top toast-end w-full sm:w-1/4"
              @mouseover="hovering(notification.id, true)"
              @mouseleave="hovering(notification.id, false)"
            >
              <ToastSuccess
                v-if="notification.type === 'success'"
                :notification="notification"
              >
                <template #close>
                  <button
                    class="btn btn-xs btn-ghost btn-circle"
                    @click="close(notification.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </template>
              </ToastSuccess>
              <ToastInfo
                v-if="notification.type === 'info'"
                :notification="notification"
              >
                <template #close>
                  <button
                    class="btn btn-xs btn-ghost btn-circle"
                    @click="close(notification.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </template>
              </ToastInfo>
              <ToastWarning
                v-if="notification.type === 'warning'"
                :notification="notification"
              >
                <template #close>
                  <button
                    class="btn btn-xs btn-ghost btn-circle"
                    @click="close(notification.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </template>
              </ToastWarning>
              <ToastError
                v-if="notification.type === 'error'"
                :notification="notification"
              >
                <template #close>
                  <button
                    class="btn btn-xs btn-ghost btn-circle"
                    @click="close(notification.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </template>
              </ToastError>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>
  </Teleport>
</template>
