import { Chats } from '~/server/modules/chats/chats.schema'
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

  const chatId = getRouterParam(event, 'chatId')

  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing chatId',
    })
  }

  const chat = await Chats.findOne({ id: chatId, 'owner.id': user.id })

  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Chat not found',
    })
  }

  // if (!process.dev) return { disabled: true }

  // Enable SSE endpoint
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setHeader(event, 'content-type', 'text/event-stream')
  setResponseStatus(event, 200)

  const sendEvent = (data: { id: string; name: string }) => {
    if (chat.file.id !== data.id) event.node.res.end()
    event.node.res.write(`id: ${data.id}\n`)
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  sseHooks.hook('sse:event', sendEvent)

  // Let the connection opened
  event._handled = true
})
