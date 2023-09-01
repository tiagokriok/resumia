import { createHooks } from 'hookable'

export interface SSEHooks {
  'sse:event': (data: { id: string; name: string; finished: boolean }) => void
}

export const sseHooks = createHooks<SSEHooks>()
