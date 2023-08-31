import { sseHooks } from '../utils/hooks'

export default defineEventHandler(async (event) => {
  const ctx = event.context

  if (!ctx.auth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { user } = ctx.auth

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const fileId = getRouterParam(event, 'fileId')
  console.log(fileId)

  // if (!process.dev) return { disabled: true }

  // Enable SSE endpoint
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'content-type', 'text/event-stream')
  setResponseStatus(event, 200)

  const sendEvent = (data: { id: string; name: string }) => {
    if (fileId !== data.id) event.node.res.end()
    event.node.res.write(`id: ${data.id}\n`)
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  sseHooks.hook('sse:event', sendEvent)

  // Let the connection opened
  event._handled = true
})
