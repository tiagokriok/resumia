import { createHooks } from 'hookable'

export interface SSEHooks {
  'sse:event': (data: { id: string; name: string }) => void
}

export const sseHooks = createHooks<SSEHooks>()
