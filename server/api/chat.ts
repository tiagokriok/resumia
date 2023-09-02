import { LangChainStream, StreamingTextResponse } from 'ai'
import { sendPrompt } from '../providers/langchain'

export const runtime = 'edge'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const ctx = event.context

    if (!ctx.auth) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const { user } = ctx.auth

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Extract the `prompt` from the body of the request
    const { fileId, messages } = await readBody(event)

    console.log('fileId', fileId, 'messages', messages)

    if (!fileId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing file id',
      })
    }

    // if (!question) {
    //   throw createError({
    //     statusCode: 400,
    //     statusMessage: 'Bad Request',
    //     message: 'Missing question',
    //   })
    // }

    const { stream, handlers } = LangChainStream()

    sendPrompt(`${user.id}:${fileId}`, messages.at(-1).content, handlers).catch(
      console.error,
    )

    return new StreamingTextResponse(stream)
  })
})
